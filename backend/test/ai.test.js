// AI-layer tests with a fake fetch: no network, no real API key.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { askAI, askBuildAdvisor, buildSystemPrompt, AIError } from '../src/ai.js';

const realFetch = globalThis.fetch;
const realKey = process.env.LLM_API_KEY;
let calls;

// fake Gemini: each entry is a reply text (200), a status number (error), or 'TIMEOUT' (request too slow)
function fakeGemini(...responses) {
  globalThis.fetch = async (url, init) => {
    calls.push({ ...JSON.parse(init.body), model: url.match(/models\/([^:]+):/)[1] });
    const next = responses.shift();
    if (next === 'TIMEOUT') throw Object.assign(new Error('timed out'), { name: 'TimeoutError' });
    if (typeof next === 'number') return { ok: false, status: next, text: async () => 'error' };
    return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: next }] } }] }) };
  };
}

const realModel = process.env.LLM_MODEL;
const realFallback = process.env.LLM_FALLBACK_MODEL;
const restore = (name, value) => (value === undefined ? delete process.env[name] : (process.env[name] = value));

beforeEach(() => {
  calls = [];
  process.env.LLM_API_KEY = 'test-key';
  process.env.LLM_MODEL = 'main-model';
  process.env.LLM_FALLBACK_MODEL = 'none'; // most tests check one model; the fallback tests turn it on
});
afterEach(() => {
  globalThis.fetch = realFetch;
  restore('LLM_API_KEY', realKey);
  restore('LLM_MODEL', realModel);
  restore('LLM_FALLBACK_MODEL', realFallback);
});

const context = {
  member: { name: 'Brannoc Ironvow', nickname: null, dnd_class: 'Paladin', level: 9, role: 'สาย build: ถึกทน (Tank)', skills: [] },
  goal: 'tank',
  base: { STR: 17, DEX: 9, CON: 16, INT: 10, WIS: 12, CHA: 15 },
  current: { STR: 17, DEX: 9, CON: 16, INT: 10, WIS: 12, CHA: 15 },
  pointsLeft: 4,
  statMin: 3,
  statMax: 20,
  lang: 'th',
};
const ask = [{ role: 'user', content: 'วาง build ให้หน่อย' }];
const zero = { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 };

test('build advisor keeps a valid point allocation (zeros dropped)', async () => {
  fakeGemini(JSON.stringify({ reply: 'ok', allocation: { ...zero, STR: 1, CON: 2, CHA: 1 } }));
  const result = await askBuildAdvisor(context, ask);
  assert.deepEqual(result, { reply: 'ok', allocation: { STR: 1, CON: 2, CHA: 1 } });
});

test('build advisor drops an allocation that spends more than the points left', async () => {
  fakeGemini(JSON.stringify({ reply: 'too many', allocation: { ...zero, CON: 4, STR: 1 } }));
  assert.equal((await askBuildAdvisor(context, ask)).allocation, null);
});

test('build advisor drops an allocation that pushes a stat above 20', async () => {
  fakeGemini(JSON.stringify({ reply: 'too high', allocation: { ...zero, STR: 4 } }));
  assert.equal((await askBuildAdvisor(context, ask)).allocation, null);
});

test('build advisor allows trading points (lower one stat to raise another)', async () => {
  fakeGemini(JSON.stringify({ reply: 'trade', allocation: { ...zero, DEX: -2, CON: 2, STR: 1, CHA: 1, WIS: 2 } }));
  assert.deepEqual((await askBuildAdvisor(context, ask)).allocation, { STR: 1, DEX: -2, CON: 2, WIS: 2, CHA: 1 });
});

test('build advisor falls back to plain text when the model does not return JSON', async () => {
  fakeGemini('just text');
  assert.deepEqual(await askBuildAdvisor(context, ask), { reply: 'just text', allocation: null });
});

test('build advisor asks for low thinking, and retries without it if the model rejects it (400)', async () => {
  fakeGemini(400, JSON.stringify({ reply: 'ok', allocation: zero }));
  const result = await askBuildAdvisor(context, ask);
  assert.equal(result.reply, 'ok');
  assert.equal(calls.length, 2);
  assert.equal(calls[0].generationConfig.thinkingConfig.thinkingLevel, 'low');
  assert.equal(calls[1].generationConfig.thinkingConfig, undefined);
});

test('a slow main model switches to the fallback model', async () => {
  process.env.LLM_FALLBACK_MODEL = 'backup-model';
  fakeGemini('TIMEOUT', 'สวัสดีจากโมเดลสำรอง');
  const reply = await askAI({ group: { name: 'x', projects: [] }, members: [] }, ask);
  assert.equal(reply, 'สวัสดีจากโมเดลสำรอง');
  assert.deepEqual(calls.map((c) => c.model), ['main-model', 'backup-model']);
});

test('a main model that keeps returning 503 also switches to the fallback', async () => {
  process.env.LLM_FALLBACK_MODEL = 'backup-model';
  fakeGemini(503, 503, 503, JSON.stringify({ reply: 'ok', allocation: zero }));
  const result = await askBuildAdvisor(context, ask);
  assert.equal(result.reply, 'ok');
  assert.equal(calls.at(-1).model, 'backup-model');
});

test('with no fallback configured, a timeout reaches the user as TIMEOUT', async () => {
  fakeGemini('TIMEOUT');
  await assert.rejects(askAI({ group: { name: 'x', projects: [] }, members: [] }, ask), (err) => err.code === 'TIMEOUT');
  assert.equal(calls.length, 1);
});

test('askAI throws NO_KEY when no API key is configured', async () => {
  delete process.env.LLM_API_KEY;
  await assert.rejects(askAI({ group: { name: 'x', projects: [] }, members: [] }, ask), (err) => err instanceof AIError && err.code === 'NO_KEY');
});

test('system prompt carries the group, its contact, every member with role and projects, and the sample characters', () => {
  const prompt = buildSystemPrompt({
    group: { name: 'Buddy Build', tagline: 't', concept: 'c', highlights: [], contact: { email: 'team@example.com', github: 'https://github.com/x/y' }, projects: [] },
    members: [
      { name: 'Puree Simma', nickname: 'พอล (Paul)', role: 'วางโครงสร้าง Backend', skills: ['Python'], projects: [{ title: 'miniProject', description: 'd', tech: [] }] },
      { name: 'Nattavut Wongjeen', nickname: 'แม็ค (Max)', role: 'ข้อมูล', skills: [], projects: [] },
    ],
    characters: [{ name: 'Brannoc Ironvow', dnd_class: 'Paladin', level: 9, role: 'สาย build: ถึกทน (Tank)', stats: {} }],
    website: { tech: {} },
  });
  assert.match(prompt, /Buddy Build/);
  assert.match(prompt, /team@example\.com/);
  assert.match(prompt, /จำนวนสมาชิก: 2 คน/);
  assert.match(prompt, /สมาชิกคนที่ 1: Puree Simma/);
  assert.match(prompt, /บทบาทในทีม: วางโครงสร้าง Backend/);
  assert.match(prompt, /miniProject/);
  assert.match(prompt, /ยังไม่มีผลงานที่บันทึกไว้/); // Max has no projects yet
  assert.match(prompt, /ห้องฝึก build ตัวที่ 1: Brannoc Ironvow/);
  assert.match(prompt, /ห้ามแต่งข้อมูลเพิ่ม/);
});
