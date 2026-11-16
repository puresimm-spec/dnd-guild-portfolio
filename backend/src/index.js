// จุดเริ่มต้นของ Backend: สร้างเซิร์ฟเวอร์ Express และกำหนดเส้นทาง (API)
import { randomUUID } from 'node:crypto';
import express from 'express';
import cors from 'cors';
import { setup, getPortfolio, ensureConversation, saveMessages, getMessages } from './db.js';
import { askAI, AIError } from './ai.js';

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
});

// ---------- เริ่มเซิร์ฟเวอร์ ----------
const port = Number(process.env.PORT ?? 3001);
setup()
  .then(() => app.listen(port, () => console.log(`Server is running on port ${port}`)))
  .catch((err) => {
    console.error('เตรียมฐานข้อมูลไม่สำเร็จ:', err);
    process.exit(1);
  });
