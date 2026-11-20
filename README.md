# ⚔ Buddy Build: Guild Portfolio

เว็บพอร์ตโฟลิโอธีม **Dungeons & Dragons** ของกิลด์ Buddy Build กิลด์ที่ช่วยนักผจญภัยวาง build ตัวละครตามสายที่อยากเป็น ผู้เยี่ยมชมดูการ์ดตัวละคร ลองย้ายแต้มค่าสถานะ ให้ AI ช่วยวาง build และคุยกับ **Guild Keeper** (AI) เพื่อถามเรื่องกิลด์ ทีมพัฒนา และเว็บนี้

> **English:** A Dungeons & Dragons–themed portfolio site with a stat planner, an AI build advisor and an AI hall keeper that answers only from the portfolio data. Thai / English UI, pixel-art characters drawn in code.

สร้างด้วย React, Express, PostgreSQL และ Google Gemini API

## Live demo

| ส่วน | ลิงก์ |
| --- | --- |
| เว็บไซต์ | https://dnd-guild-web.onrender.com |
| ตรวจสถานะ backend | https://dnd-guild-web.onrender.com/api/health |

> Render แบบฟรีจะหลับเมื่อไม่มีคนใช้ เปิดครั้งแรกอาจต้องรอ 30–60 วินาที ถ้าหน้าเว็บขึ้น "ประตูห้องโถงถูกปิดอยู่" ให้รอแล้วกดลองใหม่

## ทีมพัฒนา

| ชื่อ-นามสกุล | ชื่อเล่น | ตำแหน่ง | คลาสในเว็บ | GitHub |
| --- | --- | --- | --- | --- |
| Puree Simma | พอล (Paul) | AI Engineer · นักพัฒนา | Monk | [puresimm-spec](https://github.com/puresimm-spec) |
| Yanakorn Yodudom | เซนส์ (Sense) | Aspiring AI/ML Engineer · นักพัฒนา | Warrior | – |
| Nattavut Wongjeen | แม็ค (Max) | AI & Data Science Student · นักพัฒนา | Ranger | – |

ทั้งสามคนเป็นนักศึกษาสาขาวิศวกรรมปัญญาประดิษฐ์และวิทยาการข้อมูล มหาวิทยาลัยกรุงเทพ

> สมาชิก 4 คนในหน้า "ห้องโถง" (Brannoc, Elowen, Thessa, Kestrel) เป็น **ตัวละครสมมุติ** ที่แสดง build แต่ละสาย ส่วนทีมพัฒนาตัวจริงอยู่ในหน้า "ผู้พัฒนา"

## ฟีเจอร์

- **แถบแท็บทุกหน้า**: หน้าแรก / ห้องโถง / ผู้พัฒนา / พรีเซนเทชัน
- **ห้องโถงปาร์ตี้**: ภาพรวมกิลด์ และการ์ดตัวละครพิกเซลตามคลาส วาดด้วยโค้ดทั้งหมด ไม่ใช้ไฟล์รูป
- **หน้าวางแผนค่าสถานะ (Planner)**: หน้ารายละเอียดตัวละครแบบ 3 แผง ย้ายแต้มอิสระ 4 แต้มได้ด้วยปุ่ม ▲▼ แล้ว HP, AC, Initiative, Saving Throw และ Spell DC เปลี่ยนตามกติกา D&D 5e ทันที ค่าจริงของตัวละครไม่เปลี่ยน
- **บอร์ดเควสต์ AI (ที่ปรึกษา build)**: เลือกเป้าหมาย 4 สาย (ถึกทน / โจมตี / สนับสนุน / สายผสม) แล้ว AI วางแผน build จากค่าสถานะในตารางขณะนั้น ถ้า AI แนะนำการย้ายแต้ม จะมีปุ่ม "ใช้คำแนะนำนี้" ปรับตารางให้ทันที ย้อนกลับได้ แต่ละเป้าหมายมีบทสนทนาแยก และมีแท็บบันทึกเควสต์
- **Guild Keeper (แชต AI)**: ถามเรื่องกิลด์ ตัวละคร ทีมพัฒนา และเทคโนโลยีของเว็บ ตอบจากข้อมูลเท่านั้น จำบทสนทนาข้ามการรีเฟรช มีคำถามแนะนำ
- **หน้าผู้พัฒนา**: การ์ดทีมพร้อมภาพพิกเซลครึ่งตัวที่วาดจากหน้าตาจริงของแต่ละคน ผลงานของทีม ระบบทำงานอย่างไร และเทคโนโลยีที่ใช้
- **พรีเซนเทชันในเว็บ**: สไลด์ 8 หน้าแนะนำโปรเจกต์ เลื่อนด้วยปุ่มลูกศร จุด หรือปุ่ม ← → บนคีย์บอร์ด สไลด์สุดท้ายมีปุ่มพาเข้าหน้าจริง
- **ไทย / English**: สลับภาษาได้ทุกหน้า รวมถึงคำตอบของ AI ในบอร์ดเควสต์
- **พื้นหลังห้องโถงที่มีชีวิต**: กล้องซูม/แพนช้าๆ แสงคบเพลิงกะพริบ ลำแสง หมอก ฝุ่น ประกายไฟ และ parallax ตามเมาส์ (ปิดเองเมื่อเครื่องตั้งค่าลดการเคลื่อนไหว)
- **จำกัดอัตราการส่งข้อความ**: 15 ครั้งต่อนาทีต่อ IP เพื่อกันโควตา AI หมด

## Tech Stack

| ส่วน | เทคโนโลยี |
| --- | --- |
| Frontend | React, Vite, CSS, SVG pixel art (ไม่มี router library ใช้ลิงก์แบบ `#/...`) |
| Backend | Node.js, Express |
| Database | PostgreSQL (ตอนพัฒนารันด้วย Docker) |
| AI | Google Gemini API (เรียกผ่าน `fetch` โดยตรง ไม่ต้องติดตั้ง SDK) |
| Hosting | Render (PostgreSQL + Web Service + Static Site) |

## สถาปัตยกรรม

```mermaid
flowchart TD
    U["ผู้เยี่ยมชม"] --> FE["Frontend<br/>React + Vite<br/>Render Static Site"]
    FE -->|"/api/* (Rewrite ไป backend)"| BE["Backend<br/>Express<br/>Render Web Service"]
    S["seed.json<br/>กิลด์ ตัวละคร ทีมพัฒนา"] -->|"โหลดทุกครั้งที่ backend เริ่ม"| DB[("PostgreSQL<br/>ข้อมูลพอร์ตโฟลิโอ + ประวัติแชต")]
    BE --> DB
    BE --> G["Gemini API"]
```

ลำดับการทำงานของบอร์ดเควสต์ AI:

```mermaid
sequenceDiagram
    participant U as ผู้เยี่ยมชม
    participant FE as Frontend
    participant BE as Backend
    participant DB as PostgreSQL
    participant AI as Gemini
    U->>FE: เลือกเควสต์ หรือพิมพ์คำถาม
    FE->>BE: POST /api/build-chat (memberId, goal, stats, messages, lang)
    BE->>DB: ดึงข้อมูลตัวละคร
    BE->>BE: ตรวจค่าสถานะและแต้มที่ใช้
    BE->>AI: กติกา + ข้อมูลตัวละคร + ประวัติแชต (ขอคำตอบเป็น JSON)
    AI-->>BE: { reply, allocation }
    BE->>BE: ตรวจ allocation (ไม่เกินแต้ม ค่าอยู่ในช่วง 3–20)
    BE-->>FE: { reply, allocation | null }
    FE-->>U: คำตอบ + ปุ่ม "ใช้คำแนะนำนี้"
```

## โครงสร้างโปรเจกต์

```
dnd-guild-portfolio/
├─ docker-compose.yml        # PostgreSQL สำหรับพัฒนาในเครื่อง
├─ .env.example              # ตัวอย่างตัวแปรสภาพแวดล้อม (คัดลอกเป็น .env)
├─ package.json              # สคริปต์ลัด: npm run dev:backend
├─ backend/
│  ├─ src/
│  │  ├─ index.js            # Express: เส้นทาง API, ตรวจข้อมูล, rate limit
│  │  ├─ db.js               # ต่อฐานข้อมูล, โหลด seed, ประวัติแชต
│  │  └─ ai.js               # system prompt, ที่ปรึกษา build, เรียก Gemini
│  └─ db/
│     ├─ schema.sql          # โครงสร้างตาราง
│     └─ seed.json           # ข้อมูลกิลด์ ตัวละคร ผลงาน และทีมพัฒนา (แก้ที่นี่)
└─ frontend/
   ├─ public/bg.jpg          # รูปพื้นหลังห้องโถง
   └─ src/
      ├─ App.jsx             # โหลดข้อมูล + เลือกหน้าตามลิงก์
      ├─ useRoute.js         # เราเตอร์แบบ hash
      ├─ NavTabs.jsx         # แถบแท็บด้านบน
      ├─ StartScreen.jsx · PartyScreen.jsx · DeveloperScreen.jsx
      ├─ MemberScreen.jsx    # หน้าวางแผนค่าสถานะ
      ├─ BuildQuestBoard.jsx # บอร์ดเควสต์ AI
      ├─ PresentationScreen.jsx · presentation.js   # สไลด์ (ข้อความแก้ที่ presentation.js)
      ├─ ChatWidget.jsx      # แชต Guild Keeper
      ├─ rules.js            # สูตร D&D 5e (HP, AC, Spell DC ฯลฯ)
      ├─ sprites.js · portraits.js · PixelAvatar.jsx  # ตัวละครพิกเซล
      ├─ developer.js        # ข้อมูลหน้าผู้พัฒนา (แก้ที่นี่)
      ├─ i18n.js · LangProvider.jsx · LanguageSwitch.jsx   # สลับภาษา
      └─ Background.jsx · *.css
```

## เริ่มใช้งานในเครื่อง

### สิ่งที่ต้องมี

- Node.js 20.6 ขึ้นไป (แนะนำ v22 LTS) เพราะ backend ใช้ `--env-file`
- Docker Desktop (สำหรับ PostgreSQL)
- Gemini API key จาก [Google AI Studio](https://aistudio.google.com/apikey)

### ขั้นตอน

1. **สร้างไฟล์ `.env`** ที่รากโปรเจกต์ (ไฟล์นี้อยู่ใน `.gitignore` ห้าม commit)
   ```powershell
   copy .env.example .env
   ```
   แล้วใส่ `LLM_API_KEY` และ `LLM_MODEL` (ดูหัวข้อ Environment Variables)
2. **ติดตั้ง package**
   ```powershell
   npm install --prefix backend
   npm install --prefix frontend
   ```
3. **เปิดฐานข้อมูล** (เปิด Docker Desktop ให้ขึ้น Engine running ก่อน)
   ```powershell
   docker compose up -d
   ```
4. **รัน 2 terminal พร้อมกัน**
   ```powershell
   # Terminal 1: backend (พอร์ต 3001)
   npm run dev:backend

   # Terminal 2: หน้าเว็บ (พอร์ต 5173)
   cd frontend
   npm run dev
   ```
5. เปิด http://localhost:5173

หน้าเว็บส่ง `/api/*` ไปที่ backend ผ่าน proxy ใน `frontend/vite.config.js` จึงไม่ต้องตั้ง CORS ตอนพัฒนา

## Environment Variables

ไฟล์ `.env` ที่รากโปรเจกต์ (บน Render ตั้งที่หน้า Environment ของ Web Service)

| ตัวแปร | คำอธิบาย |
| --- | --- |
| `PORT` | พอร์ตของ backend (ในเครื่องใช้ `3001`, บน Render ไม่ต้องตั้ง) |
| `DATABASE_URL` | connection string ของ PostgreSQL เช่น `postgres://postgres:postgres@localhost:5432/dnd_guild` |
| `DATABASE_SSL` | `false` ในเครื่อง, `true` บน Render |
| `LLM_API_KEY` | API key ของ Gemini |
| `LLM_MODEL` | ชื่อโมเดล Gemini (ไม่ตั้งจะใช้ `gemini-flash-latest`) |

## ฐานข้อมูล

ตารางสร้างอัตโนมัติจาก `backend/db/schema.sql` ทุกครั้งที่ backend เริ่ม (รันซ้ำได้ปลอดภัย)

| ตาราง | เก็บอะไร |
| --- | --- |
| `group_info` | ข้อมูลกิลด์ (มีแถวเดียว) |
| `members` | ตัวละครในห้องโถง: คลาส เลเวล ค่าสถานะ (JSONB) ทักษะ |
| `projects` | ผลงาน (`member_id` เป็น NULL = ผลงานของทั้งทีม) |
| `conversations`, `messages` | ประวัติแชตของ Guild Keeper |

ทุกครั้งที่ backend เริ่ม จะล้างข้อมูลพอร์ตโฟลิโอแล้วโหลดจาก `seed.json` ใหม่ (ประวัติแชตไม่ถูกแตะ) แก้ `seed.json` แล้วต้อง restart backend

## แก้ไขข้อมูล

| อยากแก้อะไร | แก้ที่ไหน |
| --- | --- |
| ชื่อกิลด์ สโลแกน ตัวละคร ค่าสถานะ ผลงาน | `backend/db/seed.json` |
| ข้อมูลทีมพัฒนา | `frontend/src/developer.js` **และ** ส่วน `website` ใน `backend/db/seed.json` (AI ใช้ส่วนนี้ ต้องแก้ให้ตรงกัน) |
| ภาพพิกเซลครึ่งตัวของทีม | `frontend/src/portraits.js` |
| ข้อความบนหน้าเว็บ (ไทย/อังกฤษ) | `frontend/src/i18n.js` |
| เนื้อหาสไลด์ | `frontend/src/presentation.js` |
| รูปพื้นหลัง | แทนที่ `frontend/public/bg.jpg` (แนะนำอัตราส่วน 16:9) |

กฎของ `seed.json`: ใช้เครื่องหมายคำพูดคู่ ห้ามมี `,` ท้ายรายการสุดท้าย `level` และค่าใน `stats` ต้องเป็นเลขเต็มไม่มีเครื่องหมายคำพูด

## API

| Method | Path | คำอธิบาย |
| --- | --- | --- |
| GET | `/api/health` | ตรวจสถานะ ตอบ `{ "ok": true }` |
| GET | `/api/portfolio` | ข้อมูลกิลด์ ตัวละคร ผลงาน และทีมพัฒนา `{ group, members, website }` |
| GET | `/api/chat/:id` | ประวัติแชตของการสนทนา |
| POST | `/api/chat` | ส่งข้อความหา Guild Keeper |
| POST | `/api/build-chat` | ถามที่ปรึกษา build ในบอร์ดเควสต์ |

ข้อผิดพลาดตอบเป็น `{ "error": "ข้อความภาษาไทย" }` และทั้ง `/api/chat` กับ `/api/build-chat` จำกัด 15 ครั้งต่อนาทีต่อ IP

### POST `/api/chat`

```json
// Request
{ "conversationId": "ไม่ใส่ = เริ่มคุยใหม่", "message": "ผู้พัฒนาเว็บไซต์มีใครบ้าง" }

// Response 200
{ "conversationId": "...", "reply": "ข้อความจาก Guild Keeper" }
```

ข้อความยาวไม่เกิน 1,000 ตัวอักษร

### POST `/api/build-chat`

```json
// Request
{
  "memberId": 1,
  "goal": "tank",
  "lang": "th",
  "stats": { "STR": 17, "DEX": 9, "CON": 16, "INT": 10, "WIS": 12, "CHA": 15 },
  "messages": [{ "role": "user", "content": "รับเควสต์: ช่วยวาง build สายถึกทนให้หน่อย" }]
}

// Response 200
{ "reply": "คำแนะนำ...", "allocation": { "STR": 1, "CON": 2, "CHA": 1 } }
```

- `goal` เป็น `tank`, `damage`, `support` หรือ `hybrid`
- `stats` คือค่าปัจจุบันในตาราง แต่ละค่าอยู่ระหว่าง 3–20 และใช้แต้มเกินค่าเริ่มต้นได้ไม่เกิน 4 แต้ม
- `messages` คือประวัติของเควสต์นั้น ไม่เกิน 12 ข้อความ ข้อความสุดท้ายต้องเป็นของผู้ใช้
- `allocation` เป็น `null` ถ้า AI ไม่ได้แนะนำให้ย้ายแต้ม หรือเสนอค่าที่ผิดกติกา

## AI ทำงานอย่างไร

**Guild Keeper** ได้ข้อมูลทั้งหมดจากฐานข้อมูลเป็น system prompt พร้อมกติกา

- ตอบจากข้อมูลที่มีเท่านั้น ข้อมูลไหนไม่มีให้บอกตรงๆ ห้ามเดา
- แยก "สมาชิกปาร์ตี้" (ตัวละครสมมุติ) ออกจาก "ทีมพัฒนา" (คนจริง) ให้ชัด
- บอกข้อมูลของผู้พัฒนาได้เฉพาะที่มีในข้อมูล ห้ามเดาข้อมูลส่วนตัว
- ค่าสถานะเป็นของเล่นในธีมเกม ไม่ใช่การประเมินความสามารถจริง
- ตอบเป็นภาษาเดียวกับที่ถาม ใช้ข้อความธรรมดา (หน้าแชตไม่แสดง Markdown)

**ที่ปรึกษา build** ได้ข้อมูลตัวละคร ค่าสถานะเริ่มต้นและค่าปัจจุบัน และแต้มที่เหลือ แล้ว

- ต้องแนะนำตามกติกา D&D 5e จริงเท่านั้น
- ตอบเป็น JSON ตาม schema (`reply` + `allocation` ครบ 6 ค่า) เพื่อให้หน้าเว็บสร้างปุ่ม "ใช้คำแนะนำนี้" ได้
- backend ตรวจ `allocation` ซ้ำก่อนส่งกลับ ถ้าผิดกติกาจะตัดทิ้ง

**ความเร็ว:** ทั้งสองแชตตั้ง `thinkingLevel: "low"` ให้โมเดลตระกูล Gemini 3 คิดน้อยลง จากที่วัดจริง บอร์ดเควสต์ตอบใน 2.7–4.5 วินาที (เดิมเกิน 45 วินาทีจน timeout) ถ้าเปลี่ยนเป็นโมเดลที่ไม่รองรับค่านี้ ระบบจะลองใหม่โดยไม่ใส่ให้เอง

## ขึ้นระบบบน Render

สร้าง 3 อย่างใน region เดียวกัน (เช่น Singapore) ตามลำดับนี้

1. **PostgreSQL** (New + → PostgreSQL) แล้วคัดลอก **Internal Database URL**
2. **Web Service** สำหรับ backend
   - Root Directory: `backend` · Build: `npm install` · Start: `npm start`
   - Environment: `DATABASE_URL` (Internal URL), `DATABASE_SSL=true`, `LLM_API_KEY`, `LLM_MODEL`, `NODE_VERSION=22`
   - ไม่ต้องตั้ง `PORT` (Render ใส่ให้เอง)
3. **Static Site** สำหรับหน้าเว็บ
   - Root Directory: `frontend` · Build: `npm install && npm run build` · Publish: `dist`
   - Environment: `NODE_VERSION=22`
   - Redirects/Rewrites: Source `/api/*` → Destination `https://<ชื่อ-backend>.onrender.com/api/*` · Action **Rewrite**

หลังจากนี้ push เข้า `main` แล้ว Render จะ deploy ใหม่เอง (ถ้าเปิด Auto-Deploy ไว้)

## แก้ปัญหาที่พบบ่อย

| อาการ | สาเหตุ / วิธีแก้ |
| --- | --- |
| `docker compose up` ต่อ Docker API ไม่ได้ | ยังไม่ได้เปิด Docker Desktop |
| `'vite' is not recognized` | ยังไม่ได้ `npm install` ในโฟลเดอร์ `frontend` |
| backend ขึ้น `EADDRINUSE: address already in use :::3001` | มี backend ตัวเก่าค้างอยู่ ปิดด้วย `Get-NetTCPConnection -LocalPort 3001 -State Listen \| ForEach-Object { Stop-Process -Id $_.OwningProcess }` |
| backend ขึ้น error ตอนเริ่ม (`pg_strtoint32_safe`) | `level` ใน `seed.json` ไม่ใช่เลขเต็ม |
| หน้าเว็บขึ้น "ประตูห้องโถงถูกปิดอยู่" | backend ยังไม่รัน, ต่อฐานข้อมูลไม่ได้ หรือ Render กำลังปลุก backend ดู log ใน terminal |
| แชตขึ้น "ติดต่อ AI ไม่สำเร็จ" | ดู log หา `Gemini error <สถานะ>`: 404 = ชื่อโมเดลผิด, 400/403 = key ผิด, 429 = โควตาเต็ม (รอสักครู่) |
| แชตขึ้น "AI ตอบช้าเกินไป" | โมเดลคิดนานเกิน 45 วินาที ตรวจว่ายังใช้ `thinkingLevel: "low"` ใน `backend/src/ai.js` |
| พื้นหลังไม่มีเอฟเฟกต์เคลื่อนไหวเลย | เครื่องปิด Animation effects ไว้ (Windows: Settings → Accessibility → Visual effects) เว็บจะหยุดเอฟเฟกต์ตามการตั้งค่านี้ |
| พื้นหลังไม่ซูม/แพนบนจอกว้างมาก | ตั้งใจไว้: จอกว้างตั้งแต่ 21:9 ขึ้นไปจะแสดงรูปครบทั้งภาพโดยไม่ซูม |
| โหลด zip จาก GitHub แล้วรันไม่ได้ | ไม่มี `.env` และ `node_modules` ใน repo ต้องสร้างและติดตั้งเองตามหัวข้อ "เริ่มใช้งานในเครื่อง" |

## หมายเหตุ

- **ความปลอดภัย:** `.env` อยู่ใน `.gitignore` ห้ามอัปโหลด API key ขึ้น GitHub ถ้า key หลุดให้สร้างใหม่ทันที
- **ลิขสิทธิ์ภาพ:** รูปพื้นหลัง `frontend/public/bg.jpg` ควรเป็นภาพที่มีสิทธิ์ใช้งาน หรือใส่เครดิตศิลปินก่อนเผยแพร่สาธารณะ
- **ค่าสถานะ** STR/DEX/INT ฯลฯ เป็นของเล่นในธีมเกม ไม่ใช่การประเมินความสามารถจริง
- ตัวละครพิกเซลทุกตัว รวมถึงภาพครึ่งตัวของทีม วาดด้วยโค้ดใน `sprites.js` และ `portraits.js` ไม่ใช้ไฟล์รูป
