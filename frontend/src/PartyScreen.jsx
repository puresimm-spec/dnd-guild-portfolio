import { Avatar, GithubButton, ProjectList } from './shared.jsx'

// หน้าปาร์ตี้: ภาพรวมของกลุ่ม + ไทล์สมาชิกทุกคน (กดเข้าไปดูรายละเอียดรายคน)
export default function PartyScreen({ group, members }) {
  return (
    <main className="page">
      <nav className="topbar">
        <a href="#/">← หน้าแรก</a>
      </nav>

      <section className="hero compact">
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
        <div className="tiles">
          {members.map((m, i) => (
            <a className="tile" key={m.id} href={`#/member/${i + 1}`}>
              <Avatar member={m} size="lg" />
              <h3>{m.name}</h3>
              {m.nickname && <p className="nickname">{m.nickname}</p>}
              <p className="class-line">
                {m.dnd_class} · เลเวล {m.level}
              </p>
              {m.role && <p className="role">⚔ {m.role}</p>}
              <span className="tile-cta">ดูรายละเอียด →</span>
            </a>
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
    </main>
  )
}
