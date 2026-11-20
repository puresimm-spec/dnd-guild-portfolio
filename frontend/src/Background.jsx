import { useEffect, useRef, useState } from 'react'
import './Background.css'
import { LANTERNS, LIVE_ASSETS, QUILL, SPECKS } from './bgScene.js'

// พื้นหลังห้องโถงกิลด์ที่มีชีวิต (frontend/public/bg.jpg + public/bg/) เป็นชั้นๆ จากหลังไปหน้า:
//   รูปเบลอเติมขอบ (จอกว้างมาก) > ฉาก 1920x1078 (ซูม/แพนช้าๆ + เลื่อนตามเมาส์):
//     รูป > แสงจากหน้าต่าง > โคมแขวนแกว่ง + ไฟวูบวาบ > โคมบนเคาน์เตอร์ > ขนนกโยก > ฝุ่น/หิ่งห้อย
//   > ฟิลเตอร์มืด > แสงคบเพลิงสองข้าง > หมอก > ประกายไฟลอยขึ้น > ขอบจอมืด
// ฉากใช้หน่วย "พิกเซลบนรูป" (--u = 1 พิกเซลของรูปเมื่อขยายเต็มจอ) ทุกชิ้นจึงอยู่ตรงตำแหน่งในรูปพอดีทุกขนาดจอ
//
// กันเครื่องสเปกต่ำกระตุก:
//   - ทุกอย่างขยับด้วย transform/opacity (การ์ดจอทำให้) ไม่มีอะไรที่ต้องวาดใหม่ทุกเฟรม
//   - โหมดเบา (bg-lite): โคมไม่แกว่ง ไม่มีฝุ่น/หมอก/ประกายไฟ เหลือรูปซูมช้าๆ กับแสงนิ่งๆ
//     เปิดเองเมื่อวัดได้ว่าเฟรมเรตต่ำ (ต่ำกว่าราว 25 fps) หรือเครื่องมี CPU น้อยมาก
//     บังคับได้ด้วยลิงก์: ?bg=lite (โหมดเบา) หรือ ?bg=full (เต็ม ไม่วัด) เช่น https://.../?bg=lite#/lobby
//   - ตั้งค่าลดการเคลื่อนไหวในระบบ: พื้นหลังนิ่ง

const LITE_KEY = 'bg-lite'

function initialLite() {
  const forced = new URLSearchParams(window.location.search).get('bg')
  if (forced === 'lite') return true
  if (forced === 'full') return false
  try {
    if (sessionStorage.getItem(LITE_KEY) === '1') return true // เคยวัดแล้วว่าช้า
  } catch {
    /* ใช้ sessionStorage ไม่ได้: วัดใหม่ */
  }
  return (navigator.hardwareConcurrency || 4) <= 2
}

// วัดเฟรมเรตช่วงสั้นๆ ตอนหน้าเว็บเปิดอยู่: ถ้าเฉลี่ยช้ากว่า ~40ms/เฟรม (ต่ำกว่า ~25 fps) ถือว่าเครื่องไม่ไหว
function measureSlow(onSlow) {
  let frames = 0
  let total = 0
  let last = 0
  let id = 0
  const tick = (now) => {
    if (last) {
      const dt = now - last
      if (dt < 250) {
        // ข้ามช่วงที่สลับแท็บ/เครื่องค้างชั่วคราว
        total += dt
        frames += 1
      }
    }
    last = now
    if (frames < 90) {
      id = requestAnimationFrame(tick)
    } else if (total / frames > 40) {
      onSlow()
    }
  }
  id = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(id)
}

const px = (n) => `calc(var(--u) * ${n})`

// outside = true ที่หน้าแรก (ข้างนอกกิลด์): ซ่อนห้องโถง แสดงท้องฟ้ายามค่ำแทน (ค่อยๆ จางสลับกัน)
export default function Background({ outside = false }) {
  const stageRef = useRef(null)
  const [calm] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const forcedFull = useState(() => new URLSearchParams(window.location.search).get('bg') === 'full')[0]
  const [lite, setLite] = useState(initialLite)
  const [live, setLive] = useState(false) // โหลดรูปที่ตัดแยกครบแล้ว: เปลี่ยนจากรูปเดิมเป็นฉากที่โคมแกว่งได้

  // โหลดชิ้นส่วนฉากล่วงหน้า ครบแล้วค่อยสลับ (ถ้าโหลดไม่ได้ก็ใช้รูปเดิมต่อไป)
  useEffect(() => {
    if (calm || lite) return
    let cancelled = false
    Promise.all(
      LIVE_ASSETS.map((src) => {
        const img = new Image()
        img.src = src
        return img.decode()
      })
    )
      .then(() => !cancelled && setLive(true))
      .catch(() => {
        /* ใช้รูปเดิมแบบไม่มีโคมแกว่ง */
      })
    return () => {
      cancelled = true
    }
  }, [calm, lite])

  // พอฉากขยับเริ่มแล้ว วัดว่าเครื่องไหวไหม ไม่ไหวก็เปลี่ยนเป็นโหมดเบา (จำไว้ทั้ง session)
  useEffect(() => {
    if (!live || lite || forcedFull) return
    const stop = measureSlow(() => {
      try {
        sessionStorage.setItem(LITE_KEY, '1')
      } catch {
        /* ไม่เป็นไร */
      }
      setLite(true)
    })
    return stop
  }, [live, lite, forcedFull])

  // parallax ตามเมาส์: ฉากค่อยๆ ไหลตามเมาส์ (สูงสุด 10px แนวนอน 7px แนวตั้ง)
  // ไล่ตำแหน่งเองทุกเฟรมด้วย JS แล้วเขียน translate ตรงที่ฉากชิ้นเดียว
  // (ไม่ใช้ CSS transition: ขยับเมาส์เร็วๆ แล้ว transition เริ่มใหม่ทุกเฟรม ทำให้รูปกระตุก)
  // ปิดบนจอสัมผัส / ตั้งค่าลดการเคลื่อนไหว / โหมดเบา
  useEffect(() => {
    const el = stageRef.current
    if (!el || calm || lite || window.matchMedia('(pointer: coarse)').matches) return
    let targetX = 0
    let targetY = 0
    let x = 0
    let y = 0
    let last = 0
    let frame = 0
    const step = (now) => {
      // ไล่เข้าหาเป้าแบบนุ่มๆ ความเร็วเท่ากันไม่ว่าจอจะกี่ Hz
      const k = 1 - Math.pow(0.92, Math.min(now - (last || now - 16), 100) / 16.7)
      last = now
      x += (targetX - x) * k
      y += (targetY - y) * k
      el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`
      const moving = Math.abs(targetX - x) > 0.03 || Math.abs(targetY - y) > 0.03
      frame = moving ? requestAnimationFrame(step) : 0
      if (!moving) last = 0
    }
    const onMove = (e) => {
      targetX = -((e.clientX / window.innerWidth) * 2 - 1) * 10
      targetY = -((e.clientY / window.innerHeight) * 2 - 1) * 7
      if (!frame) frame = requestAnimationFrame(step)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      el.style.translate = ''
    }
  }, [calm, lite])

  const cls = ['bg', outside && 'outside', live && !lite && 'live', lite && 'lite'].filter(Boolean).join(' ')

  return (
    <div className={cls} aria-hidden="true">
      <div className="bg-fill" />

      <div className="bg-stage" ref={stageRef}>
        <div className="bg-cam">
          <img className="bg-base orig" src="/bg.jpg" alt="" />
          {live && <img className="bg-base clean" src="/bg/clean.jpg" alt="" />}
          <img className="bg-shafts" src="/bg/shafts.png" alt="" />
          <span className="bg-arch" />
          {LANTERNS.map((l) => (
            <span
              key={l.id}
              className="bg-lantern"
              style={{
                left: px(l.x),
                top: px(l.y),
                width: px(l.w),
                height: px(l.h),
                transformOrigin: `${px(l.ox)} ${px(l.oy)}`,
                '--amp': `${l.amp}deg`,
                animationDuration: `${l.dur}s`,
                animationDelay: `${l.delay}s`,
              }}
            >
              {live && <img src={`/bg/sprite-${l.id}.png`} alt="" />}
              <span className="bg-glow" style={{ left: px(l.gx), top: px(l.gy), animationDuration: `${l.flick}s` }} />
            </span>
          ))}
          {/* โคมที่เขาของสาวผมทองบังอยู่ครึ่งดวง: ไม่แกว่ง (แกว่งแล้วจะเห็นว่าขาด) มีแค่แสงวูบวาบ */}
          <span className="bg-glow" style={{ left: px(1577), top: px(180), animationDuration: '3.4s' }} />
          <span className="bg-desk">
            <span className="outer" />
            <span className="core" />
          </span>
          <span
            className="bg-quill"
            style={{
              left: px(QUILL.x),
              top: px(QUILL.y),
              width: px(QUILL.w),
              height: px(QUILL.h),
              transformOrigin: `${px(QUILL.ox)} ${px(QUILL.oy)}`,
            }}
          >
            {live && <img src="/bg/sprite-quill.png" alt="" />}
          </span>
          {SPECKS.map((s, i) => (
            <span
              key={i}
              className={`bg-speck ${s.kind}`}
              style={{
                left: px(s.x),
                top: px(s.y),
                width: s.size,
                height: s.size,
                animationDuration: `${s.dur}s`,
                animationDelay: `${s.delay}s`,
                '--dx': px(s.dx),
                '--dy': px(s.dy),
              }}
            />
          ))}
        </div>
      </div>

      {/* ท้องฟ้ายามค่ำหน้ากิลด์ (เห็นเฉพาะหน้าแรก): ดาว + แสงอุ่นลอดประตูกิลด์ที่ขอบล่าง */}
      <div className="bg-night">
        <div className="bg-stars" />
        <div className="bg-stars far" />
        <div className="bg-doorglow" />
      </div>
      <div className="bg-shade" />
      <div className="bg-torch left" />
      <div className="bg-torch right" />
      <div className="bg-fog" />
      {EMBERS.map((m, i) => (
        <span
          key={`e${i}`}
          className="mote"
          style={{
            left: `${m.left}%`,
            width: m.size,
            height: m.size,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
            '--drift': `${m.drift}px`,
          }}
        />
      ))}
      <div className="bg-vignette" />
    </div>
  )
}

// ประกายไฟลอยขึ้นจากด้านล่าง (ครึ่งหนึ่งของเดิม เพราะในฉากมีฝุ่นกับหิ่งห้อยแล้ว)
const EMBERS = Array.from({ length: 11 }, (_, n) => {
  const i = n * 2
  return {
    left: (i * 37 + 11) % 100,
    size: 2 + ((i * 7) % 4),
    delay: -((i * 13) % 16),
    duration: 10 + ((i * 5) % 10),
    drift: ((i * 29) % 70) - 35,
  }
})
