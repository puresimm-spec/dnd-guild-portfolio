import { useState } from 'react'
import { Avatar, GithubButton, STAT_ORDER } from './shared.jsx'
import { localized, useLang } from './i18n.js'
import { STAT_MAX, STAT_MIN, abilityMod, deriveStats, scoreOf, signed } from './rules.js'
import BuildQuestBoard from './BuildQuestBoard.jsx'

// แต้มอิสระที่ผู้เยี่ยมชมย้ายไปมาเล่นได้ (ไม่ได้บันทึก ค่าจริงของตัวละครไม่เปลี่ยน)
// ต้องตรงกับ FREE_POINTS ใน backend/src/index.js (AI ใช้คำนวณแต้มที่เหลือ)
const FREE_POINTS = 4

// หน้ารายละเอียดของผู้เล่นหนึ่งคน (index เริ่มจาก 1 ตามลำดับในหน้าปาร์ตี้)
export default function MemberScreen({ members, index }) {
  const { t } = useLang()
  const member = Number.isInteger(index) ? members[index - 1] : undefined

  if (!member) {
    return (
      <main className="page center">
        <div className="notice">
          <h2>{t('nf_title')}</h2>
          <p>{t('nf_body')}</p>
          <a className="btn-gold" href="#/party">
            {t('back_hall_btn')}
          </a>
        </div>
      </main>
    )
  }

  const prev = index > 1 ? index - 1 : null
  const next = index < members.length ? index + 1 : null

  return (
    <main className="page">
      <nav className="topbar">
        <a href="#/party">{t('back_hall')}</a>
        <span className="pager">
          {prev ? <a href={`#/member/${prev}`}>{t('prev')}</a> : <span className="disabled">{t('prev')}</span>}
          <em>
            {index} / {members.length}
          </em>
          {next ? <a href={`#/member/${next}`}>{t('next')}</a> : <span className="disabled">{t('next')}</span>}
        </span>
      </nav>

      {/* key = เปลี่ยนคนแล้วแต้มที่ย้ายไว้รีเซ็ตเอง */}
      <Planner key={index} member={member} variant={index - 1} />
    </main>
  )
}

function Planner({ member, variant }) {
  const { t, lang } = useLang()
  const role = localized(member, lang, 'role')
  const bio = localized(member, lang, 'bio')
  const quote = localized(member, lang, 'quote')
  const base = Object.fromEntries(STAT_ORDER.map((k) => [k, scoreOf(member.stats, k)]))
  const [current, setCurrent] = useState(base)

  const spent = STAT_ORDER.reduce((sum, k) => sum + (current[k] - base[k]), 0)
  const left = FREE_POINTS - spent
  const changed = STAT_ORDER.some((k) => current[k] !== base[k])
  const before = deriveStats(member.dnd_class, member.level, base)
  const after = deriveStats(member.dnd_class, member.level, current)

  const adjust = (key, delta) =>
    setCurrent((cur) => ({ ...cur, [key]: Math.min(STAT_MAX, Math.max(STAT_MIN, cur[key] + delta)) }))

  return (
    <article className="planner">
      <div className="planner-panels">
        {/* ---------- แผงซ้าย: อาชีพ + ค่าสถานะ (ปรับได้) ---------- */}
        <section className="planner-panel" aria-labelledby="planner-stats">
          <div className="planner-class">
            <Avatar member={member} size="md" variant={variant} />
            <div>
              <span className="planner-field-label">{t('pl_class')}</span>
              <span className="planner-select">{member.dnd_class}</span>
            </div>
            <div>
              <span className="planner-field-label">{t('pl_level')}</span>
              <span className="planner-val cur">{after.level}</span>
            </div>
          </div>

          <div className="planner-pool">
            <h2 id="planner-stats">{t('stats_title')}</h2>
            <span>
              {t('pl_points_left')} <b>{left}</b> / {FREE_POINTS}
            </span>
          </div>

          <table className="planner-table">
            <thead>
              <tr>
                <th scope="col">{t('pl_col_stat')}</th>
                <th scope="col">{t('pl_col_base')}</th>
                <th scope="col">{t('pl_col_current')}</th>
                <th scope="col">Mod</th>
                <th scope="col">Save</th>
                <th scope="col">
                  <span className="sr-only">{t('pl_col_adjust')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {STAT_ORDER.map((k) => {
                const diff = current[k] - base[k]
                const mod = abilityMod(current[k])
                const proficient = after.saves.includes(k)
                return (
                  <tr key={k}>
                    <th scope="row" title={t('statNames')[k]}>
                      {k}
                      <small>{t('statNames')[k]}</small>
                    </th>
                    <td>
                      <span className="planner-val base">{base[k]}</span>
                    </td>
                    <td>
                      <span className={`planner-val cur ${diff > 0 ? 'up' : diff < 0 ? 'down' : ''}`}>{current[k]}</span>
                    </td>
                    <td className="num">{signed(mod)}</td>
                    <td className={`num ${proficient ? 'save-prof' : ''}`} title={proficient ? t('pl_save_prof') : undefined}>
                      {signed(mod + (proficient ? after.prof : 0))}
                    </td>
                    <td>
                      <span className="planner-arrows">
                        <button
                          type="button"
                          className="down"
                          onClick={() => adjust(k, -1)}
                          disabled={current[k] <= STAT_MIN}
                          aria-label={t('pl_down', k)}
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          className="up"
                          onClick={() => adjust(k, 1)}
                          disabled={left <= 0 || current[k] >= STAT_MAX}
                          aria-label={t('pl_up', k)}
                        >
                          ▲
                        </button>
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="planner-row">
            <span>Proficiency Bonus</span>
            <span className="planner-val">{signed(after.prof)}</span>
          </div>
          <div className="planner-actions">
            <button type="button" className="planner-reset" onClick={() => setCurrent(base)} disabled={!changed}>
              {t('pl_reset')}
            </button>
          </div>
          <p className="planner-hint">{t('pl_hint')}</p>
        </section>

        {/* ---------- แผงกลาง: ค่าที่คำนวณได้ ---------- */}
        <section className="planner-panel" aria-label={t('pl_derived')}>
          <Derived label="HP" a={before.hp} b={after.hp} />
          <Derived label="Hit Dice" a={`${before.level}d${before.hitDie}`} b={`${after.level}d${after.hitDie}`} />
          <Derived label={t('pl_ac')} a={before.ac} b={after.ac} />
          <Derived label="Initiative" a={before.initiative} b={after.initiative} format={signed} />
          <Derived label={t('pl_speed')} a={`${before.speed} ft`} b={`${after.speed} ft`} />
          <hr />
          <Derived label="Passive Perception" a={before.passive} b={after.passive} />
          <Derived label={t('pl_carry')} a={`${before.carry} lb`} b={`${after.carry} lb`} />
          <hr />
          <Derived label="Spell Save DC" a={before.spellDc ?? '—'} b={after.spellDc ?? '—'} />
          <Derived
            label="Spell Attack"
            a={before.spellAttack ?? '—'}
            b={after.spellAttack ?? '—'}
            format={(v) => (typeof v === 'number' ? signed(v) : v)}
            sub
          />
          <Derived label={t('pl_cast')} a={before.cast ?? t('pl_no_cast')} b={after.cast ?? t('pl_no_cast')} sub />
          <p className="planner-note">{t('pl_rules_note')}</p>
        </section>

        {/* ---------- แผงขวา: ตัวตน + ทักษะ (ช่องอุปกรณ์) ---------- */}
        <section className="planner-panel" aria-label={t('about')}>
          <h1 className="planner-name">{member.name}</h1>
          {role && <p className="planner-role">{role}</p>}
          {bio && <p className="bio planner-bio">{bio}</p>}

          {member.skills?.length > 0 && (
            <>
              <h3 className="planner-sub">{t('skills')}</h3>
              {member.skills.map((s, n) => (
                <div className="planner-slot" key={s}>
                  <span>{t('pl_slot', n + 1)}</span>
                  <span className="planner-select">{s}</span>
                </div>
              ))}
            </>
          )}

          {quote && (
            <div className="planner-effects">
              <strong>{t('pl_quote')}</strong>“{quote}”
            </div>
          )}
        </section>
      </div>

      {/* ---------- แถบล่าง: บอร์ดเควสต์ (AI แนะนำ build) + ลิงก์แชร์ ---------- */}
      <BuildQuestBoard
        member={member}
        base={base}
        current={current}
        setCurrent={setCurrent}
        freePoints={FREE_POINTS}
      />

      <ShareBar member={member} />
    </article>
  )
}

// แถวค่าที่คำนวณได้: ถ้าเปลี่ยนจากค่าเดิม แสดงสีเขียว/แดง พร้อมค่าเดิมตัวเล็ก
function Derived({ label, a, b, format = (v) => v, sub = false }) {
  const { t } = useLang()
  const diff = typeof a === 'number' && typeof b === 'number' ? b - a : 0
  const cls = diff > 0 ? 'up' : diff < 0 ? 'down' : ''
  return (
    <div className={`planner-row ${sub ? 'sub' : ''}`}>
      <span>{label}</span>
      <span className="planner-derived">
        {a !== b && <small>{t('pl_was', format(a))}</small>}
        <span className={`planner-val ${cls}`}>{format(b)}</span>
      </span>
    </div>
  )
}

function ShareBar({ member }) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const copy = async (e) => {
    const input = e.currentTarget.parentElement.querySelector('input')
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      input?.select() // คัดลอกไม่ได้: เลือกข้อความไว้ให้กด Ctrl+C เอง
    }
  }

  return (
    <div className="planner-share">
      <label htmlFor="planner-link">{t('pl_share')}</label>
      <input id="planner-link" readOnly value={url} onFocus={(e) => e.target.select()} />
      <button type="button" className="planner-copy" onClick={copy}>
        {copied ? t('pl_copied') : t('pl_copy')}
      </button>
      <GithubButton href={member.github_url}>{t('github_of', member.nickname || member.name)}</GithubButton>
    </div>
  )
}
