// ชิ้นส่วนที่ใช้ร่วมกันหลายหน้า: ปุ่ม GitHub, แถบค่าสถานะ, รายการผลงาน, รูปโปรไฟล์

// ลำดับและชื่อไทยของค่าสถานะแบบ DnD (เป็นของเล่นในธีมเกม ไม่ใช่การประเมินความสามารถจริง)
export const STAT_ORDER = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
export const STAT_NAMES = {
  STR: 'พละกำลัง',
  DEX: 'ความคล่องแคล่ว',
  CON: 'ความทนทาน',
  INT: 'ปัญญา',
  WIS: 'ญาณหยั่งรู้',
  CHA: 'เสน่ห์',
}
const STAT_MAX = 20 // เพดานของแถบ (ตามระบบ DnD ทั่วไป)

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

export function Avatar({ member, size = 'md' }) {
  // photo เป็นลิงก์เต็ม (https://...) หรือพาธในโฟลเดอร์ public (/paul.jpg) ก็ได้
  const photo = safeUrl(member.photo) || (member.photo?.startsWith('/') ? member.photo : null)
  return (
    <div className={`avatar ${size}`}>
      {photo ? <img src={photo} alt={member.name} /> : <span>{member.name?.[0] ?? '?'}</span>}
    </div>
  )
}

export function StatBar({ label, value }) {
  const n = Number(value) || 0
  const pct = Math.max(0, Math.min(100, (n / STAT_MAX) * 100))
  const mod = Math.floor((n - 10) / 2)
  return (
    <div className="stat" title={`${STAT_NAMES[label] ?? label}: ${n}`}>
      <span className="stat-label">{label}</span>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="stat-value">
        {n} <em>({mod >= 0 ? `+${mod}` : mod})</em>
      </span>
    </div>
  )
}

export function ProjectList({ projects, title }) {
  if (!projects?.length) return null
  return (
    <div className="projects">
      {title && <h4>{title}</h4>}
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <strong>{p.title}</strong>
            <p>{p.description}</p>
            {p.tech?.length > 0 && (
              <div className="tags">
                {p.tech.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            <GithubButton href={p.github_url}>ดูโค้ดบน GitHub</GithubButton>
          </li>
        ))}
      </ul>
    </div>
  )
}
