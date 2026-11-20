import { useCallback, useEffect, useRef, useState } from 'react'
import './GuildDoors.css'
import { go } from './useRoute.js'
import { useLang } from './i18n.js'

// แอนิเมชันเปิดประตูกิลด์ตอนกด "เข้าสู่ห้องโถง"
// ลำดับ: จอมืด -> เดินเข้าหาประตู -> ประตูปิด แสงลอดช่อง (พื้นหลังเปลี่ยนเป็นห้องโถงข้างหลัง) -> ประตูไม้หนาหมุนเปิดเข้าด้านใน
//        กล้องเดินเข้าไป -> แสงขาวจ้าเต็มจอ (เหมือนก้าวออกไปเจอแสงแดด) -> แสงจางเผยลานต้อนรับ -> สักพัก Guild Keeper กับเมนูค่อยโผล่
// เล่นครั้งแรกครั้งเดียวต่อการเปิดเว็บ (sessionStorage) ข้ามได้ด้วยปุ่ม "ข้าม" หรือ Esc
// เครื่องที่ตั้งค่าลดการเคลื่อนไหว: เข้าห้องโถงทันที ไม่มีแอนิเมชัน

const PLAYED_KEY = 'guild-doors-played'
const EVENT = 'guild:enter'
// เวลาของแต่ละช่วง (มิลลิวินาที) ต้องตรงกับ GuildDoors.css
const BLACK_MS = 1000 // จอค่อยๆ มืด (0.6 วิ) แล้วมืดสนิทค้างไว้ ก่อนเห็นประตู
const APPROACH_MS = 2200 // ประตูค่อยๆ โผล่จากความมืดอย่างช้าๆ กล้องเคลื่อนเข้าหา
const HOLD_MS = 900 // ประตูปิด แสงค่อยๆ ลอดรอยต่อ
const OPEN_MS = 3000 // ประตูปลดกลอน แล้วค่อยๆ หมุนเปิด + กล้องเดินเข้า + แสงขาวท่วมจอช่วงท้าย
const WHITE_MS = 300 // ขาวจ้าเต็มจอ
const CLEAR_MS = 1600 // แสงขาวจางลงช้าๆ เผยห้องโถง
const REVEAL_DELAY_MS = 800 // ยืนมองห้องโถงสักพัก ก่อนข้อมูลโผล่

const alreadyPlayed = () => {
  try {
    return sessionStorage.getItem(PLAYED_KEY) === '1'
  } catch {
    return false
  }
}
const markPlayed = () => {
  try {
    sessionStorage.setItem(PLAYED_KEY, '1')
  } catch {
    /* ใช้ sessionStorage ไม่ได้: อย่างมากก็เล่นซ้ำ */
  }
}

// ---------- "เดินเข้ากิลด์": เห็นพื้นหลังห้องโถงก่อน แล้วแถบแท็บกับข้อมูลค่อยโผล่ตามมา ----------
// ใช้ class บน <html>: guild-entering = ซ่อนแถบแท็บและเนื้อหา, guild-arriving = ค่อยๆ แสดง (ดู GuildDoors.css)
const ARRIVE_MS = 1300 // ความยาวแอนิเมชันตอนข้อมูลโผล่ (ต้องยาวกว่าใน CSS)
let arriveTimer = 0
function hideContent() {
  clearTimeout(arriveTimer)
  document.documentElement.classList.remove('guild-arriving')
  document.documentElement.classList.add('guild-entering')
}
function revealContent() {
  const root = document.documentElement
  root.classList.remove('guild-entering')
  root.classList.add('guild-arriving')
  clearTimeout(arriveTimer)
  arriveTimer = setTimeout(() => root.classList.remove('guild-arriving'), ARRIVE_MS)
}

// เรียกจากปุ่ม "เข้าสู่ห้องโถง": เล่นประตูถ้ายังไม่เคยเล่น ไม่งั้นแค่ให้ภาพห้องโถงขึ้นก่อนแล้วข้อมูลตาม
export function enterGuild() {
  const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (calm) {
    go('/lobby')
    return
  }
  if (alreadyPlayed()) {
    hideContent()
    go('/lobby')
    setTimeout(revealContent, 900) // รอพื้นหลังเปลี่ยนจากข้างนอกเป็นห้องโถงก่อน
    return
  }
  window.dispatchEvent(new Event(EVENT))
}

// บานประตูหนึ่งบาน: หน้าไม้ (ลายไม้ แผงนูน แถบเหล็ก บานพับ ห่วงจับ ครึ่งตรากิลด์) + สันประตู (ความหนา)
function Door({ side }) {
  return (
    <div className={`gd-door ${side}`}>
      <div className="gd-face">
        <span className="gd-panel upper" />
        <span className="gd-panel lower" />
        <span className="gd-hinge top" />
        <span className="gd-hinge bottom" />
        <span className="gd-band" />
        <span className="gd-ring" />
        <span className="gd-seal" />
        <span className="gd-rim" />
      </div>
      <div className="gd-edge" />
    </div>
  )
}

// วางไว้ระดับ App (อยู่เหนือทุกหน้า) เพื่อให้แอนิเมชันเล่นต่อได้ตอนเปลี่ยนหน้าไปห้องโถง
export default function GuildDoors() {
  const { t } = useLang()
  // null | 'black' | 'approach' | 'closed' | 'opening' | 'white' | 'clearing'
  const [phase, setPhase] = useState(null)
  const timers = useRef([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const finish = useCallback(() => {
    clearTimers()
    if (!window.location.hash.startsWith('#/lobby')) go('/lobby')
    setPhase(null)
    revealContent()
  }, [])

  // เริ่มเล่นเมื่อได้รับสัญญาณจากปุ่ม
  useEffect(() => {
    const start = () => {
      markPlayed()
      clearTimers()
      hideContent() // ข้อมูลยังไม่ขึ้น จนกว่าจะเข้ามาในห้องโถงแล้วสักพัก
      setPhase('black')
      let t0 = 0
      const at = (ms, fn) => timers.current.push(setTimeout(fn, ms))
      at((t0 += BLACK_MS), () => setPhase('approach'))
      at((t0 += APPROACH_MS), () => setPhase('closed'))
      at(t0 + 150, () => go('/lobby')) // พื้นหลังเปลี่ยนเป็นในกิลด์ (ลานต้อนรับ) ข้างหลังประตูที่ปิดอยู่
      at((t0 += HOLD_MS), () => setPhase('opening'))
      at((t0 += OPEN_MS), () => setPhase('white'))
      at((t0 += WHITE_MS), () => setPhase('clearing'))
      at((t0 += CLEAR_MS), () => setPhase(null))
      at(t0 + REVEAL_DELAY_MS, revealContent)
    }
    window.addEventListener(EVENT, start)
    return () => {
      window.removeEventListener(EVENT, start)
      clearTimers()
    }
  }, [])

  // Esc = ข้าม
  useEffect(() => {
    if (!phase) return
    const onKey = (e) => e.key === 'Escape' && finish()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, finish])

  if (!phase) return null
  const showDoors = phase === 'approach' || phase === 'closed' || phase === 'opening'

  return (
    <div className={`guild-doors ${phase}`} role="dialog" aria-label={t('door_label')}>
      {showDoors && (
        <>
          <div className="gd-light" aria-hidden="true" />
          <div className="gd-camera" aria-hidden="true">
            <div className="gd-stage">
              <Door side="left" />
              <Door side="right" />
              <span className="gd-seam" />
              <span className="gd-floor" />
            </div>
          </div>
          <div className="gd-vignette" aria-hidden="true" />
          <div className="gd-fade" aria-hidden="true" />
        </>
      )}
      <div className="gd-flash" aria-hidden="true" />
      {/* แถบดำบนล่างแบบเฟรมหนัง */}
      <span className="gd-bar top" aria-hidden="true" />
      <span className="gd-bar bottom" aria-hidden="true" />
      <button type="button" className="door-skip" onClick={finish}>
        {t('door_skip')} ›
      </button>
    </div>
  )
}
