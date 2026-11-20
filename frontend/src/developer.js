// ข้อมูลหน้า "ผู้พัฒนาเว็บไซต์" (หน้าเว็บใช้ไฟล์นี้ ไม่ต้องรอ backend)
// ข้อความที่มี th/en = สลับตามภาษาที่ผู้ใช้เลือก
// สำคัญ: ถ้าแก้ข้อมูลผู้พัฒนาหรือ TECH_STACK ให้แก้ส่วน "website" ใน backend/db/seed.json ให้ตรงกันด้วย
//        (Guild Keeper (AI) ตอบเรื่องทีมพัฒนาจากข้อมูลในนั้น)

export const REPO_URL = 'https://github.com/puresimm-spec/dnd-guild-portfolio'

// dndClass / variant ใช้เลือกตัวละครพิกเซลของแต่ละคน
// (variant = ตัวเลขสลับสี/หน้าตาของตัวพิกเซล ให้แต่ละคนต่างกัน)
// หมายเหตุ: สมาชิกในหน้าปาร์ตี้ (seed.json) เป็นตัวละครสมมุติ ผู้พัฒนาจริงอยู่ที่ไฟล์นี้เท่านั้น
export const DEVELOPERS = [
  {
    name: 'Puree Simma',
    nickname: { th: 'พอล (Paul)', en: 'Paul' },
    dndClass: 'Monk',
    variant: 0,
    portrait: 'paul', // ภาพครึ่งตัวใน portraits.js (Monk ใส่เชิ้ตขาว เนคไทเทา)
    role: { th: 'AI Engineer · นักพัฒนา', en: 'AI Engineer · Developer' },
    bio: {
      th: 'นักศึกษาวิศวกรรมศาสตร์ สาขาวิชาวิศวกรรมปัญญาประดิษฐ์และวิทยาการข้อมูล มหาวิทยาลัยกรุงเทพ ใช้ Python ประมวลผลและวิเคราะห์ข้อมูล ตอนนี้กำลังศึกษา Git, การออกแบบฐานข้อมูล และ Docker สื่อสารได้ทั้งภาษาไทยและภาษาอังกฤษ',
      en: 'B.Eng. student in Artificial Intelligence and Data Science Engineering at Bangkok University. Uses Python for data processing and analysis, and is currently learning Git, database design and Docker. Speaks Thai and English.',
    },
    skills: ['Python', 'Google Colab', 'VS Code', 'Excel', 'GitLab', 'dbdiagram.io', 'Docker'],
    github: 'https://github.com/puresimm-spec',
  },
  {
    name: 'Yanakorn Yodudom',
    nickname: { th: 'เซนส์ (Sense)', en: 'Sense' },
    dndClass: 'Warrior',
    variant: 1,
    portrait: 'sense', // ภาพครึ่งตัวใน portraits.js (Purple Dragon Knight)
    role: { th: 'Aspiring AI/ML Engineer · นักพัฒนา', en: 'Aspiring AI/ML Engineer · Developer' },
    bio: {
      th: 'นักศึกษาปริญญาตรีวิศวกรรมศาสตร์ สาขา AI and Data Science มหาวิทยาลัยกรุงเทพ (2024–ปัจจุบัน) สนใจ AI และ Machine Learning อยากรู้ว่าโมเดลทำงานอย่างไร มีพื้นฐาน Python การทำความสะอาดข้อมูล และฐานข้อมูล เคยสร้างโมเดลจริงในโปรเจกต์ ใช้ภาษาอังกฤษได้ระดับ C2 และภาษาไทยเป็นภาษาแม่',
      en: 'B.Eng. student in Artificial Intelligence and Data Science at Bangkok University (2024–present). Curious about how AI and machine learning models work, with a solid foundation in Python, data cleaning and databases, and hands-on experience building models. English (C2), Thai (native).',
    },
    skills: ['Python', 'SQL', 'MySQL', 'PostgreSQL', 'pandas', 'scikit-learn', 'ER Diagram'],
    github: null, // ใส่ลิงก์ GitHub ของตัวเองที่นี่ เช่น 'https://github.com/ชื่อผู้ใช้'
  },
  {
    name: 'Nattavut Wongjeen',
    nickname: { th: 'แม็ค (Max)', en: 'Max' },
    dndClass: 'Ranger',
    variant: 2,
    portrait: 'max', // ภาพครึ่งตัวใน portraits.js (Ranger ผ้าพันคอปิดหน้า)
    role: { th: 'AI & Data Science Student · นักพัฒนา', en: 'AI & Data Science Student · Developer' },
    // ร่างจากข้อมูลของพอลและเซนส์ (เรียนสาขาเดียวกัน) ให้แม็คตรวจและแก้ให้ตรงกับตัวเอง
    bio: {
      th: 'นักศึกษาวิศวกรรมศาสตร์ สาขาวิชาวิศวกรรมปัญญาประดิษฐ์และวิทยาการข้อมูล มหาวิทยาลัยกรุงเทพ สนใจการนำข้อมูลและ AI มาช่วยแก้ปัญหาจริง กำลังฝึก Python และการออกแบบฐานข้อมูล ร่วมพัฒนาเว็บไซต์นี้',
      en: 'B.Eng. student in Artificial Intelligence and Data Science at Bangkok University. Interested in using data and AI to solve real problems, currently building skills in Python and database design. Co-developer of this website.',
    },
    skills: ['Python', 'Google Colab', 'VS Code', 'SQL', 'PostgreSQL'],
    github: null, // ใส่ลิงก์ GitHub ของตัวเองที่นี่
  },
]

// เทคโนโลยีที่ใช้ในเว็บนี้
export const TECH_STACK = [
  { title: { th: 'หน้าเว็บ', en: 'Frontend' }, items: ['React', 'Vite', 'CSS', 'SVG pixel art'] },
  { title: { th: 'เซิร์ฟเวอร์', en: 'Backend' }, items: ['Node.js', 'Express'] },
  { title: { th: 'ข้อมูลและ AI', en: 'Data & AI' }, items: ['PostgreSQL', 'Google Gemini API'] },
  { title: { th: 'ขึ้นระบบ', en: 'Deployment' }, items: ['Render', 'GitHub', 'Docker (ตอนพัฒนา)'] },
]
