import { linkify } from './useGuildChat.js'

// แสดงข้อความแชต: ขึ้นบรรทัดใหม่ตามต้นฉบับ (CSS pre-wrap) และทำ URL ให้กดได้ โดยไม่ใช้ innerHTML
export default function MessageText({ text }) {
  return linkify(text).map((part, i) =>
    part.href ? (
      <a key={i} href={part.href} target="_blank" rel="noopener noreferrer">
        {part.href}
      </a>
    ) : (
      <span key={i}>{part.text}</span>
    )
  )
}
