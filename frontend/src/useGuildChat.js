import { useEffect, useState } from 'react'
import { useLang } from './i18n.js'

// ตรรกะแชตกับ Guild Keeper ของหน้าแชต (ChatScreen): ส่งข้อความ โหลดประวัติ ลองใหม่
// รหัสการสนทนาเก็บใน localStorage ตัวข้อความเก็บในฐานข้อมูล รีเฟรชแล้วบทสนทนายังอยู่

const STORAGE_KEY = 'guild-conversation-id'
const ASK_KEY = 'guild-chat-ask' // คำถามที่ส่งต่อมาจากหน้าอื่น (เช่น ปุ่ม "ถาม AI เกี่ยวกับ..." ในโปรไฟล์)
export const MAX_LENGTH = 1000 // ต้องตรงกับ MAX_MESSAGE_LENGTH ใน backend

// ฝากคำถามไว้ให้หน้าแชตส่งเองเมื่อเปิดขึ้นมา
export function askInChat(question) {
  try {
    sessionStorage.setItem(ASK_KEY, question)
  } catch {
    /* ใช้ sessionStorage ไม่ได้: ผู้ใช้ยังพิมพ์ถามเองในหน้าแชตได้ */
  }
}
// หยิบคำถามที่ฝากไว้ (หยิบได้ครั้งเดียว)
export function takePendingQuestion() {
  try {
    const q = sessionStorage.getItem(ASK_KEY)
    sessionStorage.removeItem(ASK_KEY)
    return q
  } catch {
    return null
  }
}

// localStorage อาจใช้ไม่ได้ในบางโหมด จึงครอบ try/catch
const loadId = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}
const saveId = (id) => {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ไม่เป็นไร: แค่จำบทสนทนาข้ามรีเฟรชไม่ได้ */
  }
}

export function useGuildChat() {
  const { t, lang } = useLang()
  const [messages, setMessages] = useState([]) // [{ role: 'user' | 'assistant', content, at }]
  const [conversationId, setConversationId] = useState(loadId)
  const [sending, setSending] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(() => Boolean(loadId()))
  const [error, setError] = useState(null)

  // โหลดประวัติเดิมครั้งเดียว (ถ้ามีรหัสการสนทนาเก็บไว้)
  useEffect(() => {
    const id = loadId()
    if (!id) return
    let cancelled = false
    fetch(`/api/chat/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((json) => {
        if (!cancelled) {
          setMessages(json.messages.map(({ role, content, created_at }) => ({ role, content, at: created_at })))
        }
      })
      .catch(() => {
        // รหัสเก่าใช้ไม่ได้ เริ่มคุยใหม่
        saveId(null)
        if (!cancelled) setConversationId(null)
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // ข้อความ error: ภาษาไทยใช้ข้อความจาก backend ภาษาอังกฤษแปลตามรหัสสถานะ
  function errorText(status, serverMessage) {
    if (lang === 'th') return serverMessage || t('chat_err_generic')
    const key = `chat_err_${status}`
    return t(key) === key ? t('chat_err_generic') : t(key)
  }

  async function send(text) {
    const message = text.trim()
    if (!message || sending) return false
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: message, at: new Date().toISOString() }])
    setSending(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, ...(conversationId ? { conversationId } : {}) }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(errorText(res.status, data.error))
      setConversationId(data.conversationId)
      saveId(data.conversationId)
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply, at: new Date().toISOString() }])
      return true
    } catch (err) {
      // เอาคำถามที่ไม่ได้คำตอบออก แล้วให้กดลองใหม่ได้ (ไม่ให้มีคำถามค้างโดยไม่มีคำตอบ)
      setMessages((prev) => prev.slice(0, -1))
      setError({ text: err instanceof TypeError ? t('chat_err_generic') : err.message, retry: message })
      return false
    } finally {
      setSending(false)
    }
  }

  function newChat() {
    saveId(null)
    setConversationId(null)
    setMessages([])
    setError(null)
  }

  return { messages, sending, loadingHistory, error, send, newChat, retry: () => error && send(error.retry) }
}

// แยกข้อความเป็นช่วงข้อความธรรมดากับลิงก์ (AI ตอบเป็นข้อความธรรมดาที่มี URL)
// คืนเป็นรายการ { text } หรือ { href } ให้คอมโพเนนต์แสดงผล โดยไม่ใช้ innerHTML
const URL_PATTERN = /(https?:\/\/[^\s<>"')\]]+[^\s<>"')\].,!?;:])/g
export function linkify(text) {
  const parts = []
  let last = 0
  for (const match of text.matchAll(URL_PATTERN)) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index) })
    parts.push({ href: match[0] })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last) })
  return parts
}
