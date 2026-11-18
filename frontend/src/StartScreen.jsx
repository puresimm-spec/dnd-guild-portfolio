import { useEffect, useRef } from 'react'
import { go } from './useRoute.js'

// หน้าแรก: ชื่อกิลด์ + ปุ่มเข้าสู่ห้องโถง
// ระหว่างที่รอ backend (แพ็กเกจฟรีอาจต้องปลุกก่อน) จะแสดงข้อความรอ แล้วค่อยโชว์ปุ่ม
export default function StartScreen({ group, error, onRetry }) {
  const enterRef = useRef(null)

  useEffect(() => {
    if (group) enterRef.current?.focus() // กด Enter เข้าได้ทันที
  }, [group])

  return (
    <main className="start">
      <div className="start-frame">
        <p className="eyebrow">⚜ Adventurers’ Guild ⚜</p>

        {error && (
          <>
            <h1>ประตูห้องโถงถูกปิดอยู่</h1>
            <p className="start-sub">โหลดข้อมูลไม่สำเร็จ ({error})</p>
            <button className="btn-gold btn-enter" onClick={onRetry}>
              ลองใหม่
            </button>
          </>
        )}

        {!error && !group && <p className="loading">กำลังเปิดประตูห้องโถง…</p>}

        {!error && group && (
          <>
            <h1>{group.name}</h1>
            {group.tagline && <p className="start-sub">{group.tagline}</p>}
            <button ref={enterRef} className="btn-gold btn-enter" onClick={() => go('/party')}>
              ⚔ เข้าสู่ห้องโถง
            </button>
          </>
        )}
      </div>
    </main>
  )
}
