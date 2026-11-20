import { Avatar, GithubButton } from './shared.jsx'
import { useLang } from './i18n.js'

// หน้าปาร์ตี้: ภาพรวมของกลุ่ม + ไทล์สมาชิกทุกคน (กดเข้าไปดูรายละเอียดรายคน)
export default function PartyScreen({ group, members }) {
  const { t } = useLang()
  return (
    <main className="page">
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

        <GithubButton href={group.contact?.github}>{t('github_party')}</GithubButton>
      </section>

      <section>
        <h2 className="section-title">{t('members_title')}</h2>
        <div className="tiles">
          {members.map((m, i) => (
            <a className="tile" key={m.id} href={`#/member/${i + 1}`}>
              <Avatar member={m} size="lg" variant={i} />
              <h3>{m.name}</h3>
              {m.nickname && <p className="nickname">{m.nickname}</p>}
              <p className="class-line">
                {m.dnd_class} · {t('level', m.level)}
              </p>
              {m.role && <p className="role">⚔ {m.role}</p>}
              <span className="tile-cta">{t('view_details')}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="page-foot">{t('stats_note')}</footer>
    </main>
  )
}
