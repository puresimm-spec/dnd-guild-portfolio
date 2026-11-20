-- โครงสร้างฐานข้อมูล: รันซ้ำได้ปลอดภัย (IF NOT EXISTS)

-- ข้อมูลกลุ่ม: มีแถวเดียวเสมอ (id = 1)
CREATE TABLE IF NOT EXISTS group_info (
  id         INT PRIMARY KEY CHECK (id = 1),
  name       TEXT NOT NULL,
  tagline    TEXT,
  concept    TEXT,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  contact    JSONB  NOT NULL DEFAULT '{}'
);

-- สมาชิก = "ตัวละคร" ในปาร์ตี้
CREATE TABLE IF NOT EXISTS members (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  nickname   TEXT,
  dnd_class  TEXT NOT NULL,            -- คลาส เช่น Artificer
  level      INT  NOT NULL DEFAULT 1,
  role       TEXT,                     -- สาย build ของตัวละคร เช่น ถึกทน (Tank)
  bio        TEXT,
  quote      TEXT,                     -- คำคมประจำตัวละคร
  skills     TEXT[] NOT NULL DEFAULT '{}',
  stats      JSONB  NOT NULL DEFAULT '{}',  -- {"STR":8,"DEX":12,...}
  github_url TEXT,
  photo      TEXT,
  sort       INT NOT NULL DEFAULT 0    -- ลำดับแสดงผล
);

-- ผลงาน = "เควสต์"; member_id เป็น NULL = ผลงานของทั้งกลุ่ม
CREATE TABLE IF NOT EXISTS projects (
  id          SERIAL PRIMARY KEY,
  member_id   INT REFERENCES members(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  tech        TEXT[] NOT NULL DEFAULT '{}',
  github_url  TEXT
);

-- ประวัติแชต: 1 การสนทนา มีหลายข้อความ
CREATE TABLE IF NOT EXISTS conversations (
  id         TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id              SERIAL PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, id);

-- ข้อความภาษาอังกฤษของข้อมูลที่แสดงบนเว็บ (ค่าหลักในแต่ละช่องเป็นภาษาไทย)
-- เช่น members.en = {"role": "...", "bio": "...", "quote": "..."}
-- ใช้ ADD COLUMN IF NOT EXISTS เพื่อเพิ่มให้ฐานข้อมูลเดิมที่สร้างไว้แล้ว โดยไม่ต้องลบทิ้ง
ALTER TABLE group_info ADD COLUMN IF NOT EXISTS en JSONB NOT NULL DEFAULT '{}';
ALTER TABLE members    ADD COLUMN IF NOT EXISTS en JSONB NOT NULL DEFAULT '{}';
ALTER TABLE projects   ADD COLUMN IF NOT EXISTS en JSONB NOT NULL DEFAULT '{}';

-- members เก็บทั้งสมาชิกจริงของกลุ่มและตัวละครตัวอย่างในห้องฝึก build
--   kind = 'team' สมาชิกจริง, 'sample' ตัวละครตัวอย่าง
--   portrait = ชื่อภาพพิกเซลครึ่งตัวใน frontend/src/portraits.js (เช่น 'paul')
ALTER TABLE members ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'team';
ALTER TABLE members ADD COLUMN IF NOT EXISTS portrait TEXT;
