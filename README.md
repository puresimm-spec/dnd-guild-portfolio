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

> สมาชิกจริงของกลุ่มอยู่ในหน้า **"ห้องโถง"** (พร้อมโปรไฟล์รายคน) ส่วนตัวละคร 4 ตัวในหน้า **"ห้องฝึก build"** (Brannoc, Elowen, Thessa, Kestrel) เป็น **ตัวละครตัวอย่าง** สำหรับลองวาง build ไม่ใช่สมาชิกของกลุ่ม

## ฟีเจอร์

- **ประตูกิลด์ + ลานต้อนรับ**: กด "เข้าสู่ห้องโถง" แล้วเล่นฉากประตูไม้เปิดแบบหนัง (ครั้งแรกต่อการเปิดเว็บ ข้ามได้) เข้ามาเจอ Guild Keeper ที่ทักทายและแนะนำเมนู: ห้องโถง / แชต AI / ห้องฝึก build / เบื้องหลังเว็บ / พรีเซนเทชัน
- **นำทางด้วย Guild Keeper**: ทุกหน้ามีปุ่ม Guild Keeper มุมซ้ายบน (แทนแถบแท็บ) กดแล้วบอกว่าอยู่หน้าไหนและเลือกไปหน้าอื่นได้ เปลี่ยนหน้าแบบค่อยๆ จาง (View Transitions)
- **ห้องโถง (Portfolio ของกลุ่ม)**: แนะนำกลุ่ม (ชื่อ แนวคิด จุดเด่น) สมาชิก 3 คนพร้อมภาพพิกเซลครึ่งตัว บทบาทในทีม ทักษะ ผลงานของกลุ่ม และช่องทางติดต่อ (อีเมลกลุ่ม + GitHub)
- **โปรไฟล์สมาชิกรายคน**: ชื่อ บทบาทในทีม แนะนำตัว ทักษะ ผลงานของแต่ละคน GitHub และปุ่ม "ถาม AI เกี่ยวกับคนนี้" ที่เปิดหน้าแชตแล้วส่งคำถามให้เอง
- **ห้องฝึก build (โบนัส)**: ตัวละครตัวอย่างแบบพิกเซลตามคลาส ยืนเดี่ยวๆ มีเงาที่พื้น แสงเรืองสีประจำอาชีพ และเหรียญเลเวล
- **หน้าวางแผนค่าสถานะ (Planner)** ในห้องฝึก build: หน้าตัวละครแบบ 3 แผง ย้ายแต้มอิสระ 4 แต้มได้ด้วยปุ่ม ▲▼ แล้ว HP, AC, Initiative, Saving Throw และ Spell DC เปลี่ยนตามกติกา D&D 5e ทันที ค่าจริงของตัวละครไม่เปลี่ยน
- **บอร์ดเควสต์ AI (ที่ปรึกษา build)**: เลือกเป้าหมาย 4 สาย (ถึกทน / โจมตี / สนับสนุน / สายผสม) แล้ว AI วางแผน build จากค่าสถานะในตารางขณะนั้น ถ้า AI แนะนำการย้ายแต้ม จะมีปุ่ม "ใช้คำแนะนำนี้" ปรับตารางให้ทันที ย้อนกลับได้ แต่ละเป้าหมายมีบทสนทนาแยก และมีแท็บบันทึกเควสต์
- **หน้าแชต AI (Guild Keeper)**: หน้าแชตเต็มจอ คำถามแนะนำอยู่ซ้าย ช่องคุยอยู่ขวา ข้อความผู้ใช้ (ขวา สีไม้เข้ม) กับ AI (ซ้าย กระดาษ มีรูป Guild Keeper) แยกชัดเจน มีเวลาแต่ละข้อความ คำถามแนะนำทั้งเรื่องกลุ่มและสมาชิกแต่ละคน ลิงก์ในคำตอบกดได้ ส่งไม่สำเร็จกดลองใหม่ได้ ประวัติเก็บใน PostgreSQL รีเฟรชแล้วยังอยู่
- **เบื้องหลังเว็บ**: เกี่ยวกับโปรเจกต์ ฟีเจอร์ ระบบทำงานอย่างไร การตรวจคุณภาพ (CI/CD, เทสต์, ความปลอดภัย) และเทคโนโลยีที่ใช้
- **พรีเซนเทชันในเว็บ**: สไลด์ 10 หน้า (กลุ่ม สมาชิก ผลงาน ฟีเจอร์ ระบบ AI CI/CD เทคโนโลยี เดโม) ดึงข้อมูลล่าสุดของกลุ่มและสมาชิกจากฐานข้อมูล แก้ seed.json แล้วสไลด์เปลี่ยนตามเอง เลื่อนด้วยปุ่มลูกศร จุด หรือปุ่ม ← → และกด "บันทึกเป็น PDF" ได้ไฟล์หน้าละสไลด์
- **ไทย / English**: สลับภาษาได้ทุกหน้า ภาษาอังกฤษเปลี่ยนทั้งหน้าจริงๆ รวมถึงข้อมูลกิลด์และตัวละครจาก `seed.json` และคำตอบของ AI ในบอร์ดเควสต์
- **พื้นหลังห้องโถงที่มีชีวิต**: โคมแขวนในรูปแกว่งจริง (ตัดออกจากรูปเป็นชิ้นแล้ววาดพื้นหลังข้างใต้ใหม่) ไฟวูบวาบ แสงลอดหน้าต่าง ฝุ่น หิ่งห้อย หมอก ประกายไฟ กล้องซูมช้าๆ และ parallax ตามเมาส์ เครื่องสเปกต่ำจะสลับเป็นโหมดเบาเอง (ปิดเองเมื่อเครื่องตั้งค่าลดการเคลื่อนไหว)
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
├─ .github/workflows/
│  └─ ci-cd.yml              # CI/CD: เทสต์ + build แล้วสั่ง Render deploy
├─ backend/
│  ├─ src/
│  │  ├─ index.js            # จุดเริ่ม: เตรียมฐานข้อมูล แล้วเปิดเซิร์ฟเวอร์
│  │  ├─ app.js              # Express: เส้นทาง API, ตรวจข้อมูล, rate limit (เทสต์เรียกใช้ได้)
│  │  ├─ db.js               # ต่อฐานข้อมูล, โหลด seed, ประวัติแชต
│  │  └─ ai.js               # system prompt, ที่ปรึกษา build, เรียก Gemini
│  ├─ test/                  # เทสต์ API, ชั้น AI (Gemini ปลอม), ฐานข้อมูลจริง
│  └─ db/
│     ├─ schema.sql          # โครงสร้างตาราง
│     └─ seed.json           # ข้อมูลกิลด์ ตัวละคร ผลงาน และทีมพัฒนา (แก้ที่นี่)
└─ frontend/
   ├─ public/bg.jpg          # รูปพื้นหลังห้องโถง
   ├─ public/bg/             # ชิ้นส่วนฉากที่สร้างจาก bg.jpg (รูปที่ลบโคมออก + โคม/ขนนกที่ตัดออก + แสงหน้าต่าง)
   ├─ test/                  # เทสต์สูตร D&D
   └─ src/
      ├─ App.jsx             # โหลดข้อมูล + เลือกหน้าตามลิงก์
      ├─ useRoute.js         # เราเตอร์แบบ hash
      ├─ StartScreen.jsx     # หน้าแรก (ข้างนอกกิลด์)
      ├─ GuildDoors.jsx      # ฉากเปิดประตูกิลด์ตอนกดเข้า
      ├─ LobbyScreen.jsx     # ลานต้อนรับ: Guild Keeper แนะนำเมนู (#/lobby)
      ├─ KeeperNav.jsx       # ปุ่ม Guild Keeper มุมซ้ายบน (เมนูไปหน้าอื่น แทนแถบแท็บ)
      ├─ GuildMenu.jsx · destinations.js   # เมนูและกล่องคำพูดที่ใช้ร่วมกัน
      ├─ PartyScreen.jsx     # ห้องโถง: กลุ่ม สมาชิก ผลงาน ติดต่อ
      ├─ ProfileScreen.jsx   # โปรไฟล์สมาชิกรายคน (#/member/N)
      ├─ ContactCard.jsx     # การ์ดช่องทางติดต่อกลุ่ม
      ├─ TrainingScreen.jsx  # ห้องฝึก build (#/training)
      ├─ DeveloperScreen.jsx # เบื้องหลังเว็บ
      ├─ MemberScreen.jsx    # หน้าวางแผนค่าสถานะของตัวละครตัวอย่าง (#/training/N)
      ├─ BuildQuestBoard.jsx # บอร์ดเควสต์ AI
      ├─ PresentationScreen.jsx · presentation.js   # สไลด์ (ข้อความแก้ที่ presentation.js)
      ├─ ChatScreen.jsx      # หน้าแชตเต็มจอ (#/chat)
      ├─ useGuildChat.js     # ตรรกะแชต (ส่ง, โหลดประวัติ, ลองใหม่) + MessageText.jsx แสดงลิงก์ในคำตอบ
      ├─ rules.js            # สูตร D&D 5e (HP, AC, Spell DC ฯลฯ)
      ├─ sprites.js · portraits.js · PixelAvatar.jsx  # ตัวละครพิกเซล
      ├─ developer.js        # เทคโนโลยีที่ใช้ + ลิงก์ซอร์สโค้ด (หน้าเบื้องหลังเว็บ)
      ├─ i18n.js · LangProvider.jsx · LanguageSwitch.jsx   # สลับภาษา
      ├─ Background.jsx · bgScene.js   # พื้นหลังมีชีวิต (bgScene.js = ตำแหน่งโคม/ขนนกบนรูป)
      └─ *.css
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
| `LLM_MODEL` | ชื่อโมเดล Gemini หลัก (ไม่ตั้งจะใช้ `gemini-flash-latest`) |
| `LLM_FALLBACK_MODEL` | โมเดลสำรอง ถ้าโมเดลหลักไม่ตอบใน 20 วินาทีหรือล่ม (ไม่ตั้ง = `gemini-flash-lite-latest`, ตั้ง `none` = ปิด) |

## ฐานข้อมูล

ตารางสร้างอัตโนมัติจาก `backend/db/schema.sql` ทุกครั้งที่ backend เริ่ม (รันซ้ำได้ปลอดภัย)

| ตาราง | เก็บอะไร |
| --- | --- |
| `group_info` | ข้อมูลกิลด์ (มีแถวเดียว) |
| `members` | `kind = team` สมาชิกจริง (บทบาทในทีม แนะนำตัว ทักษะ GitHub ภาพครึ่งตัว `portrait`) และ `kind = sample` ตัวละครตัวอย่างในห้องฝึก build (คลาส เลเวล สาย build ค่าสถานะ JSONB) |
| `projects` | ผลงาน (`member_id` เป็น NULL = ผลงานของทั้งทีม) |

`group_info`, `members` และ `projects` มีช่อง `en` (JSONB) เก็บข้อความภาษาอังกฤษ ช่องนี้ถูกเพิ่มให้ฐานข้อมูลเดิมอัตโนมัติ (`ADD COLUMN IF NOT EXISTS`) ไม่ต้องลบฐานข้อมูล
| `conversations`, `messages` | ประวัติแชตของ Guild Keeper |

ทุกครั้งที่ backend เริ่ม จะล้างข้อมูลพอร์ตโฟลิโอแล้วโหลดจาก `seed.json` ใหม่ (ประวัติแชตไม่ถูกแตะ) แก้ `seed.json` แล้วต้อง restart backend

## แก้ไขข้อมูล

| อยากแก้อะไร | แก้ที่ไหน |
| --- | --- |
| ชื่อกิลด์ สโลแกน ตัวละคร ค่าสถานะ ผลงาน | `backend/db/seed.json` (ข้อความไทยอยู่ในช่องหลัก ภาษาอังกฤษอยู่ใน `"en": { ... }` ของแต่ละรายการ) |
| ข้อมูลสมาชิก (บทบาท แนะนำตัว ทักษะ ผลงาน) | `members` ใน `backend/db/seed.json` (ที่เดียว หน้าเว็บ แชต AI และสไลด์ใช้ชุดเดียวกัน) |
| ตัวละครตัวอย่างในห้องฝึก build | `sample_characters` ใน `backend/db/seed.json` |
| ช่องทางติดต่อกลุ่ม | `group.contact` ใน `backend/db/seed.json` (`email`, `github`) |
| ภาพพิกเซลครึ่งตัวของสมาชิก | `frontend/src/portraits.js` (ผูกกับสมาชิกด้วยช่อง `portrait` ใน seed) |
| ข้อความบนหน้าเว็บ (ไทย/อังกฤษ) | `frontend/src/i18n.js` |
| เนื้อหาสไลด์ | `frontend/src/presentation.js` |
| รูปพื้นหลัง | แทนที่ `frontend/public/bg.jpg` (แนะนำ 1920 x 1078 หรือ 16:9) **และ**ต้องลบโฟลเดอร์ `frontend/public/bg/` กับเคลียร์ `LANTERNS`/`QUILL` ใน `frontend/src/bgScene.js` ด้วย เพราะชิ้นส่วนพวกนั้นตัดมาจากรูปเดิม ถ้าไม่ลบจะเห็นโคมของรูปเก่าลอยทับรูปใหม่ |

กฎของ `seed.json`: ใช้เครื่องหมายคำพูดคู่ ห้ามมี `,` ท้ายรายการสุดท้าย `level` และค่าใน `stats` ต้องเป็นเลขเต็มไม่มีเครื่องหมายคำพูด

## API

| Method | Path | คำอธิบาย |
| --- | --- | --- |
| GET | `/api/health` | ตรวจสถานะ ตอบ `{ "ok": true }` |
| GET | `/api/portfolio` | ข้อมูลกลุ่ม สมาชิก ผลงาน ตัวละครตัวอย่าง และเทคโนโลยี `{ group, members, characters, website }` |
| GET | `/api/chat/:id` | ประวัติแชตของการสนทนา |
| POST | `/api/chat` | ส่งข้อความหา Guild Keeper |
| POST | `/api/build-chat` | ถามที่ปรึกษา build ในห้องฝึก build (`memberId` ต้องเป็นตัวละครตัวอย่าง ไม่ใช่สมาชิกจริง) |

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
- ข้อมูลหลักคือกลุ่มและสมาชิกจริงทุกคน (บทบาท ทักษะ ผลงาน) ตอบได้ทั้งคำถามภาพรวมของกลุ่มและรายคน
- ตัวละครตัวอย่างในห้องฝึก build แยกเป็นอีกส่วน ไม่นับเป็นสมาชิกของกลุ่ม
- บอกข้อมูลของสมาชิกได้เฉพาะที่มีในข้อมูล ช่องทางติดต่อใช้ของกลุ่มที่ให้ไว้ ห้ามเดาข้อมูลส่วนตัว
- ค่าสถานะเป็นของเล่นในธีมเกม ไม่ใช่การประเมินความสามารถจริง
- ตอบเป็นภาษาเดียวกับที่ถาม ใช้ข้อความธรรมดา (หน้าแชตไม่แสดง Markdown)

**ที่ปรึกษา build** ได้ข้อมูลตัวละคร ค่าสถานะเริ่มต้นและค่าปัจจุบัน และแต้มที่เหลือ แล้ว

- ต้องแนะนำตามกติกา D&D 5e จริงเท่านั้น
- ตอบเป็น JSON ตาม schema (`reply` + `allocation` ครบ 6 ค่า) เพื่อให้หน้าเว็บสร้างปุ่ม "ใช้คำแนะนำนี้" ได้
- backend ตรวจ `allocation` ซ้ำก่อนส่งกลับ ถ้าผิดกติกาจะตัดทิ้ง

**ความเร็ว:** ทั้งสองแชตตั้ง `thinkingLevel: "low"` ให้โมเดลตระกูล Gemini 3 คิดน้อยลง จากที่วัดจริง บอร์ดเควสต์ตอบใน 2.7–4.5 วินาที (เดิมเกิน 45 วินาทีจน timeout) ถ้าเปลี่ยนเป็นโมเดลที่ไม่รองรับค่านี้ ระบบจะลองใหม่โดยไม่ใส่ให้เอง

**โมเดลสำรอง:** เคยเจอโมเดลหลักฝั่ง Google ไม่ตอบเลยเกิน 2 นาที จึงรอโมเดลหลักไม่เกิน 20 วินาที ถ้าช้าเกิน ล่ม หรือตอบ error ชั่วคราว (429/500/503) จะสลับไปใช้ `LLM_FALLBACK_MODEL` ให้เอง ผู้ใช้ไม่ต้องกดลองใหม่

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

การ deploy ครั้งต่อๆ ไปทำผ่าน CI/CD (หัวข้อถัดไป)

## Testing

```powershell
# backend: ตรวจ syntax + เทสต์ (ไม่ต้องมีฐานข้อมูลหรือ API key)
cd backend
npm run check
npm test

# frontend: lint + เทสต์สูตร D&D + build
cd frontend
npm run lint
npm test
npm run build
```

| ไฟล์เทสต์ | ครอบคลุม |
| --- | --- |
| `backend/test/api.test.js` | `/api/health`, ตรวจข้อความว่าง/ยาวเกิน/รหัสสนทนาผิด, JSON พัง (ตอบเป็น JSON), เส้นทางที่ไม่มี, rate limit ครั้งที่ 16 ได้ 429, ตรวจข้อมูลของ `/api/build-chat` |
| `backend/test/ai.test.js` | ใช้ Gemini ปลอม: ตรวจ allocation (เกินแต้ม/ค่าเกินช่วง/การแลกแต้ม), คำตอบที่ไม่ใช่ JSON, ลองใหม่เมื่อโมเดลไม่รองรับ `thinkingLevel`, ไม่มี API key, system prompt มีกลุ่ม ตัวละคร และผู้พัฒนาครบ |
| `backend/test/db.integration.test.js` | PostgreSQL จริง: `setup()` สองรอบ, โหลด seed, ช่อง `en`, `/api/portfolio` (รันเมื่อมี `DATABASE_URL` เช่นใน CI ไม่งั้นข้าม) |
| `frontend/test/rules.test.js` | สูตร D&D 5e ของหน้าวางแผนค่าสถานะ (modifier, HP, Spell DC, คลาสชื่ออื่น) |

> ส่วนที่ต้องใช้ Gemini จริง (คุณภาพคำตอบ) ทดสอบด้วยมือบนเว็บจริง

## CI/CD

GitHub Actions ไฟล์ `.github/workflows/ci-cd.yml` ทำงานทุกครั้งที่ push และทุก Pull Request เข้า `main`

```mermaid
flowchart LR
    A["push / Pull Request<br/>เข้า main"] --> B["backend<br/>syntax check + เทสต์<br/>(มี PostgreSQL จริงใน CI)"]
    A --> C["frontend<br/>lint + เทสต์ + build"]
    B -->|ผ่านทั้งคู่| D["deploy<br/>Render Deploy Hook"]
    C -->|ผ่านทั้งคู่| D
    D --> E["backend บน Render"]
    D --> F["หน้าเว็บบน Render"]
```

| Job | ทำอะไร | ทำงานเมื่อ |
| --- | --- | --- |
| `backend` | `npm ci`, ตรวจ syntax, รันเทสต์ทั้งหมดกับ PostgreSQL 16 ที่ CI เปิดให้ | ทุก push และ PR |
| `frontend` | `npm ci`, lint, เทสต์, build แล้วเก็บไฟล์เว็บที่ build ไว้ 7 วัน | ทุก push และ PR |
| `deploy` | เรียก Deploy Hook ของ Render ทั้ง backend และหน้าเว็บ | push เข้า `main` และสองงานข้างบนผ่าน |

ถ้าเทสต์ไม่ผ่าน จะไม่ deploy โค้ดที่พังจึงไม่ขึ้นเว็บจริง

**ตั้งค่าครั้งเดียว**

1. Render: Settings ของทั้ง 2 service → **Auto-Deploy = Off** (ให้ pipeline เป็นคนสั่ง deploy)
2. Render: Settings → **Deploy Hook** → คัดลอก URL ของแต่ละ service
3. GitHub: Settings → Secrets and variables → Actions → New repository secret

| Secret | ค่า |
| --- | --- |
| `RENDER_DEPLOY_HOOK_BACKEND` | Deploy Hook ของ Web Service (backend) |
| `RENDER_DEPLOY_HOOK_FRONTEND` | Deploy Hook ของ Static Site (หน้าเว็บ) |

ถ้ายังไม่ได้ตั้ง secret งาน `deploy` จะขึ้นคำเตือนและข้ามไป โดยไม่ทำให้ pipeline ล้ม

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
| พื้นหลังกระตุกบนเครื่องสเปกต่ำ | ปกติเว็บจะวัดเฟรมเรตแล้วสลับเป็นโหมดเบาเอง ถ้ายังกระตุก เปิดลิงก์ด้วย `?bg=lite` เช่น `https://<เว็บ>/?bg=lite#/lobby` (โคมไม่แกว่ง ไม่มีฝุ่น/หมอก) ส่วน `?bg=full` บังคับเปิดเต็มโดยไม่วัด |
| พื้นหลังไม่ซูม/แพนบนจอกว้างมาก | ตั้งใจไว้: จอกว้างตั้งแต่ 21:9 ขึ้นไปจะแสดงรูปครบทั้งภาพโดยไม่ซูม |
| โหลด zip จาก GitHub แล้วรันไม่ได้ | ไม่มี `.env` และ `node_modules` ใน repo ต้องสร้างและติดตั้งเองตามหัวข้อ "เริ่มใช้งานในเครื่อง" |

## หมายเหตุ

- **ความปลอดภัย:** `.env` อยู่ใน `.gitignore` ห้ามอัปโหลด API key ขึ้น GitHub ถ้า key หลุดให้สร้างใหม่ทันที
- **ลิขสิทธิ์ภาพ:** รูปพื้นหลัง `frontend/public/bg.jpg` ควรเป็นภาพที่มีสิทธิ์ใช้งาน หรือใส่เครดิตศิลปินก่อนเผยแพร่สาธารณะ
- **ค่าสถานะ** STR/DEX/INT ฯลฯ เป็นของเล่นในธีมเกม ไม่ใช่การประเมินความสามารถจริง
- ตัวละครพิกเซลทุกตัว รวมถึงภาพครึ่งตัวของทีม วาดด้วยโค้ดใน `sprites.js` และ `portraits.js` ไม่ใช้ไฟล์รูป
