// เนื้อหาสไลด์ในหน้า Presentation (แก้ข้อความได้ที่ไฟล์นี้)
// ข้อความที่มี th/en = สลับตามภาษาที่ผู้ใช้เลือก
// สไลด์ทีมพัฒนาและเทคโนโลยีดึงจาก developer.js อัตโนมัติ ไม่ต้องแก้ซ้ำที่นี่

export const SLIDE_TEXT = {
  cover: {
    eyebrow: { th: 'พอร์ตโฟลิโอกิลด์นักผจญภัย', en: 'Adventurers’ Guild Portfolio' },
    title: { th: 'Buddy Build', en: 'Buddy Build' },
    lead: {
      th: 'เว็บพอร์ตโฟลิโอธีม Dungeons & Dragons พร้อม AI ที่ปรึกษา build ตัวละคร',
      en: 'A Dungeons & Dragons–themed portfolio with an AI character-build advisor',
    },
    team: { th: 'มหาวิทยาลัยกรุงเทพ', en: 'Bangkok University' },
  },
  idea: {
    eyebrow: { th: 'แนวคิด', en: 'The idea' },
    title: { th: 'ทุกคลาสมี build ที่ใช่ เราช่วยคุณหาให้เจอ', en: 'Every class has the right build. We help you find it.' },
    lead: {
      th: 'กิลด์ที่ช่วยนักผจญภัยออกแบบ build ตามสายที่อยากเป็น สมาชิกปาร์ตี้เป็นตัวละครสมมุติที่แสดงแต่ละสาย',
      en: 'A guild that helps adventurers design the build they want. The party members are fictional characters showing each path.',
    },
  },
  features: {
    eyebrow: { th: 'ฟีเจอร์', en: 'Features' },
    title: { th: 'ทำอะไรได้บ้าง', en: 'What it does' },
    items: [
      { title: { th: 'ห้องโถงปาร์ตี้', en: 'Party hall' }, body: { th: 'การ์ดตัวละครพิกเซลวาดด้วยโค้ดทั้งหมด', en: 'Pixel-art character cards drawn entirely in code' } },
      { title: { th: 'หน้าวางแผนค่าสถานะ', en: 'Stat planner' }, body: { th: 'ย้ายแต้มค่าสถานะ แล้ว HP, AC, Spell DC เปลี่ยนตามกติกา D&D 5e', en: 'Move stat points and watch HP, AC and Spell DC follow D&D 5e rules' } },
      { title: { th: 'บอร์ดเควสต์ AI', en: 'AI quest board' }, body: { th: 'เลือกสาย build แล้ว AI วางแผนให้ กดใช้คำแนะนำกับตารางได้ทันที', en: 'Pick a build goal, the AI plans it, and its suggestion applies to the table in one click' } },
      { title: { th: 'ผู้ดูแลกิลด์ (Guild Keeper)', en: 'Guild Keeper' }, body: { th: 'แชตถามเรื่องกิลด์ ทีมพัฒนา และเว็บนี้', en: 'Chat about the guild, the dev team and this website' } },
      { title: { th: 'ไทย / English', en: 'Thai / English' }, body: { th: 'สลับภาษาได้ทุกหน้า รวมถึงคำตอบของ AI', en: 'Switch language on every page, AI answers included' } },
    ],
  },
  arch: {
    eyebrow: { th: 'สถาปัตยกรรม', en: 'Architecture' },
    title: { th: 'ระบบทำงานอย่างไร', en: 'How it works' },
    lead: {
      th: 'หน้าเว็บเป็น Static Site บน Render ส่งคำขอ /api ไปที่ Express ข้อมูลพอร์ตโฟลิโอโหลดจาก seed.json ลง PostgreSQL ทุกครั้งที่เริ่มระบบ และ AI ตอบจากข้อมูลนั้นเท่านั้น',
      en: 'The site is a Static Site on Render that sends /api requests to Express. Portfolio data is loaded from seed.json into PostgreSQL on every start, and the AI answers only from that data.',
    },
  },
  ai: {
    eyebrow: { th: 'ปัญญาประดิษฐ์', en: 'AI' },
    title: { th: 'AI ที่ตอบจากข้อมูลจริง', en: 'An AI grounded in real data' },
    items: [
      { title: { th: 'ตอบจากข้อมูลเท่านั้น', en: 'Answers from data only' }, body: { th: 'ห้ามเดา และแยกตัวละครสมมุติออกจากทีมพัฒนาตัวจริง', en: 'No guessing, and fictional characters are kept apart from the real team' } },
      { title: { th: 'คำแนะนำเป็น JSON', en: 'Suggestions as JSON' }, body: { th: 'เซิร์ฟเวอร์ตรวจแต้มก่อน ถึงจะแสดงปุ่ม "ใช้คำแนะนำนี้"', en: 'The server checks the points before showing “Apply this suggestion”' } },
      { title: { th: 'ตอบเร็วขึ้น', en: 'Faster answers' }, body: { th: 'ลดระดับการคิดของโมเดล (thinkingLevel: low)', en: 'Lower the model’s thinking level (thinkingLevel: low)' } },
    ],
    before: { th: 'เกิน 45 วินาที', en: 'over 45 s' },
    after: { th: 'ประมาณ 4 วินาที', en: 'about 4 s' },
    metricNote: { th: 'เวลาตอบของบอร์ดเควสต์ ก่อนและหลังแก้ (วัดจริง)', en: 'Quest board response time, before and after (measured)' },
  },
  team: {
    eyebrow: { th: 'ทีมพัฒนา', en: 'The team' },
    title: { th: 'ผู้สร้างกิลด์นี้', en: 'Who built this guild' },
  },
  stack: {
    eyebrow: { th: 'เทคโนโลยี', en: 'Tech stack' },
    title: { th: 'สร้างด้วยอะไร', en: 'What it is built with' },
  },
  demo: {
    eyebrow: { th: 'เดโม', en: 'Demo' },
    title: { th: 'ลองใช้จริง', en: 'Try it yourself' },
    lead: { th: 'กดเข้าไปดูหน้าจริงของเว็บได้เลย', en: 'Jump into the real pages of the site' },
    hall: { th: '⚔ เข้าห้องโถง', en: '⚔ Enter the hall' },
    planner: { th: 'ลองบอร์ดเควสต์ AI', en: 'Try the AI quest board' },
    dev: { th: 'ดูหน้าผู้พัฒนา', en: 'Meet the developers' },
  },
}

// ลำดับสไลด์
export const SLIDE_ORDER = ['cover', 'idea', 'features', 'arch', 'ai', 'team', 'stack', 'demo']
