// ข้อมูลคงที่ของหน้า "เบื้องหลังเว็บ" (ไม่ต้องรอ backend)
// ข้อมูลสมาชิกและผลงานอยู่ที่ backend/db/seed.json ที่เดียว (หน้าเว็บ แชต AI และสไลด์ใช้ชุดเดียวกัน)
// ถ้าแก้ TECH_STACK ให้แก้ "website.tech" ใน seed.json ให้ตรงกันด้วย (AI ตอบเรื่องเทคโนโลยีจากในนั้น)

export const REPO_URL = 'https://github.com/puresimm-spec/dnd-guild-portfolio'

// เทคโนโลยีที่ใช้ในเว็บนี้
export const TECH_STACK = [
  { title: { th: 'หน้าเว็บ', en: 'Frontend' }, items: ['React', 'Vite', 'CSS', 'SVG pixel art'] },
  { title: { th: 'เซิร์ฟเวอร์', en: 'Backend' }, items: ['Node.js', 'Express'] },
  { title: { th: 'ข้อมูลและ AI', en: 'Data & AI' }, items: ['PostgreSQL', 'Google Gemini API'] },
  { title: { th: 'ทดสอบและขึ้นระบบ', en: 'Testing & deployment' }, items: ['node:test', 'GitHub Actions', 'Render', 'Docker (ตอนพัฒนา)'] },
]
