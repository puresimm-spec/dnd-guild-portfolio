import { useEffect, useState } from 'react'
import './Presentation.css'
import { Avatar } from './shared.jsx'
import { localized, useLang } from './i18n.js'
import { TECH_STACK } from './developer.js'
import { SLIDE_ORDER, SLIDE_TEXT } from './presentation.js'

// หน้า Presentation: สไลด์ 16:9 บนกระดาษ เลื่อนด้วยปุ่มลูกศร จุด หรือปุ่ม ← → บนคีย์บอร์ด
// ปุ่ม "บันทึกเป็น PDF" พิมพ์ทุกสไลด์ หน้าละสไลด์ (เลือกปลายทาง "Save as PDF")
// group, members = ข้อมูลล่าสุดจาก API (seed.json) แก้ข้อมูลกลุ่ม/สมาชิกแล้วสไลด์เปลี่ยนตามเอง
// ระหว่างโหลด สไลด์ที่ต้องใช้ข้อมูลจะยังว่างอยู่
export default function PresentationScreen({ group, members }) {
  const { t } = useLang()
  const [index, setIndex] = useState(0)
  const last = SLIDE_ORDER.length - 1
  const goTo = (i) => setIndex(Math.min(last, Math.max(0, i)))

  // ปุ่มลูกศรบนคีย์บอร์ด (ยกเว้นตอนพิมพ์ในช่องข้อความ)
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') setIndex((i) => Math.min(last, i + 1))
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') setIndex((i) => Math.max(0, i - 1))
      if (e.key === 'Home') setIndex(0)
      if (e.key === 'End') setIndex(last)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [last])

  return (
    <main className="page present">
      <section
        className="slide"
        aria-roledescription={t('pr_slide')}
        aria-label={t('pr_counter', index + 1, SLIDE_ORDER.length)}
      >
        <Slide id={SLIDE_ORDER[index]} group={group} members={members} />
      </section>

      <div className="slide-controls">
        <button type="button" className="slide-arrow" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label={t('pr_prev')}>
          ‹
        </button>
        <div className="slide-dots">
          {SLIDE_ORDER.map((s, i) => (
            <button
              key={s}
              type="button"
              aria-label={t('pr_goto', i + 1)}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button type="button" className="slide-arrow" onClick={() => goTo(index + 1)} disabled={index === last} aria-label={t('pr_next')}>
          ›
        </button>
      </div>
      <p className="slide-hint">
        {t('pr_counter', index + 1, SLIDE_ORDER.length)} · {t('pr_hint')} ·{' '}
        <button type="button" className="slide-print" onClick={() => window.print()}>
          {t('pr_pdf')}
        </button>
      </p>

      {/* ชุดสำหรับพิมพ์: แสดงเฉพาะตอนพิมพ์ ทุกสไลด์ หน้าละสไลด์ */}
      <div className="print-deck" aria-hidden="true">
        {SLIDE_ORDER.map((id) => (
          <section className="slide print-slide" key={id}>
            <Slide id={id} group={group} members={members} />
          </section>
        ))}
      </div>
    </main>
  )
}

function Slide({ id, group, members = [] }) {
  const { t, lang } = useLang()
  const pick = (obj) => obj?.[lang] ?? obj?.th ?? ''
  const s = SLIDE_TEXT[id]
  const head = (
    <>
      <p className="slide-eyebrow">{pick(s.eyebrow)}</p>
      {s.title && <h1 className="slide-title">{pick(s.title)}</h1>}
    </>
  )
  const shortName = (m) => (localized(m, lang, 'nickname') ?? m.name).split(' ')[0]

  switch (id) {
    case 'cover':
      return (
        <>
          <p className="slide-eyebrow">{pick(s.eyebrow)}</p>
          <h1 className="slide-title">{group?.name ?? 'Buddy Build'}</h1>
          {group && <p className="slide-tagline">{localized(group, lang, 'tagline')}</p>}
          <p className="slide-lead">{pick(s.lead)}</p>
          {members.length > 0 && (
            <p className="slide-sub">
              {members.map(shortName).join(' · ')} — {pick(s.team)}
            </p>
          )}
        </>
      )
    case 'group':
      return (
        <>
          <p className="slide-eyebrow">{pick(s.eyebrow)}</p>
          {group && (
            <>
              <h1 className="slide-title">{localized(group, lang, 'tagline')}</h1>
              <p className="slide-lead">{localized(group, lang, 'concept')}</p>
              <div className="slide-grid">
                {(localized(group, lang, 'highlights') ?? []).map((h) => (
                  <div className="slide-box" key={h}>
                    {h}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )
    case 'team':
      return (
        <>
          {head}
          <div className="slide-team">
            {members.map((m, i) => (
              <div className="slide-dev" key={m.id} data-class={m.dnd_class.toLowerCase()}>
                <Avatar member={m} size="md" variant={i} />
                <b>{shortName(m)}</b>
                <span>{m.name}</span>
                <small>{localized(m, lang, 'role')}</small>
                <span className="slide-dev-skills">{m.skills.slice(0, 3).join(' · ')}</span>
                <span className="slide-dev-count">{pick(s.projects)(m.projects.length)}</span>
              </div>
            ))}
          </div>
        </>
      )
    case 'projects':
      return (
        <>
          {head}
          <div className="slide-projects">
            {(group?.projects ?? []).map((p) => (
              <div className="slide-box slide-project-main" key={`g${p.id}`}>
                <b>{pick(s.group)}</b>
                <strong>{localized(p, lang, 'title')}</strong>
                <span>{p.tech?.join(' · ')}</span>
              </div>
            ))}
            {members.map((m) => (
              <div className="slide-box" key={m.id}>
                <b>{shortName(m)}</b>
                {m.projects.length ? (
                  <ul>
                    {m.projects.map((p) => (
                      <li key={p.id}>{localized(p, lang, 'title')}</li>
                    ))}
                  </ul>
                ) : (
                  <em>{pick(s.none)}</em>
                )}
              </div>
            ))}
          </div>
        </>
      )
    case 'features':
    case 'ai':
      return (
        <>
          {head}
          <div className="slide-grid">
            {s.items.map((item) => (
              <div className="slide-box" key={pick(item.title)}>
                <b>{pick(item.title)}</b>
                {pick(item.body)}
              </div>
            ))}
          </div>
          {id === 'ai' && (
            <div className="slide-metric">
              <span className="before">{pick(s.before)}</span>
              <span className="arrow" aria-hidden="true">
                →
              </span>
              <span className="after">{pick(s.after)}</span>
              <small>{pick(s.metricNote)}</small>
            </div>
          )}
        </>
      )
    case 'arch':
      return (
        <>
          {head}
          <ol className="flow slide-flow">
            {t('dev_flow').map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="slide-lead">{pick(s.lead)}</p>
        </>
      )
    case 'quality':
      return (
        <>
          {head}
          <ol className="flow slide-flow">
            {pick(s.steps).map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="slide-lead">{pick(s.lead)}</p>
        </>
      )
    case 'stack':
      return (
        <>
          {head}
          <div className="slide-grid">
            {TECH_STACK.map((part) => (
              <div className="slide-box" key={part.items.join()}>
                <b>{pick(part.title)}</b>
                {part.items.join(' · ')}
              </div>
            ))}
          </div>
        </>
      )
    case 'demo':
      return (
        <>
          {head}
          <p className="slide-lead">{pick(s.lead)}</p>
          <div className="slide-demo">
            <a className="btn-gold" href="#/party">
              {pick(s.hall)}
            </a>
            <a className="btn-outline" href="#/chat">
              {pick(s.chat)}
            </a>
            <a className="btn-outline" href="#/training">
              {pick(s.training)}
            </a>
          </div>
          {group?.contact && (
            <p className="slide-contact">
              <b>{pick(s.contact)}:</b> {group.contact.email}
              {group.contact.github && <> · {group.contact.github.replace(/^https?:\/\//, '')}</>}
            </p>
          )}
        </>
      )
    default:
      return head
  }
}
