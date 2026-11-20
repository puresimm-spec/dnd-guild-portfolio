// เนื้อหาสไลด์ในหน้า Presentation (แก้ข้อความได้ที่ไฟล์นี้)
// ข้อความที่มี th/en = สลับตามภาษาที่ผู้ใช้เลือก
// ชื่อกลุ่ม แนวคิด และสมาชิก ดึงจากข้อมูลจริง (seed.json ผ่าน API) ส่วนเทคโนโลยีดึงจาก developer.js

export const SLIDE_TEXT = {
  cover: {
    eyebrow: { th: 'Chat AI พร้อม Portfolio ของกลุ่ม', en: 'Group Portfolio with Chat AI' },
    lead: {
      th: 'เว็บพอร์ตโฟลิโอธีม Dungeons & Dragons ที่มี AI คอยตอบคำถามเรื่องกลุ่มและสมาชิกจากข้อมูลจริง',
      en: 'A Dungeons & Dragons–themed portfolio with an AI that answers questions about the group and its members from real data',
    },
    team: { th: 'มหาวิทยาลัยกรุงเทพ', en: 'Bangkok University' },
  },
  group: {
    eyebrow: { th: 'แนะนำกลุ่ม', en: 'About the group' },
    // หัวข้อใช้สโลแกนของกลุ่ม เนื้อหาใช้แนวคิดและจุดเด่นจากข้อมูลจริง
  },
  team: {
    eyebrow: { th: 'สมาชิก', en: 'The team' },
    title: { th: 'ปาร์ตี้ของเรา', en: 'Our party' },
    projects: { th: (n) => (n ? `ผลงาน ${n} ชิ้น` : 'ยังไม่มีผลงาน'), en: (n) => (n ? `${n} project${n > 1 ? 's' : ''}` : 'No projects yet') },
  },
  projects: {
    eyebrow: { th: 'ผลงาน', en: 'Projects' },
    title: { th: 'ผลงานของกลุ่มและสมาชิก', en: 'Group and member projects' },
    group: { th: 'ผลงานร่วมของกลุ่ม', en: 'Built together' },
    none: { th: 'ยังไม่มีผลงานที่บันทึกไว้', en: 'No projects recorded yet' },
  },
  features: {
    eyebrow: { th: 'ฟีเจอร์', en: 'Features' },
    title: { th: 'ในเว็บมีอะไรบ้าง', en: 'What is inside' },
    items: [
      { title: { th: 'ห้องโถง (Portfolio)', en: 'Hall (portfolio)' }, body: { th: 'แนะนำกลุ่ม สมาชิกแต่ละคน บทบาท ทักษะ ผลงาน และช่องทางติดต่อ', en: 'The group, each member’s role, skills and projects, and how to contact us' } },
      { title: { th: 'แชต AI', en: 'AI chat' }, body: { th: 'คุยกับ Guild Keeper ที่ตอบจากข้อมูลของกลุ่มและสมาชิกทุกคน ประวัติเก็บในฐานข้อมูล', en: 'Talk to the Guild Keeper, which answers from the data of the group and every member; history is stored in the database' } },
      { title: { th: 'ห้องฝึก build (โบนัส)', en: 'Training hall (bonus)' }, body: { th: 'ตัวละครตัวอย่าง ย้ายแต้มตามกติกา D&D 5e แล้วให้ AI ช่วยวาง build', en: 'Sample characters: move stat points under D&D 5e rules and let the AI plan a build' } },
      { title: { th: 'ไทย / English', en: 'Thai / English' }, body: { th: 'สลับภาษาได้ทั้งเว็บ รวมถึงข้อมูลและคำตอบของ AI', en: 'The whole site switches language, data and AI answers included' } },
      { title: { th: 'พรีเซนเทชันในเว็บ', en: 'Built-in presentation' }, body: { th: 'สไลด์ชุดนี้อยู่ในเว็บ และบันทึกเป็น PDF ได้', en: 'These slides live in the site and can be saved as a PDF' } },
    ],
  },
  arch: {
    eyebrow: { th: 'สถาปัตยกรรม', en: 'Architecture' },
    title: { th: 'ระบบทำงานอย่างไร', en: 'How it works' },
    lead: {
      th: 'Chat UI (React) ส่งข้อความไป Backend (Express) ซึ่งดึงข้อมูล Portfolio และประวัติแชตจาก PostgreSQL แล้วส่งให้ Gemini เป็นบริบท ได้คำตอบแล้วบันทึกลงฐานข้อมูลก่อนส่งกลับ',
      en: 'The React chat UI sends a message to the Express backend, which loads the portfolio data and chat history from PostgreSQL, gives them to Gemini as context, saves the answer, then returns it.',
    },
  },
  ai: {
    eyebrow: { th: 'ปัญญาประดิษฐ์', en: 'AI' },
    title: { th: 'AI ที่ตอบจากข้อมูลจริง', en: 'An AI grounded in real data' },
    items: [
      { title: { th: 'ข้อมูล Portfolio เป็นบริบท', en: 'Portfolio as context' }, body: { th: 'system prompt มีข้อมูลกลุ่มและสมาชิกทุกคน ตอบได้ทั้งภาพรวมและรายคน ห้ามเดา', en: 'The system prompt carries the group and every member, so it answers about both, and never guesses' } },
      { title: { th: 'คำแนะนำเป็น JSON', en: 'Suggestions as JSON' }, body: { th: 'ในห้องฝึก build เซิร์ฟเวอร์ตรวจแต้มก่อนแสดงปุ่ม "ใช้คำแนะนำนี้"', en: 'In the training hall the server checks the points before showing “Apply this suggestion”' } },
      { title: { th: 'ตอบเร็วขึ้น', en: 'Faster answers' }, body: { th: 'ลดระดับการคิดของโมเดล (thinkingLevel: low)', en: 'Lower the model’s thinking level (thinkingLevel: low)' } },
    ],
    before: { th: 'เกิน 45 วินาที', en: 'over 45 s' },
    after: { th: 'ประมาณ 4 วินาที', en: 'about 4 s' },
    metricNote: { th: 'เวลาตอบของ AI ในห้องฝึก build ก่อนและหลังแก้ (วัดจริง)', en: 'AI response time in the training hall, before and after (measured)' },
  },
  quality: {
    eyebrow: { th: 'CI/CD', en: 'CI/CD' },
    title: { th: 'เทสต์และ deploy อัตโนมัติ', en: 'Automatic tests and deploys' },
    steps: { th: ['push เข้า main', 'Backend: เทสต์ + PostgreSQL จริง', 'Frontend: lint + เทสต์ + build', 'deploy ขึ้น Render'], en: ['Push to main', 'Backend: tests + real PostgreSQL', 'Frontend: lint + tests + build', 'Deploy to Render'] },
    lead: {
      th: 'GitHub Actions รันทุกครั้งที่ push ถ้าเทสต์ไม่ผ่านจะไม่ deploy เทสต์ครอบคลุม API, ชั้น AI (ใช้ Gemini ปลอม ไม่เปลืองโควตา), ฐานข้อมูลจริง และสูตร D&D',
      en: 'GitHub Actions runs on every push and will not deploy if a test fails. Tests cover the API, the AI layer (with a fake Gemini, so no quota is used), a real database and the D&D formulas.',
    },
  },
  stack: {
    eyebrow: { th: 'เทคโนโลยี', en: 'Tech stack' },
    title: { th: 'สร้างด้วยอะไร', en: 'What it is built with' },
  },
  demo: {
    eyebrow: { th: 'เดโม', en: 'Demo' },
    title: { th: 'ลองใช้จริง', en: 'Try it yourself' },
    lead: { th: 'กดเข้าไปดูหน้าจริงของเว็บได้เลย', en: 'Jump into the real pages of the site' },
    hall: { th: '⚔ ห้องโถงของกลุ่ม', en: '⚔ The group hall' },
    chat: { th: '🗨 คุยกับ AI', en: '🗨 Chat with the AI' },
    training: { th: 'ห้องฝึก build', en: 'Training hall' },
    contact: { th: 'ติดต่อกลุ่ม', en: 'Contact us' },
  },
}

// ลำดับสไลด์
export const SLIDE_ORDER = ['cover', 'group', 'team', 'projects', 'features', 'arch', 'ai', 'quality', 'stack', 'demo']
