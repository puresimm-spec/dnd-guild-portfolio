// API tests that need no database and no API key: every request here is rejected
// by validation (or answered by /api/health) before anything touches Postgres or Gemini.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

let server;
let base;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const post = (path, body, raw = false) =>
  fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: raw ? body : JSON.stringify(body),
  });

test('GET /api/health answers ok', async () => {
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
});

test('POST /api/chat rejects an empty message', async () => {
  const res = await post('/api/chat', { message: '   ' });
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /กรุณาพิมพ์ข้อความ/);
});

test('POST /api/chat rejects a message over 1,000 characters', async () => {
  const res = await post('/api/chat', { message: 'ก'.repeat(1001) });
  assert.equal(res.status, 400);
});

test('POST /api/chat rejects a malformed conversation id', async () => {
  const res = await post('/api/chat', { message: 'hi', conversationId: 'bad id!' });
  assert.equal(res.status, 400);
});

test('broken JSON gets a JSON error, not an HTML page', async () => {
  const res = await post('/api/chat', '{"message": ', true);
  assert.equal(res.status, 400);
  assert.match(res.headers.get('content-type'), /application\/json/);
  assert.ok((await res.json()).error);
});

test('GET /api/chat/:id rejects a malformed id', async () => {
  const res = await fetch(`${base}/api/chat/x`);
  assert.equal(res.status, 400);
});

test('POST /api/build-chat rejects an unknown goal', async () => {
  const res = await post('/api/build-chat', {
    memberId: 1,
    goal: 'dragon',
    messages: [{ role: 'user', content: 'hi' }],
  });
  assert.equal(res.status, 400);
});

test('POST /api/build-chat requires the last message to come from the user', async () => {
  const res = await post('/api/build-chat', {
    memberId: 1,
    goal: 'tank',
    messages: [
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello' },
    ],
  });
  assert.equal(res.status, 400);
});

test('POST /api/build-chat rejects more than 12 messages of history', async () => {
  const messages = Array.from({ length: 13 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: 'x' }));
  const res = await post('/api/build-chat', { memberId: 1, goal: 'tank', messages });
  assert.equal(res.status, 400);
});

test('unknown routes return 404', async () => {
  const res = await fetch(`${base}/api/nope`);
  assert.equal(res.status, 404);
});

test('rate limit: the 16th AI request within a minute gets 429', async () => {
  // a fresh app, so the requests above do not count
  const app = createApp().listen(0);
  await new Promise((resolve) => app.once('listening', resolve));
  const url = `http://127.0.0.1:${app.address().port}/api/chat`;
  const statuses = [];
  for (let i = 0; i < 16; i++) {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    statuses.push(res.status);
  }
  app.close();
  assert.equal(statuses.slice(0, 15).every((s) => s === 400), true);
  assert.equal(statuses[15], 429);
});
