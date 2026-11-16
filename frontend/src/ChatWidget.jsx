import { useEffect, useRef, useState } from 'react'
import './Chat.css'

const STORAGE_KEY = 'guild-conversation-id'
const MAX_LENGTH = 1000 // ต้องตรงกับ MAX_MESSAGE_LENGTH ใน backend
const SUGGESTIONS = ['ในปาร์ตี้มีใครบ้าง', 'ใครเก่งเรื่อง AI', 'ขอดูผลงานของทีมหน่อย']

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
      if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะ')
      setConversationId(data.conversationId)
      saveId(data.conversationId)
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err.message)
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
        <button className="chat-fab" onClick={() => setOpen(true)} aria-label="เปิดแชตกับ Guild Keeper">
          🗨 ถาม Guild Keeper
        </button>
      )}

      {open && (
        <section className="chat-panel" aria-label="แชตกับ Guild Keeper">
          <header className="chat-head">
            <strong>Guild Keeper</strong>
            <div>
              <button onClick={newChat} title="เริ่มคุยใหม่">
                ↻
              </button>
              <button onClick={() => setOpen(false)} aria-label="ปิดแชต">
                ✕
              </button>
            </div>
          </header>

          <div className="chat-body">
            {messages.length === 0 && (
              <div className="chat-empty">
                <p>ข้าคือผู้ดูแลห้องโถงกิลด์ ถามเรื่องปาร์ตี้และสมาชิกได้เลย</p>
                <div className="chat-suggestions">
                  {SUGGESTIONS.map((s) => (
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

            {sending && <div className="bubble assistant typing">กำลังร่ายคาถา…</div>}
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
              placeholder="พิมพ์คำถาม…"
              maxLength={MAX_LENGTH}
              rows={1}
              disabled={sending}
            />
            <button type="submit" disabled={sending || !input.trim()}>
              ส่ง
            </button>
          </form>
        </section>
      )}
    </>
  )
}
