import { useEffect, useRef, useState } from 'react'
import './Lobby.css'
import { useLang } from './i18n.js'

// ส่วนที่ใช้ร่วมกันระหว่างลานต้อนรับ (LobbyScreen) กับปุ่ม Guild Keeper มุมซ้ายบน (KeeperNav)
//   - Typed: กล่องคำพูดที่ค่อยๆ พิมพ์ทีละตัว
//   - MenuList: รายการเมนูแบบเกม (ชี้/โฟกัสแล้วบอก onHint, ลูกศรขึ้นลงเลื่อนได้)

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI']

const calm = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// แยกข้อความเป็นตัวอักษรที่มองเห็น (สระ/วรรณยุกต์ไทยไม่หลุดจากพยัญชนะ)
function graphemes(text, lang) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter(lang, { granularity: 'grapheme' }).segment(text), (s) => s.segment)
  }
  return Array.from(text)
}

// ข้อความค่อยๆ พิมพ์ทีละตัวแบบกล่องคำพูดในเกม กดที่กล่องเพื่อแสดงทั้งหมดทันที
// ใช้ key={text} ตอนเรียก เพื่อเริ่มพิมพ์ใหม่ทุกครั้งที่ข้อความเปลี่ยน
export function Typed({ text, lang, delay = 0, speed = 28 }) {
  const { t } = useLang()
  const chars = graphemes(text, lang)
  const [count, setCount] = useState(() => (calm() ? chars.length : 0))
  const done = count >= chars.length

  useEffect(() => {
    if (done) return
    const timer = setTimeout(() => setCount((c) => c + 1), count === 0 ? delay : speed)
    return () => clearTimeout(timer)
  }, [count, done, delay, speed])

  return (
    <p className="lobby-say">
      {/* โปรแกรมอ่านหน้าจออ่านข้อความเต็มทันที ส่วนที่ค่อยๆ พิมพ์มีไว้ให้ตาดู */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{chars.slice(0, count).join('')}</span>
      {done ? (
        <span className="lobby-say-more" aria-hidden="true">
          ▼
        </span>
      ) : (
        <button type="button" className="lobby-say-skip" onClick={() => setCount(chars.length)}>
          <span className="sr-only">{t('lb_skip')}</span>
        </button>
      )}
    </p>
  )
}

// items: [{ id, href, label, desc }]  current: id ของหน้าที่อยู่ตอนนี้ (ถ้ามี)
export function MenuList({ items, current, onHint, listRef }) {
  const { t } = useLang()
  const ownRef = useRef(null)
  const ref = listRef ?? ownRef

  // ลูกศรขึ้น/ลง เลื่อนระหว่างเมนู แบบเมนูในเกม
  const onKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const links = [...ref.current.querySelectorAll('a')]
    const i = links.indexOf(document.activeElement)
    const next = e.key === 'ArrowDown' ? (i + 1) % links.length : (i - 1 + links.length) % links.length
    links[next].focus()
    e.preventDefault()
  }

  return (
    <ul
      ref={ref}
      className="lobby-list"
      onKeyDown={onKeyDown}
      onMouseLeave={() => onHint(null)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && onHint(null)}
    >
      {items.map((m, n) => {
        const here = m.id === current
        return (
          <li key={m.id} style={{ '--i': n }}>
            <a
              className={`lobby-item${m.id === 'leave' ? ' leave' : ''}`}
              href={m.href}
              aria-current={here ? 'page' : undefined}
              onMouseEnter={() => onHint(m.id)}
              onFocus={() => onHint(m.id)}
            >
              <span className="lobby-num" aria-hidden="true">
                {m.id === 'leave' ? '↩' : NUMERALS[n]}
              </span>
              <span className="lobby-text">
                <strong>{m.label}</strong>
                <small>{m.desc}</small>
              </span>
              {here ? (
                <span className="lobby-here">{t('kn_here')}</span>
              ) : (
                <span className="lobby-cursor" aria-hidden="true">
                  ▶
                </span>
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
