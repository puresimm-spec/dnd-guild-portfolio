import { Avatar, GithubButton, ProjectList, STAT_ORDER, StatBar } from './shared.jsx'

// หน้ารายละเอียดของผู้เล่นหนึ่งคน (index เริ่มจาก 1 ตามลำดับในหน้าปาร์ตี้)
export default function MemberScreen({ members, index }) {
  const member = Number.isInteger(index) ? members[index - 1] : undefined

  if (!member) {
    return (
      <main className="page center">
        <div className="notice">
          <h2>ไม่พบตัวละครนี้</h2>
          <p>อาจเป็นลิงก์เก่า หรือสมาชิกถูกเปลี่ยนแล้ว</p>
          <a className="btn-gold" href="#/party">
            กลับไปห้องโถง
          </a>
        </div>
      </main>
    )
  }

  const stats = member.stats ?? {}
  const statKeys = [...STAT_ORDER.filter((k) => k in stats), ...Object.keys(stats).filter((k) => !STAT_ORDER.includes(k))]
  const prev = index > 1 ? index - 1 : null
  const next = index < members.length ? index + 1 : null

  return (
    <main className="page">
      <nav className="topbar">
        <a href="#/party">← กลับไปห้องโถง</a>
        <span className="pager">
          {prev ? <a href={`#/member/${prev}`}>‹ คนก่อนหน้า</a> : <span className="disabled">‹ คนก่อนหน้า</span>}
          <em>
            {index} / {members.length}
          </em>
          {next ? <a href={`#/member/${next}`}>คนถัดไป ›</a> : <span className="disabled">คนถัดไป ›</span>}
        </span>
      </nav>

      <article className="card detail">
        <header className="detail-head">
          <Avatar member={member} size="xl" />
          <div>
            <h1>{member.name}</h1>
            {member.nickname && <p className="nickname">{member.nickname}</p>}
            <p className="class-line">
              {member.dnd_class} · เลเวล {member.level}
            </p>
            {member.role && <p className="role">⚔ {member.role}</p>}
          </div>
        </header>

        <div className="detail-grid">
          <div>
            {member.bio && (
              <>
                <h4>แนะนำตัว</h4>
                <p className="bio">{member.bio}</p>
              </>
            )}
            {member.quote && <blockquote>“{member.quote}”</blockquote>}

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
          </div>

          <div>
            {statKeys.length > 0 && (
              <div className="stats">
                <h4>ค่าสถานะตัวละคร</h4>
                {statKeys.map((k) => (
                  <StatBar key={k} label={k} value={stats[k]} />
                ))}
              </div>
            )}
          </div>
        </div>

        <ProjectList projects={member.projects} title="ผลงานเดี่ยว" />

        <footer className="card-foot">
          <GithubButton href={member.github_url}>GitHub ของ {member.nickname || member.name}</GithubButton>
        </footer>
      </article>
    </main>
  )
}
