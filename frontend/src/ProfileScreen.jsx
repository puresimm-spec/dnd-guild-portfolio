import { Avatar, GithubButton } from './shared.jsx'
import { localized, useLang } from './i18n.js'
import { go } from './useRoute.js'
import { askInChat } from './useGuildChat.js'
import ContactCard from './ContactCard.jsx'

// โปรไฟล์สมาชิกหนึ่งคน (index เริ่มจาก 1 ตามลำดับในห้องโถง)
// ชื่อ · บทบาทในทีม · แนะนำตัว · ทักษะ · ผลงาน · ช่องทางติดต่อ + ปุ่มถาม AI เกี่ยวกับคนนี้
export default function ProfileScreen({ group, members, index }) {
  const { t, lang } = useLang()
  const member = Number.isInteger(index) ? members[index - 1] : undefined

  if (!member) {
    return (
      <main className="page center">
        <div className="notice">
          <h2>{t('nf_title')}</h2>
          <p>{t('nf_body')}</p>
          <a className="btn-gold" href="#/party">
            {t('back_hall_btn')}
          </a>
        </div>
      </main>
    )
  }

  const prev = index > 1 ? index - 1 : null
  const next = index < members.length ? index + 1 : null
  const nickname = localized(member, lang, 'nickname')
  const shortName = (nickname ?? member.name).split(' ')[0]

  function askAI() {
    askInChat(t('pf_ask_q', shortName))
    go('/chat')
  }

  return (
    <main className="page profile-page">
      <nav className="topbar">
        <a href="#/party">{t('back_hall')}</a>
        <span className="pager">
          {prev ? <a href={`#/member/${prev}`}>{t('prev')}</a> : <span className="disabled">{t('prev')}</span>}
          <em>
            {index} / {members.length}
          </em>
          {next ? <a href={`#/member/${next}`}>{t('next')}</a> : <span className="disabled">{t('next')}</span>}
        </span>
      </nav>

      <article className="card dev-card profile-card" data-class={member.dnd_class.toLowerCase()}>
        <header className="profile-head">
          <div className="dev-portrait">
            <Avatar member={member} size="xl" variant={index - 1} />
          </div>
          <div className="profile-id">
            <span className="dev-class">{member.dnd_class}</span>
            <h1>{member.name}</h1>
            {nickname && <p className="nickname">{nickname}</p>}
            <p className="profile-role">
              <span>{t('pf_role')}</span>
              {localized(member, lang, 'role')}
            </p>
            <div className="profile-actions">
              <button type="button" className="btn-gold" onClick={askAI}>
                🗨 {t('pf_ask', shortName)}
              </button>
              <GithubButton href={member.github_url}>{t('github_of', shortName)}</GithubButton>
            </div>
          </div>
        </header>

        <div className="profile-body">
          <section className="profile-section">
            <h2>{t('about')}</h2>
            <p className="profile-bio">{localized(member, lang, 'bio')}</p>
          </section>

          <section className="profile-section">
            <h2>{t('skills')}</h2>
            <div className="tags">
              {member.skills.map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="profile-section profile-projects">
            <h2>{t('pf_projects')}</h2>
            {member.projects.length === 0 ? (
              <p className="profile-empty">{t('pf_no_projects')}</p>
            ) : (
              member.projects.map((p) => (
                <div className="profile-project" key={p.id}>
                  <h3>{localized(p, lang, 'title')}</h3>
                  <p>{localized(p, lang, 'description')}</p>
                  {p.tech?.length > 0 && (
                    <div className="tags">
                      {p.tech.map((tech) => (
                        <span className="tag" key={tech}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <GithubButton href={p.github_url}>{t('view_code')}</GithubButton>
                </div>
              ))
            )}
          </section>
        </div>
      </article>

      <section className="profile-contact">
        <h2 className="section-title">{t('contact_title')}</h2>
        <ContactCard contact={group.contact} />
      </section>
    </main>
  )
}
