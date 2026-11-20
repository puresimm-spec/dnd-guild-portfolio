import { GithubButton } from './shared.jsx'
import { localized, useLang } from './i18n.js'
import { REPO_URL, TECH_STACK } from './developer.js'

// เบื้องหลังเว็บไซต์: เกี่ยวกับโปรเจกต์ ระบบทำงานอย่างไร การตรวจคุณภาพ (CI/CD) และเทคโนโลยี
// (สมาชิกและผลงานของกลุ่มอยู่ในห้องโถง) ข้อมูลคงที่ ไม่ต้องรอ backend
// members = สมาชิกจากข้อมูลจริง ใช้ทำแถบเครดิตท้ายหน้า (ระหว่างโหลดจะยังไม่แสดง)
export default function DeveloperScreen({ members }) {
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
        <h2 className="section-title">{t('dev_quality_title')}</h2>
        <div className="stack-grid">
          {t('dev_quality').map((q) => (
            <div className="card stack-card" key={q.title}>
              <h4>{q.title}</h4>
              <p className="quality-body">{q.body}</p>
            </div>
          ))}
        </div>
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

      {members?.length > 0 && (
        <section className="credits">
          <h2 className="section-title">{t('dev_credits')}</h2>
          <ul className="credit-list">
            {members.map((m, i) => (
              <li key={m.id}>
                <a href={`#/member/${i + 1}`}>
                  <strong>{(localized(m, lang, 'nickname') ?? m.name).split(' ')[0]}</strong>
                  <span>{localized(m, lang, 'role')}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="page-foot">{t('dev_footer')}</footer>
    </main>
  )
}
