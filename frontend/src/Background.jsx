import { useEffect, useRef } from 'react'
import './Background.css'

// พื้นหลังห้องโถงกิลด์ (frontend/public/bg.jpg) เป็นชั้นๆ จากหลังไปหน้า:
//   รูปเบลอเติมขอบ > รูปจริง (ซูม/แพนช้าๆ) > ฟิลเตอร์มืด > ลำแสงจากด้านบน > แสงคบเพลิงสองข้าง
//   > หมอกเลื่อนด้านล่าง > ฝุ่นในแสง + ประกายไฟลอยขึ้น > ขอบจอมืด
// จอทั่วไป (ไม่เกิน 21:9) รูปเต็มจอแบบตัดขอบ, จอกว้าง 21:9 ขึ้นไปแสดงรูปครบทั้งภาพ (ดู Background.css)
// เมาส์ขยับ = พื้นหลังเลื่อนตามเล็กน้อย (parallax) ปิดเองบนจอสัมผัสและเมื่อตั้งค่าลดการเคลื่อนไหว

// ค่าของละอองคำนวณตายตัวจากลำดับ (ไม่ใช้ Math.random เพื่อให้เรนเดอร์ซ้ำแล้วได้ค่าเดิม)
const EMBERS = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 37 + 11) % 100, // ตำแหน่งแนวนอน (%)
  size: 2 + ((i * 7) % 4), // ขนาด (px)
  delay: -((i * 13) % 16), // เริ่มไม่พร้อมกัน
  duration: 10 + ((i * 5) % 10), // ความเร็วลอย (วินาที)
  drift: ((i * 29) % 70) - 35, // แกว่งซ้าย-ขวา (px)
}))
const DUST = Array.from({ length: 14 }, (_, i) => ({
  left: 18 + ((i * 23) % 50), // อยู่แถวลำแสงตรงกลางค่อนซ้าย (%)
  top: 8 + ((i * 31) % 60), // (%)
  size: 1 + (i % 3),
  delay: -((i * 7) % 20),
  duration: 16 + ((i * 3) % 12),
}))

export default function Background() {
  const ref = useRef(null)

  // parallax ตามเมาส์: เก็บตำแหน่งเป็นตัวแปร CSS (--px, --py ช่วง -1..1) ให้แต่ละชั้นเลื่อนต่างกัน
  useEffect(() => {
    const el = ref.current
    const calm = window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)')
    if (!el || calm.matches) return
    let frame = 0
    const onMove = (e) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--px', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3))
        el.style.setProperty('--py', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3))
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div className="bg" ref={ref} aria-hidden="true">
      <div className="bg-layer bg-fill" />
      <div className="bg-layer bg-photo">
        <div className="bg-image" />
      </div>
      <div className="bg-shade" />
      <div className="bg-rays" />
      <div className="bg-torch left" />
      <div className="bg-torch right" />
      <div className="bg-fog" />
      {DUST.map((d, i) => (
        <span
          key={`d${i}`}
          className="dust"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
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
