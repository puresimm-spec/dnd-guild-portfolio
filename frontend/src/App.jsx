import { useEffect, useState } from 'react'
import './App.css'
import ChatWidget from './ChatWidget.jsx'

// ลำดับและชื่อไทยของค่าสถานะแบบ DnD (เป็นของเล่นในธีมเกม ไม่ใช่การประเมินความสามารถจริง)
const STAT_ORDER = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
const STAT_NAMES = {
  STR: 'พละกำลัง',
  DEX: 'ความคล่องแคล่ว',
  CON: 'ความทนทาน',
  INT: 'ปัญญา',
  WIS: 'ญาณหยั่งรู้',
  CHA: 'เสน่ห์',
}
const STAT_MAX = 20 // เพดานของแถบ (ตามระบบ DnD ทั่วไป)

// เปิดลิงก์เฉพาะ https เท่านั้น กันข้อมูลแปลกๆ ใน DB
const safeUrl = (url) => (typeof url === 'string' && /^https?:\/\//.test(url) ? url : null)

function GithubButton({ href, children }) {
  const url = safeUrl(href)
  if (!url) return null
  return (
    <a className="btn-gold" href={url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

function StatBar({ label, value }) {
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

function ProjectList({ projects, title }) {
  if (!projects?.length) return null
  return (
    <div className="projects">
      <h4>{title}</h4>
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

function MemberCard({ member }) {
  const stats = member.stats ?? {}
  const statKeys = [...STAT_ORDER.filter((k) => k in stats), ...Object.keys(stats).filter((k) => !STAT_ORDER.includes(k))]
  const photo = safeUrl(member.photo) || (member.photo?.startsWith('/') ? member.photo : null)

  return (
    <article className="card">
      <header className="card-head">
        <div className="avatar">
          {photo ? <img src={photo} alt={member.name} /> : <span>{member.name?.[0] ?? '?'}</span>}
        </div>
        <div>
          <h3>{member.name}</h3>
          {member.nickname && <p className="nickname">{member.nickname}</p>}
          <p className="class-line">
            {member.dnd_class} · เลเวล {member.level}
          </p>
        </div>
      </header>

      {member.role && <p className="role">⚔ {member.role}</p>}
      {member.bio && <p className="bio">{member.bio}</p>}
      {member.quote && <blockquote>“{member.quote}”</blockquote>}

      {statKeys.length > 0 && (
        <div className="stats">
          <h4>ค่าสถานะตัวละคร</h4>
          {statKeys.map((k) => (
            <StatBar key={k} label={k} value={stats[k]} />
          ))}
        </div>
      )}

      {member.skills?.length > 0 && (
        <div className="skills">
          <h4>ทักษะ</h4>
          <div className="tags">
            {member.skills.map((s) => (
              <span className="tag" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <ProjectList projects={member.projects} title="ผลงานเดี่ยว" />

      <footer className="card-foot">
        <GithubButton href={member.github_url}>GitHub ของ {member.nickname || member.name}</GithubButton>
      </footer>
    </article>
  )
}

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setError(null)
    setData(null)
    fetch('/api/portfolio')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  if (error) {
    return (
      <main className="page center">
        <div className="notice">
          <h2>ประตูห้องโถงถูกปิดอยู่</h2>
          <p>โหลดข้อมูลไม่สำเร็จ ({error}) ตรวจสอบว่า backend รันอยู่ที่พอร์ต 3001</p>
          <button className="btn-gold" onClick={() => setReloadKey((k) => k + 1)}>
            ลองใหม่
          </button>
        </div>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="page center">
        <p className="loading">กำลังเปิดม้วนคัมภีร์…</p>
      </main>
    )
  }

  const { group, members } = data

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">⚜ Adventurers’ Guild ⚜</p>
        <h1>{group.name}</h1>
        {group.tagline && <p className="tagline">{group.tagline}</p>}
        {group.concept && <p className="concept">{group.concept}</p>}

        {group.highlights?.length > 0 && (
          <ul className="highlights">
            {group.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}

        <GithubButton href={group.contact?.github}>GitHub ของปาร์ตี้</GithubButton>
      </section>

      <section>
        <h2 className="section-title">สมาชิกปาร์ตี้</h2>
        <div className="grid">
          {members.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </section>

      {group.projects?.length > 0 && (
        <section className="group-projects">
          <h2 className="section-title">ผลงานของทั้งปาร์ตี้</h2>
          <div className="card wide">
            <ProjectList projects={group.projects} title="" />
          </div>
        </section>
      )}

      <footer className="page-foot">ค่าสถานะ STR/DEX/INT ฯลฯ เป็นของเล่นในธีมเกม ไม่ใช่การประเมินความสามารถจริง</footer>
      <ChatWidget />
    </main>
  )
}
