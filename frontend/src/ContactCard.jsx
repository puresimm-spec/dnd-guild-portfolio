import { useState } from 'react'
import { safeUrl } from './shared.jsx'
import { useLang } from './i18n.js'

// การ์ดช่องทางติดต่อของกลุ่ม: อีเมล (กดส่งอีเมล หรือคัดลอก) + GitHub + ชวนไปถาม AI
export default function ContactCard({ contact = {} }) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  const github = safeUrl(contact.github)
  const email = typeof contact.email === 'string' && /^[^\s@]+@[^\s@]+$/.test(contact.email) ? contact.email : null

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* คัดลอกไม่ได้ (บางเบราว์เซอร์) ผู้ใช้ยังเลือกข้อความเองได้ */
    }
  }

  return (
    <div className="card contact-card">
      {email && (
        <div className="contact-row">
          <span className="contact-icon" aria-hidden="true">
            ✉
          </span>
          <div className="contact-main">
            <span className="contact-label">{t('contact_email')}</span>
            <a href={`mailto:${email}`} className="contact-value">
              {email}
            </a>
          </div>
          <button type="button" className="contact-copy" onClick={copyEmail}>
            {copied ? t('pl_copied') : t('pl_copy')}
          </button>
        </div>
      )}
      {github && (
        <div className="contact-row">
          <span className="contact-icon" aria-hidden="true">
            ⌥
          </span>
          <div className="contact-main">
            <span className="contact-label">GitHub</span>
            <a href={github} target="_blank" rel="noopener noreferrer" className="contact-value">
              {github.replace(/^https?:\/\//, '')}
            </a>
          </div>
        </div>
      )}
      <div className="contact-row">
        <span className="contact-icon" aria-hidden="true">
          🗨
        </span>
        <div className="contact-main">
          <span className="contact-label">{t('contact_ai')}</span>
          <a href="#/chat" className="contact-value">
            {t('contact_ai_link')}
          </a>
        </div>
      </div>
    </div>
  )
}
