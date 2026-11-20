import { Avatar, GithubButton } from './shared.jsx'
import { localized, useLang } from './i18n.js'
import ContactCard from './ContactCard.jsx'

// ห้องโถง = หน้า Portfolio ของกลุ่ม: แนะนำกลุ่ม > สมาชิกจริง > ผลงานของกลุ่ม > ช่องทางติดต่อ
export default function PartyScreen({ group, members }) {
  const { t, lang } = useLang()
  const tagline = localized(group, lang, 'tagline')
  const concept = localized(group, lang, 'concept')
  const highlights = localized(group, lang, 'highlights')

  return (
    <main className="page dev-page hall-page">
      {/* ---------- แนะนำกลุ่ม ---------- */}
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
      </section>

      {/* ---------- สมาชิก ---------- */}
      <section>
        <h2 className="section-title">{t('members_title')}</h2>
        <div className="dev-grid">
          {members.map((m, i) => (
            <a
              className="card dev-card team-card"
              key={m.id}
              href={`#/member/${i + 1}`}
              data-class={m.dnd_class.toLowerCase()}
            >
              <header className="dev-head">
                <div className="dev-portrait">
                  <Avatar member={m} size="lg" variant={i} />
                </div>
                <span className="dev-class">{m.dnd_class}</span>
                <h3>{m.name}</h3>
                <p className="nickname">{localized(m, lang, 'nickname')}</p>
                <p className="dev-role">{localized(m, lang, 'role')}</p>
              </header>
              <p className="bio dev-bio">{localized(m, lang, 'bio')}</p>
              <div className="dev-skills">
                <h4>{t('skills')}</h4>
                <div className="tags">
                  {m.skills.map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <span className="team-card-cta">
                {t('hall_profile')} · {t('hall_project_count', m.projects.length)}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ---------- ผลงานของกลุ่ม ---------- */}
      {group.projects?.length > 0 && (
        <section>
          <h2 className="section-title">{t('group_projects_title')}</h2>
          <div className="dev-projects">
            {group.projects.map((p) => (
              <article className="card dev-project" key={p.id}>
                <p className="dev-project-eyebrow">{t('dev_projects_eyebrow')}</p>
                <h3>{localized(p, lang, 'title')}</h3>
                <p className="dev-project-desc">{localized(p, lang, 'description')}</p>
                {p.tech?.length > 0 && (
                  <div className="tags">
                    {p.tech.map((tech) => (
                      <span className="tag" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {p.github_url && (
                  <div className="dev-project-foot">
                    <GithubButton href={p.github_url}>{t('view_code')}</GithubButton>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ---------- ช่องทางติดต่อ ---------- */}
      <section>
        <h2 className="section-title">{t('contact_title')}</h2>
        <ContactCard contact={group.contact} />
      </section>
    </main>
  )
}
