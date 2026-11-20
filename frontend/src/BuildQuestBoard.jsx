import { useEffect, useRef, useState } from 'react'
import { STAT_ORDER } from './shared.jsx'
import { useLang } from './i18n.js'
import { STAT_MAX, STAT_MIN, signed } from './rules.js'

const GOALS = ['tank', 'damage', 'support', 'hybrid'] // ต้องตรงกับ BUILD_GOALS ใน backend/src/ai.js
const MAX_LENGTH = 1000 // ต้องตรงกับ MAX_MESSAGE_LENGTH ใน backend
const MAX_HISTORY = 12 // ต้องตรงกับ MAX_BUILD_HISTORY ใน backend

// บอร์ดเควสต์: เลือกเป้าหมาย build แล้วคุยกับ Guild Keeper (AI) ที่เห็นค่าสถานะปัจจุบันในตาราง
// แต่ละเป้าหมายมีบทสนทนาแยกกัน; AI อาจเสนอการย้ายแต้ม ซึ่งกด "ใช้คำแนะนำนี้" เพื่อปรับตารางได้
export default function BuildQuestBoard({ member, base, current, setCurrent, freePoints }) {
  const { t, lang } = useLang()
  const [goal, setGoal] = useState(null)
  const [tab, setTab] = useState('advice')
  const [threads, setThreads] = useState({}) // { tank: [{ role, content, allocation? }], ... }
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [elapsed, setElapsed] = useState(0) // วินาทีที่รอ AI อยู่ (โชว์ให้รู้ว่ายังทำงาน)
  const [error, setError] = useState(null) // { text, retry: { message, goal } }
  const [applied, setApplied] = useState(null) // { goal, index, allocation } คำแนะนำที่ใช้อยู่
  const logRef = useRef(null)

  const messages = goal ? (threads[goal] ?? []) : []
  const goalName = (g) => t('bq_goals')[g].title

  // เลื่อนแชตลงล่างสุดเมื่อมีข้อความใหม่ (เลื่อนเฉพาะกล่องแชต ไม่ดึงทั้งหน้า)
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length, sending, error])

  // นับวินาทีระหว่างรอคำตอบ
  useEffect(() => {
    if (!sending) return
    const started = Date.now()
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000)
    return () => {
      clearInterval(id)
      setElapsed(0)
    }
  }, [sending])

  function errorText(status, serverMessage) {
    if (lang === 'th') return serverMessage || t('chat_err_generic')
    const key = `chat_err_${status}`
    return t(key) === key ? t('chat_err_generic') : t(key)
  }

  async function send(text, forGoal = goal) {
    const message = text.trim()
    if (!message || sending || !forGoal) return
    const history = [...(threads[forGoal] ?? []), { role: 'user', content: message }]
    setThreads((prev) => ({ ...prev, [forGoal]: history }))
    setInput('')
    setError(null)
    setSending(true)
    try {
      const res = await fetch('/api/build-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: member.id,
          goal: forGoal,
          stats: current,
          lang,
          messages: history.slice(-MAX_HISTORY).map(({ role, content }) => ({ role, content })),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(errorText(res.status, data.error))
      setThreads((prev) => ({
        ...prev,
        [forGoal]: [...(prev[forGoal] ?? []), { role: 'assistant', content: data.reply, allocation: data.allocation ?? null }],
      }))
    } catch (err) {
      // เอาคำถามที่ไม่ได้คำตอบออกจากแชต (ไม่ให้มีคำถามค้างซ้อนกัน) แล้วให้กดลองใหม่ได้
      setThreads((prev) => ({ ...prev, [forGoal]: (prev[forGoal] ?? []).slice(0, -1) }))
      setError({
        text: err instanceof TypeError ? t('chat_err_generic') : err.message,
        retry: { message, goal: forGoal },
      })
    } finally {
      setSending(false)
    }
  }

  function chooseGoal(g) {
    setGoal(g)
    setTab('advice')
    setError(null)
    // รับเควสต์ครั้งแรก: ถามแผน build ให้อัตโนมัติ
    if (!threads[g]?.length) send(t('bq_accept', goalName(g)), g)
  }

  // คำแนะนำใช้ได้ไหมกับค่าปัจจุบัน (ผู้ใช้อาจย้ายแต้มไปแล้วหลัง AI ตอบ)
  function canApply(allocation) {
    let spent = 0
    for (const k of STAT_ORDER) {
      const after = current[k] + (allocation[k] ?? 0)
      if (after < STAT_MIN || after > STAT_MAX) return false
      spent += after - base[k]
    }
    return spent <= freePoints
  }

  // ปรับตารางตามคำแนะนำ (sign = 1 ใช้, -1 ย้อนกลับ) ค่าที่ได้ไม่หลุดช่วงที่อนุญาต
  const shift = (allocation, sign) =>
    setCurrent((cur) =>
      Object.fromEntries(
        STAT_ORDER.map((k) => [k, Math.min(STAT_MAX, Math.max(STAT_MIN, cur[k] + sign * (allocation[k] ?? 0)))])
      )
    )

  function apply(allocation, index) {
    if (applied) shift(applied.allocation, -1) // ใช้ได้ทีละคำแนะนำ: ถอนอันเก่าก่อน
    shift(allocation, 1)
    setApplied({ goal, index, allocation })
  }

  function undo() {
    shift(applied.allocation, -1)
    setApplied(null)
  }

  const journal = GOALS.filter((g) => threads[g]?.length)

  return (
    <section className="quest-board" aria-labelledby="quest-board-title">
      <h2 className="planner-band" id="quest-board-title">
        {t('bq_title')}
        <small>Guild Keeper (AI)</small>
      </h2>

      <div className="quest-body">
        <div className="quest-goals" role="group" aria-label={t('bq_choose')}>
          {GOALS.map((g) => (
            <button
              key={g}
              type="button"
              className="quest-goal"
              aria-pressed={goal === g}
              onClick={() => chooseGoal(g)}
              disabled={sending && goal !== g}
            >
              <span className="quest-seal">{t('bq_seal')}</span>
              <strong>{goalName(g)}</strong>
              <span>{t('bq_goals')[g].desc}</span>
            </button>
          ))}
        </div>

        <div className="quest-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'advice'} onClick={() => setTab('advice')}>
            {t('bq_tab_advice')}
          </button>
          <button type="button" role="tab" aria-selected={tab === 'journal'} onClick={() => setTab('journal')}>
            {t('bq_tab_journal', journal.length)}
          </button>
        </div>

        {tab === 'journal' ? (
          journal.length ? (
            <ul className="quest-journal">
              {journal.map((g) => (
                <li key={g}>
                  <div>
                    <strong>{goalName(g)}</strong>
                    <small>{t('bq_journal_count', threads[g].length)}</small>
                  </div>
                  <button type="button" className="planner-reset" onClick={() => chooseGoal(g)}>
                    {t('bq_open')}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="planner-hint">{t('bq_journal_empty')}</p>
          )
        ) : (
          <>
            <div className="quest-log" ref={logRef} aria-live="polite">
              {!goal && (
                <div className="bubble-ai">
                  <span className="bubble-from">Guild Keeper</span>
                  {t('bq_intro', member.name)}
                </div>
              )}
              {messages.map((m, i) =>
                m.role === 'user' ? (
                  <div className="bubble-user" key={i}>
                    {m.content}
                  </div>
                ) : (
                  <div className="bubble-ai" key={i}>
                    <span className="bubble-from">Guild Keeper · {goalName(goal)}</span>
                    {m.content}
                    {m.allocation && (
                      <Suggestion
                        allocation={m.allocation}
                        isApplied={applied?.goal === goal && applied?.index === i}
                        usable={canApply(m.allocation)}
                        onApply={() => apply(m.allocation, i)}
                        onUndo={undo}
                      />
                    )}
                  </div>
                )
              )}
              {sending && (
                <div className="bubble-ai typing" role="status">
                  {t('chat_typing')} {elapsed > 0 && <span className="quest-elapsed">{t('bq_elapsed', elapsed)}</span>}
                </div>
              )}
              {error && error.retry.goal === goal && (
                <div className="quest-error" role="alert">
                  <span>{error.text}</span>
                  <button type="button" className="planner-reset" onClick={() => send(error.retry.message, error.retry.goal)}>
                    {t('bq_retry')}
                  </button>
                </div>
              )}
            </div>

            {goal && (
              <form
                className="quest-input"
                onSubmit={(e) => {
                  e.preventDefault()
                  send(input)
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('bq_placeholder', goalName(goal))}
                  aria-label={t('bq_placeholder', goalName(goal))}
                  maxLength={MAX_LENGTH}
                  disabled={sending}
                />
                <button type="submit" className="btn-gold" disabled={sending || !input.trim()}>
                  {t('chat_send')}
                </button>
              </form>
            )}
            <p className="quest-context">
              {t('bq_context')} <b>{STAT_ORDER.map((k) => `${k} ${current[k]}`).join(' · ')}</b>
            </p>
          </>
        )}
      </div>
    </section>
  )
}

function Suggestion({ allocation, isApplied, usable, onApply, onUndo }) {
  const { t } = useLang()
  const text = STAT_ORDER.filter((k) => allocation[k]).map((k) => `${k} ${signed(allocation[k])}`).join(' · ')
  return (
    <div className="quest-suggest">
      <span className="quest-alloc">{text}</span>
      {isApplied ? (
        <>
          <span className="quest-applied">{t('bq_applied')}</span>
          <button type="button" className="planner-reset" onClick={onUndo}>
            {t('bq_undo')}
          </button>
        </>
      ) : usable ? (
        <button type="button" className="planner-copy" onClick={onApply}>
          {t('bq_apply')}
        </button>
      ) : (
        <span className="quest-stale">{t('bq_stale')}</span>
      )}
    </div>
  )
}
