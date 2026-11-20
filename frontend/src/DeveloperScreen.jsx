import { Avatar, GithubButton } from './shared.jsx'
import { useLang } from './i18n.js'
import { DEVELOPERS, REPO_URL, TECH_STACK } from './developer.js'

// หน้าข้อมูลผู้พัฒนาเว็บไซต์ (ข้อมูลมาจาก developer.js ไม่ต้องรอ backend)
// projects = ผลงานของทีม (จาก seed.json ผ่าน API) ระหว่างโหลดจะยังไม่แสดงส่วนนี้
export default function DeveloperScreen({ projects }) {
  const { t, lang } = useLang()
  const pick = (obj) => obj?.[lang] ?? obj?.th ?? ''

  return (
    <main className="page dev-page">
      <section className="hero compact">
        <p className="eyebrow">⚜ {t('dev_eyebrow')} ⚜</p>
        <h1>{t('dev_title')}</h1>
        <p className="concept">{t('dev_intro')}</p>
        <GithubButton href={REPO_URL}>{t('dev_source')}</GithubButton>
      </section>

      <section>
        <h2 className="section-title">{t('dev_team')}</h2>
        <div className="dev-grid">
          {DEVELOPERS.map((d) => (
            <article className="card dev-card" key={d.name} data-class={d.dndClass.toLowerCase()}>
              <header className="dev-head">
                <div className="dev-portrait">
                  <Avatar
                    member={{ name: d.name, dnd_class: d.dndClass, photo: null, portrait: d.portrait }}
                    size="lg"
                    variant={d.variant}
                  />
                </div>
                <span className="dev-class">{d.dndClass}</span>
                <h3>{d.name}</h3>
                <p className="nickname">{d.nickname}</p>
                <p className="dev-role">{pick(d.role)}</p>
              </header>

              <p className="bio dev-bio">{pick(d.bio)}</p>

              {d.skills.length > 0 && (
                <div className="dev-skills">
                  <h4>{t('skills')}</h4>
                  <div className="tags">
                    {d.skills.map((s) => (
                      <span className="tag" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {d.github && (
                <div className="dev-foot">
                  <GithubButton href={d.github}>{t('github_of', d.nickname)}</GithubButton>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {projects?.length > 0 && (
        <section>
          <h2 className="section-title">{t('dev_projects_title')}</h2>
          <div className="dev-projects">
            {projects.map((p) => (
              <article className="card dev-project" key={p.id ?? p.title}>
                <p className="dev-project-eyebrow">{t('dev_projects_eyebrow')}</p>
                <h3>{p.title}</h3>
                <p className="dev-project-desc">{p.description}</p>
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

      <section>
        <h2 className="section-title">{t('dev_project_title')}</h2>
        <div className="card wide">
          <p className="bio">{t('dev_project_body')}</p>
          <h4>{t('dev_features_title')}</h4>
          <ul className="feature-list">
            {t('dev_features').map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="section-title">{t('dev_flow_title')}</h2>
        <ol className="flow">
          {t('dev_flow').map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="section-title">{t('dev_stack_title')}</h2>
        <div className="stack-grid">
          {TECH_STACK.map((group) => (
            <div className="card stack-card" key={group.items.join()}>
              <h4>{pick(group.title)}</h4>
              <div className="tags">
                {group.items.map((item) => (
                  <span className="tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="page-foot">{t('dev_footer')}</footer>
    </main>
  )
}
