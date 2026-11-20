// จุดเริ่มต้นของ Backend: สร้างเซิร์ฟเวอร์ Express และกำหนดเส้นทาง (API)
import { randomUUID } from 'node:crypto';
import express from 'express';
import cors from 'cors';
import { setup, getPortfolio, getMember, ensureConversation, saveMessages, getMessages } from './db.js';
import { askAI, askBuildAdvisor, AIError, BUILD_GOALS, STAT_KEYS } from './ai.js';

const app = express();
app.set('trust proxy', 1); // บน Render มี proxy คั่นอยู่ ต้องเชื่อ IP จริงของผู้ใช้
app.use(cors());
app.use(express.json({ limit: '10kb' })); // กันคนส่ง body ก้อนใหญ่มาถล่ม

const MAX_MESSAGE_LENGTH = 1000;
const CONVERSATION_ID_PATTERN = /^[a-zA-Z0-9-]{8,64}$/;

// ---------- จำกัดจำนวนคำขอ: กันคนยิงรัวจนโควตา AI หมด ----------
const hits = new Map(); // ip -> [เวลาที่ยิง, ...]
function rateLimit(req, res, next) {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 15; // 15 ครั้งต่อนาทีต่อ IP
  const recent = (hits.get(req.ip) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    return res.status(429).json({ error: 'ส่งข้อความเร็วเกินไป รอสักครู่แล้วลองใหม่นะ' });
  }
  recent.push(now);
  hits.set(req.ip, recent);
  if (hits.size > 1000) hits.clear(); // กันหน่วยความจำบวม
  next();
}

// ---------- เส้นทาง API ----------
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/portfolio', async (_req, res) => {
  try {
    res.json(await getPortfolio());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'โหลดข้อมูลไม่สำเร็จ' });
  }
});

// ดึงประวัติแชต (ให้หน้าเว็บโหลดบทสนทนาเดิมหลังรีเฟรช)
app.get('/api/chat/:id', async (req, res) => {
  if (!CONVERSATION_ID_PATTERN.test(req.params.id)) {
    return res.status(400).json({ error: 'รหัสการสนทนาไม่ถูกต้อง' });
  }
  try {
    res.json({ messages: await getMessages(req.params.id, 100) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'โหลดประวัติไม่สำเร็จ' });
  }
});

// ส่งข้อความหา AI
// รับ:  { conversationId?: string, message: string }
// ส่งกลับ: { conversationId, reply }
app.post('/api/chat', rateLimit, async (req, res) => {
  const { conversationId: incomingId, message } = req.body ?? {};

  // 1) ตรวจข้อมูลที่รับมา
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'กรุณาพิมพ์ข้อความ' });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `ข้อความยาวเกิน ${MAX_MESSAGE_LENGTH} ตัวอักษร` });
  }
  if (incomingId !== undefined && !CONVERSATION_ID_PATTERN.test(incomingId)) {
    return res.status(400).json({ error: 'รหัสการสนทนาไม่ถูกต้อง' });
  }
  const conversationId = incomingId ?? randomUUID(); // ไม่มีรหัส = เริ่มคุยใหม่

  try {
    // 2) รวบรวมบริบท: ประวัติเดิม + ข้อความใหม่ + ข้อมูล portfolio
    await ensureConversation(conversationId);
    const history = await getMessages(conversationId, 20);
    const userMessage = { role: 'user', content: message.trim() };
    const portfolio = await getPortfolio();

    // 3) ถาม AI
    const reply = await askAI(portfolio, [...history, userMessage]);

    // 4) บันทึกทั้งคำถามและคำตอบ (บันทึกหลัง AI ตอบสำเร็จเท่านั้น
    //    ถ้า AI พัง จะไม่มีคำถามค้างในประวัติโดยไม่มีคำตอบ)
    await saveMessages(conversationId, [userMessage, { role: 'assistant', content: reply }]);

    res.json({ conversationId, reply });
  } catch (err) {
    aiErrorResponse(res, err);
  }
});

// ---------- ที่ปรึกษา build (บอร์ดเควสต์ในหน้ารายละเอียดสมาชิก) ----------
// ค่าเหล่านี้ต้องตรงกับฝั่งหน้าเว็บ: FREE_POINTS ใน MemberScreen.jsx, STAT_MIN/STAT_MAX ใน rules.js
const FREE_POINTS = 4;
const STAT_MIN = 3;
const STAT_MAX = 20;
const MAX_BUILD_HISTORY = 12; // ส่งประวัติให้ AI ไม่เกินกี่ข้อความ
const MAX_REPLY_LENGTH = 4000; // ข้อความของ AI ที่หน้าเว็บส่งกลับมาเป็นประวัติ

const baseStat = (stats, k) => (Number.isFinite(Number(stats?.[k])) ? Number(stats[k]) : 10);

function aiErrorResponse(res, err) {
  console.error(err);
  if (err instanceof AIError) {
    const status = err.code === 'NO_KEY' ? 503 : 502;
    const text =
      err.code === 'NO_KEY'
        ? 'ระบบ AI ยังไม่ได้ตั้งค่า'
        : err.code === 'TIMEOUT'
          ? 'AI ตอบช้าเกินไป ลองใหม่อีกครั้งนะ'
          : 'ติดต่อ AI ไม่สำเร็จ ลองใหม่อีกครั้งนะ';
    return res.status(status).json({ error: text });
  }
  res.status(500).json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' });
}

// รับ: { memberId, goal, stats: { STR, ... }, messages: [{ role, content }], lang }
// ส่งกลับ: { reply, allocation }  (allocation = null ถ้าไม่ได้แนะนำให้ย้ายแต้ม)
app.post('/api/build-chat', rateLimit, async (req, res) => {
  const { memberId, goal, stats, messages, lang } = req.body ?? {};

  // 1) ตรวจข้อมูลที่รับมา
  if (!Number.isInteger(memberId) || !Object.hasOwn(BUILD_GOALS, goal ?? '')) {
    return res.status(400).json({ error: 'ข้อมูลเควสต์ไม่ถูกต้อง' });
  }
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_BUILD_HISTORY) {
    return res.status(400).json({ error: 'ประวัติการสนทนาไม่ถูกต้อง' });
  }
  const validMessage = (m, i) =>
    m &&
    (m.role === 'user' || m.role === 'assistant') &&
    typeof m.content === 'string' &&
    m.content.trim() &&
    m.content.length <= (m.role === 'user' ? MAX_MESSAGE_LENGTH : MAX_REPLY_LENGTH) &&
    (i < messages.length - 1 || m.role === 'user'); // ข้อความสุดท้ายต้องเป็นคำถามของผู้ใช้
  if (!messages.every(validMessage)) {
    return res.status(400).json({ error: `ข้อความยาวเกิน ${MAX_MESSAGE_LENGTH} ตัวอักษร หรือรูปแบบไม่ถูกต้อง` });
  }

  try {
    const member = await getMember(memberId);
    if (!member) return res.status(404).json({ error: 'ไม่พบตัวละครนี้' });

    // 2) ค่าปัจจุบันในตาราง ต้องอยู่ในช่วง และใช้แต้มไม่เกินที่มี
    const base = Object.fromEntries(STAT_KEYS.map((k) => [k, baseStat(member.stats, k)]));
    const current = {};
    for (const k of STAT_KEYS) {
      const v = stats?.[k];
      if (!Number.isInteger(v) || v < STAT_MIN || v > STAT_MAX) {
        return res.status(400).json({ error: 'ค่าสถานะไม่ถูกต้อง' });
      }
      current[k] = v;
    }
    const spent = STAT_KEYS.reduce((sum, k) => sum + (current[k] - base[k]), 0);
    if (spent > FREE_POINTS) return res.status(400).json({ error: 'ใช้แต้มเกินที่กำหนด' });

    // 3) ถาม AI
    const result = await askBuildAdvisor(
      {
        member,
        goal,
        base,
        current,
        pointsLeft: FREE_POINTS - spent,
        statMin: STAT_MIN,
        statMax: STAT_MAX,
        lang: lang === 'en' ? 'en' : 'th',
      },
      messages.map((m) => ({ role: m.role, content: m.content.trim() }))
    );
    res.json(result);
  } catch (err) {
    aiErrorResponse(res, err);
  }
});

// ---------- เริ่มเซิร์ฟเวอร์ ----------
const port = Number(process.env.PORT ?? 3001);
setup()
  .then(() => app.listen(port, () => console.log(`Server is running on port ${port}`)))
  .catch((err) => {
    console.error('เตรียมฐานข้อมูลไม่สำเร็จ:', err);
    process.exit(1);
  });
