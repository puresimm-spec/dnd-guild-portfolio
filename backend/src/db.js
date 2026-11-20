// ไฟล์นี้ดูแลทุกอย่างที่เกี่ยวกับฐานข้อมูล
import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// โฟลเดอร์ backend/db (เก็บ schema.sql และ seed.json)
const dbDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../db');
const readFile = (name) => fs.readFileSync(path.join(dbDir, name), 'utf8');

// Pool = กลุ่มการเชื่อมต่อที่ใช้ซ้ำได้ ไม่ต้องเปิดการเชื่อมต่อใหม่ทุกคำขอ
// (export ไว้ให้เทสต์ปิดการเชื่อมต่อตอนจบ)
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // บน Render ต้องใช้ SSL; ในเครื่องไม่ต้อง
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// ข้อมูลเว็บไซต์และทีมผู้พัฒนาตัวจริง (ส่วน "website" ใน seed.json)
// (เทคโนโลยีที่ใช้, ลิงก์ซอร์สโค้ด) ไม่ได้เก็บลงฐานข้อมูล เพราะเปลี่ยนเฉพาะตอนแก้ไฟล์ seed แล้ว restart อยู่แล้ว
let website = null;

// ---------- เริ่มต้นระบบ: สร้างตาราง + ใส่ข้อมูล portfolio ----------
export async function setup() {
  // 1) สร้างตาราง (ถ้ายังไม่มี)
  await pool.query(readFile('schema.sql'));

  // 2) โหลดข้อมูลจาก seed.json ใส่ลงตาราง
  //    ใช้ transaction: ถ้าพังกลางทาง ทุกอย่างย้อนกลับ ข้อมูลไม่ค้างครึ่งๆ กลางๆ
  //    หมายเหตุ: ทุกครั้งที่ server เริ่ม จะเขียนทับข้อมูล portfolio ด้วย seed.json
  //    (seed.json คือแหล่งข้อมูลหลัก) แต่ประวัติแชตไม่ถูกแตะ
  const seed = JSON.parse(readFile('seed.json'));
  website = seed.website ?? null;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const g = seed.group;
    // $1, $2, ... คือ placeholder: ส่งค่าแยกจากคำสั่ง SQL เพื่อกัน SQL injection
    // en = ข้อความภาษาอังกฤษ (ไม่มีก็เป็น {} หน้าเว็บจะใช้ภาษาไทยแทน)
    const en = (obj) => JSON.stringify(obj?.en ?? {});
    await client.query(
      `INSERT INTO group_info (id, name, tagline, concept, highlights, contact, en)
       VALUES (1, $1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE
       SET name = $1, tagline = $2, concept = $3, highlights = $4, contact = $5, en = $6`,
      [g.name, g.tagline, g.concept, g.highlights, JSON.stringify(g.contact), en(g)]
    );

    // ล้างของเก่าก่อนใส่ใหม่ (projects ก่อน เพราะอ้างอิง members อยู่)
    await client.query('DELETE FROM projects');
    await client.query('DELETE FROM members');

    const addProject = (memberId, p) =>
      client.query(
        `INSERT INTO projects (member_id, title, description, tech, github_url, en)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [memberId, p.title, p.description, p.tech ?? [], p.github_url ?? null, en(p)]
      );

    // ผลงานของทั้งกลุ่ม (member_id = null)
    for (const p of g.projects) await addProject(null, p);

    // ใส่ทีละคน + ผลงานของเขา
    //   kind = 'team'   สมาชิกจริงของกลุ่ม (seed.members) แสดงในห้องโถง
    //   kind = 'sample' ตัวละครตัวอย่าง (seed.sample_characters) แสดงในห้องฝึก build
    const addPerson = async (kind, m, index) => {
      const { rows } = await client.query(
        `INSERT INTO members
           (kind, name, nickname, dnd_class, level, role, bio, quote, skills, stats, github_url, photo, portrait, sort, en)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         RETURNING id`,                       // ขอ id ที่เพิ่งสร้างกลับมาใช้ผูกกับ projects
        [kind, m.name, m.nickname ?? null, m.dnd_class, m.level ?? 1, m.role ?? null, m.bio ?? null, m.quote ?? null,
         m.skills ?? [], JSON.stringify(m.stats ?? {}), m.github_url ?? null, m.photo ?? null, m.portrait ?? null,
         index, en(m)]
      );
      for (const p of m.projects ?? []) await addProject(rows[0].id, p);
    };
    for (const [index, m] of seed.members.entries()) await addPerson('team', m, index);
    for (const [index, c] of (seed.sample_characters ?? []).entries()) await addPerson('sample', c, index);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release(); // คืนการเชื่อมต่อกลับ pool เสมอ
  }
}

// ---------- ดึงข้อมูล portfolio ทั้งหมด (ใช้ทั้งหน้าเว็บและ AI) ----------
export async function getPortfolio() {
  const { rows: groups } = await pool.query('SELECT * FROM group_info WHERE id = 1');
  const { rows: people } = await pool.query('SELECT * FROM members ORDER BY kind, sort');
  const { rows: projects } = await pool.query('SELECT * FROM projects ORDER BY id');

  // จับผลงานเข้ากับเจ้าของ: member_id ตรงกับ id สมาชิก
  const withProjects = people.map((m) => ({
    ...m,
    projects: projects.filter((p) => p.member_id === m.id),
  }));

  return {
    group: {
      ...groups[0],
      projects: projects.filter((p) => p.member_id === null), // ผลงานกลุ่ม
    },
    members: withProjects.filter((m) => m.kind === 'team'), // สมาชิกจริงของกลุ่ม
    characters: withProjects.filter((m) => m.kind === 'sample'), // ตัวละครตัวอย่างในห้องฝึก build
    website, // ข้อมูลเว็บไซต์ (เทคโนโลยี, ซอร์สโค้ด)
  };
}

// ดึงตัวละครตัวอย่างหนึ่งตัวตาม id (ใช้กับที่ปรึกษา build) ไม่พบหรือไม่ใช่ตัวละครตัวอย่าง = null
export async function getCharacter(id) {
  const { rows } = await pool.query(`SELECT * FROM members WHERE id = $1 AND kind = 'sample'`, [id]);
  return rows[0] ?? null;
}

// ---------- ประวัติแชต ----------

// สร้างการสนทนาใหม่ถ้ายังไม่มี (ถ้ามีแล้วไม่ทำอะไร)
export async function ensureConversation(id) {
  await pool.query('INSERT INTO conversations (id) VALUES ($1) ON CONFLICT (id) DO NOTHING', [id]);
}

// บันทึกข้อความหลายข้อความในครั้งเดียว: [{ role, content }, ...]
export async function saveMessages(conversationId, messages) {
  for (const m of messages) {
    await pool.query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)',
      [conversationId, m.role, m.content]
    );
  }
}

// ดึงข้อความล่าสุดของการสนทนา เรียงจากเก่าไปใหม่
export async function getMessages(conversationId, limit = 20) {
  // ดึงแบบใหม่→เก่าเพื่อเอาแค่ล่าสุด แล้วกลับลำดับให้เป็นเก่า→ใหม่
  const { rows } = await pool.query(
    `SELECT role, content, created_at FROM messages
     WHERE conversation_id = $1 ORDER BY id DESC LIMIT $2`,
    [conversationId, limit]
  );
  return rows.reverse();
}
