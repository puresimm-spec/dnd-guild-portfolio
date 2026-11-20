import { Avatar, GithubButton } from './shared.jsx'
import { localized, useLang } from './i18n.js'
import { resolveClass } from './sprites.js'
import './CharFrame.css'

// หน้าปาร์ตี้: ภาพรวมของกลุ่ม + ไทล์ตัวละครตัวอย่าง (กดเข้าไปวางแผน build รายตัว)
export default function PartyScreen({ group, members }) {
  const { t, lang } = useLang()
  const tagline = localized(group, lang, 'tagline')
  const concept = localized(group, lang, 'concept')
  const highlights = localized(group, lang, 'highlights')

  return (
    <main className="page">
      <section className="hero compact">
        <p className="eyebrow">⚜ Adventurers’ Guild ⚜</p>
        <h1>{group.name}</h1>
        {tagline && <p className="tagline">{tagline}</p>}
        {concept && <p className="concept">{concept}</p>}

        {highlights?.length > 0 && (
          <ul className="highlights">
            {highlights.map((h) => (
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
            <a className="tile" key={m.id} href={`#/member/${i + 1}`} data-class={resolveClass(m.dnd_class)}>
              <div className="char-wrap">
                <div className="char-frame">
                  <Avatar member={m} size="lg" variant={i} />
                </div>
                <span className="frame-level" aria-hidden="true">
                  {m.level}
                </span>
              </div>
              <h3>{m.name}</h3>
              <p className="class-line">
                {m.dnd_class} · {t('level', m.level)}
              </p>
              <span className="tile-cta">{t('view_details')}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="page-foot">{t('stats_note')}</footer>
    </main>
  )
}
