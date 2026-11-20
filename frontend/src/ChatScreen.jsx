import { useEffect, useRef, useState } from 'react'
import './ChatScreen.css'
import { localized, useLang } from './i18n.js'
import { MAX_LENGTH, takePendingQuestion, useGuildChat } from './useGuildChat.js'
import PixelAvatar from './PixelAvatar.jsx'
import MessageText from './MessageText.jsx'

// หน้าแชตเต็มจอกับ Guild Keeper (AI)
// ซ้าย: แนะนำ AI + คำถามแนะนำ (เรื่องกลุ่ม / เรื่องสมาชิกแต่ละคน)  ขวา: บทสนทนา
// ใช้บทสนทนาเดียวกับปุ่มแชตลอย (รหัสการสนทนาเก็บใน localStorage ประวัติเก็บในฐานข้อมูล)
// members = สมาชิกจริงจาก API (ใช้สร้างคำถามรายคน ระหว่างโหลดจะยังไม่แสดงส่วนนี้)
export default function ChatScreen({ members }) {
  const { t, lang } = useLang()
  const { messages, sending, loadingHistory, error, send, newChat, retry } = useGuildChat()
  const [input, setInput] = useState('')
  const logRef = useRef(null)
  const inputRef = useRef(null)
  const askedRef = useRef(false)

  // คำถามที่ฝากมาจากหน้าโปรไฟล์ ("ถาม AI เกี่ยวกับ...") ส่งให้เองหลังโหลดประวัติเดิมเสร็จ
  // (รอให้โหลดเสร็จก่อน ไม่อย่างนั้นประวัติที่โหลดทีหลังจะทับข้อความใหม่)
  useEffect(() => {
    if (loadingHistory || askedRef.current) return
    askedRef.current = true
    const q = takePendingQuestion()
    if (q) send(q)
  }, [loadingHistory, send])

  // เลื่อนกล่องบทสนทนาลงล่างสุดเมื่อมีข้อความใหม่ (เลื่อนเฉพาะกล่อง ไม่ดึงทั้งหน้า)
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length, sending, error])

  // ช่องพิมพ์ยืดตามความยาวข้อความ (สูงสุด ~6 บรรทัด)
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  async function submit(text) {
    if (!text.trim() || sending) return
    setInput('')
    const ok = await send(text)
    if (!ok) setInput(text) // ส่งไม่สำเร็จ: คืนข้อความให้แก้หรือส่งใหม่
    inputRef.current?.focus()
  }

  function onKeyDown(e) {
    // Enter = ส่ง, Shift+Enter = ขึ้นบรรทัดใหม่ (ไม่ส่งตอนกำลังพิมพ์ภาษาไทยด้วย IME)
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit(input)
    }
  }

  const time = (iso) => {
    const d = iso ? new Date(iso) : null
    return d && !Number.isNaN(d.getTime())
      ? d.toLocaleTimeString(lang === 'th' ? 'th-TH' : 'en-GB', { hour: '2-digit', minute: '2-digit' })
      : ''
  }
  const memberQuestions = (members ?? []).map((m) =>
    t('cs_member_q', (localized(m, lang, 'nickname') ?? m.name).split(' ')[0])
  )

  return (
    <main className="page chat-page">
      <aside className="chat-side" aria-label={t('cs_suggest_label')}>
        <div className="keeper-card">
          <div className="keeper-avatar" aria-hidden="true">
            <PixelAvatar dndClass="Wizard" variant={4} label="Guild Keeper" />
          </div>
          <h1>{t('cs_title')}</h1>
          <p>{t('cs_sub')}</p>
        </div>

        <div className="chat-suggest-group">
          <h2>{t('cs_group')}</h2>
          {[...t('chat_suggestions'), t('cs_contact_q')].map((q) => (
            <button key={q} type="button" onClick={() => submit(q)} disabled={sending}>
              {q}
            </button>
          ))}
        </div>

        {memberQuestions.length > 0 && (
          <div className="chat-suggest-group">
            <h2>{t('cs_members')}</h2>
            {memberQuestions.map((q) => (
              <button key={q} type="button" onClick={() => submit(q)} disabled={sending}>
                {q}
              </button>
            ))}
          </div>
        )}

        <button type="button" className="chat-new" onClick={newChat} disabled={sending || messages.length === 0}>
          ↻ {t('chat_new')}
        </button>
        <p className="chat-saved">{t('cs_saved')}</p>
      </aside>

      <section className="chat-window" aria-label={t('cs_title')}>
        <header className="chat-window-head">
          <span className="keeper-mini" aria-hidden="true">
            <PixelAvatar dndClass="Wizard" variant={4} label="" />
          </span>
          <div>
            <strong>Guild Keeper</strong>
            <span className={`chat-status ${sending ? 'busy' : ''}`}>
              {sending ? t('chat_typing') : t('cs_status_ready')}
            </span>
          </div>
        </header>

        <div className="chat-log" ref={logRef} aria-live="polite">
          {loadingHistory && messages.length === 0 && <p className="chat-note">{t('cs_loading')}</p>}

          {!loadingHistory && messages.length === 0 && (
            <div className="chat-welcome">
              <p className="chat-welcome-title">{t('cs_empty_title')}</p>
              <p>{t('chat_intro')}</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.role === 'assistant' && (
                <span className="msg-avatar" aria-hidden="true">
                  <PixelAvatar dndClass="Wizard" variant={4} label="" />
                </span>
              )}
              <div className="msg-body">
                <span className="msg-meta">
                  {m.role === 'assistant' ? 'Guild Keeper' : t('cs_you')}
                  {time(m.at) && <time dateTime={m.at}> · {time(m.at)}</time>}
                </span>
                <div className="msg-bubble">
                  <MessageText text={m.content} />
                </div>
              </div>
            </div>
          ))}

          {sending && (
            <div className="msg assistant">
              <span className="msg-avatar" aria-hidden="true">
                <PixelAvatar dndClass="Wizard" variant={4} label="" />
              </span>
              <div className="msg-body">
                <span className="msg-meta">Guild Keeper</span>
                <div className="msg-bubble typing" role="status" aria-label={t('chat_typing')}>
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="chat-alert" role="alert">
              <span>{error.text}</span>
              <button type="button" onClick={retry}>
                {t('bq_retry')}
              </button>
            </div>
          )}
        </div>

        <form
          className="chat-compose"
          onSubmit={(e) => {
            e.preventDefault()
            submit(input)
          }}
        >
          <textarea
            ref={inputRef}
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t('chat_placeholder')}
            aria-label={t('chat_placeholder')}
            maxLength={MAX_LENGTH}
            rows={1}
            disabled={sending}
          />
          <button type="submit" className="btn-gold" disabled={sending || !input.trim()}>
            {t('chat_send')}
          </button>
          <span className="chat-compose-hint">
            {t('cs_hint')} · {input.length}/{MAX_LENGTH}
          </span>
        </form>
      </section>
    </main>
  )
}
