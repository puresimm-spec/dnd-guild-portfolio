import PixelAvatar from './PixelAvatar.jsx'

// ชิ้นส่วนที่ใช้ร่วมกันหลายหน้า: ปุ่ม GitHub, รูปโปรไฟล์

// ลำดับของค่าสถานะแบบ DnD (เป็นของเล่นในธีมเกม ไม่ใช่การประเมินความสามารถจริง)
export const STAT_ORDER = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']

// เปิดลิงก์เฉพาะ http(s) เท่านั้น กันข้อมูลแปลกๆ ใน DB
export const safeUrl = (url) => (typeof url === 'string' && /^https?:\/\//.test(url) ? url : null)

export function GithubButton({ href, children }) {
  const url = safeUrl(href)
  if (!url) return null
  return (
    <a className="btn-gold" href={url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

export function Avatar({ member, size = 'md', variant = 0 }) {
  // photo เป็นลิงก์เต็ม (https://...) หรือพาธในโฟลเดอร์ public (/paul.jpg) ก็ได้
  const photo = safeUrl(member.photo) || (member.photo?.startsWith('/') ? member.photo : null)
  if (photo) {
    return (
      <div className={`avatar ${size}`}>
        <img src={photo} alt={member.name} />
      </div>
    )
  }
  // ไม่มีรูปถ่าย: ใช้ตัวละครพิกเซลตามอาชีพ (dnd_class)
  return (
    <div className={`avatar pixel ${size}`}>
      <PixelAvatar
        dndClass={member.dnd_class}
        variant={variant}
        portrait={member.portrait}
        label={`${member.name} (${member.dnd_class})`}
      />
    </div>
  )
}
