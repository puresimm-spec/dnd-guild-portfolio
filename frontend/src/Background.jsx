import './Background.css'

// พื้นหลังเป็นรูปภาพ (frontend/public/bg.jpg) + ฟิลเตอร์มืดให้อ่านตัวหนังสือง่าย + ละอองแสงลอยขึ้น

// ค่าของละอองแสงคำนวณตายตัวจากลำดับ (ไม่ใช้ Math.random เพื่อให้เรนเดอร์ซ้ำแล้วได้ค่าเดิม)
const MOTES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37 + 11) % 100, // ตำแหน่งแนวนอน (%)
  size: 2 + ((i * 7) % 4), // ขนาด (px)
  delay: -((i * 13) % 14), // เริ่มไม่พร้อมกัน
  duration: 10 + ((i * 5) % 9), // ความเร็วลอย (วินาที)
  drift: ((i * 29) % 60) - 30, // แกว่งซ้าย-ขวา (px)
}))

export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-image" />
      <div className="bg-shade" />
      {MOTES.map((m, i) => (
        <span
          key={i}
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
