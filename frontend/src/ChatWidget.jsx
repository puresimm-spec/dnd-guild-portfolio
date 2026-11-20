import { useEffect, useRef, useState } from 'react'
import './Chat.css'
import { useLang } from './i18n.js'

const STORAGE_KEY = 'guild-conversation-id'
const MAX_LENGTH = 1000 // ต้องตรงกับ MAX_MESSAGE_LENGTH ใน backend

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

export default function ChatWidget() {
  const { t, lang } = useLang()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([]) // [{ role: 'user' | 'assistant', content }]
  const [conversationId, setConversationId] = useState(loadId)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const endRef = useRef(null)

  // โหลดประวัติเดิมครั้งเดียวตอนเปิดหน้า (ถ้ามีรหัสการสนทนาเก็บไว้)
  useEffect(() => {
    const id = loadId()
    if (!id) return
    let cancelled = false
    fetch(`/api/chat/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((json) => {
        if (!cancelled) setMessages(json.messages.map(({ role, content }) => ({ role, content })))
      })
      .catch(() => {
        // รหัสเก่าใช้ไม่ได้ เริ่มคุยใหม่
        saveId(null)
        if (!cancelled) setConversationId(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // เลื่อนลงล่างสุดทุกครั้งที่มีข้อความใหม่
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending, open])

  // ข้อความ error: ภาษาไทยใช้ข้อความจาก backend ภาษาอังกฤษแปลตามรหัสสถานะ
  function errorText(status, serverMessage) {
    if (lang === 'th') return serverMessage || t('chat_err_generic')
    return t(`chat_err_${status}`) === `chat_err_${status}` ? t('chat_err_generic') : t(`chat_err_${status}`)
  }

  async function send(text) {
    const message = text.trim()
    if (!message || sending) return
    setError(null)
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: message }])
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
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err instanceof TypeError ? t('chat_err_generic') : err.message)
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

  function onKeyDown(e) {
    // Enter = ส่ง, Shift+Enter = ขึ้นบรรทัดใหม่ (ไม่ส่งตอนกำลังพิมพ์ภาษาไทยด้วย IME)
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <>
      {!open && (
        <button className="chat-fab" onClick={() => setOpen(true)} aria-label={t('chat_open')}>
          {t('chat_fab')}
        </button>
      )}

      {open && (
        <section className="chat-panel" aria-label={t('chat_open')}>
          <header className="chat-head">
            <strong>Guild Keeper</strong>
            <div>
              <button onClick={newChat} title={t('chat_new')} aria-label={t('chat_new')}>
                ↻
              </button>
              <button onClick={() => setOpen(false)} aria-label={t('chat_close')}>
                ✕
              </button>
            </div>
          </header>

          <div className="chat-body">
            {messages.length === 0 && (
              <div className="chat-empty">
                <p>{t('chat_intro')}</p>
                <div className="chat-suggestions">
                  {t('chat_suggestions').map((s) => (
                    <button key={s} onClick={() => send(s)} disabled={sending}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`}>
                {m.content}
              </div>
            ))}

            {sending && <div className="bubble assistant typing">{t('chat_typing')}</div>}
            {error && <div className="chat-error">{error}</div>}
            <div ref={endRef} />
          </div>

          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t('chat_placeholder')}
              maxLength={MAX_LENGTH}
              rows={1}
              disabled={sending}
            />
            <button type="submit" disabled={sending || !input.trim()}>
              {t('chat_send')}
            </button>
          </form>
        </section>
      )}
    </>
  )
}
