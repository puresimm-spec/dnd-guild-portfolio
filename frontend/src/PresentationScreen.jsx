import { useEffect, useState } from 'react'
import './Presentation.css'
import { Avatar } from './shared.jsx'
import { useLang } from './i18n.js'
import { DEVELOPERS, TECH_STACK } from './developer.js'
import { SLIDE_ORDER, SLIDE_TEXT } from './presentation.js'

// หน้า Presentation: สไลด์ 16:9 บนกระดาษ เลื่อนด้วยปุ่มลูกศร จุด หรือปุ่ม ← → บนคีย์บอร์ด
// เป็นข้อมูลคงที่ ไม่ต้องรอ backend
export default function PresentationScreen() {
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

  const id = SLIDE_ORDER[index]

  return (
    <main className="page present">
      <section className="slide" aria-roledescription={t('pr_slide')} aria-label={t('pr_counter', index + 1, SLIDE_ORDER.length)}>
        <Slide id={id} />
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
        {t('pr_counter', index + 1, SLIDE_ORDER.length)} · {t('pr_hint')}
      </p>
    </main>
  )
}

function Slide({ id }) {
  const { t, lang } = useLang()
  const pick = (obj) => obj?.[lang] ?? obj?.th ?? ''
  const s = SLIDE_TEXT[id]
  const head = (
    <>
      <p className="slide-eyebrow">{pick(s.eyebrow)}</p>
      <h1 className="slide-title">{pick(s.title)}</h1>
    </>
  )

  switch (id) {
    case 'cover':
      return (
        <>
          {head}
          <p className="slide-lead">{pick(s.lead)}</p>
          <p className="slide-sub">
            {DEVELOPERS.map((d) => d.nickname.split(' ')[0]).join(' · ')} — {pick(s.team)}
          </p>
        </>
      )
    case 'idea':
      return (
        <>
          {head}
          <p className="slide-lead">{pick(s.lead)}</p>
          <div className="slide-grid">
            {Object.values(t('bq_goals')).map((g) => (
              <div className="slide-box" key={g.title}>
                <b>{g.title}</b>
                {g.desc}
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
    case 'team':
      return (
        <>
          {head}
          <div className="slide-team">
            {DEVELOPERS.map((d) => (
              <div className="slide-dev" key={d.name} data-class={d.dndClass.toLowerCase()}>
                <Avatar member={{ name: d.name, dnd_class: d.dndClass, photo: null, portrait: d.portrait }} size="md" variant={d.variant} />
                <b>{d.nickname}</b>
                <span>{d.name}</span>
                <small>{pick(d.role)}</small>
              </div>
            ))}
          </div>
        </>
      )
    case 'stack':
      return (
        <>
          {head}
          <div className="slide-grid">
            {TECH_STACK.map((group) => (
              <div className="slide-box" key={group.items.join()}>
                <b>{pick(group.title)}</b>
                {group.items.join(' · ')}
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
            <a className="btn-outline" href="#/member/1">
              {pick(s.planner)}
            </a>
            <a className="btn-outline" href="#/developer">
              {pick(s.dev)}
            </a>
          </div>
        </>
      )
    default:
      return head
  }
}
