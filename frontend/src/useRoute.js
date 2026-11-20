import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

// เราเตอร์แบบง่ายด้วย "hash" ในลิงก์ ไม่ต้องติดตั้ง library เพิ่ม
//   #/             -> หน้าเริ่มต้น
//   #/lobby        -> ลานต้อนรับ: Guild Keeper แนะนำเมนูไปหน้าต่างๆ (หลังเดินผ่านประตู)
//   #/party        -> ห้องโถง: แนะนำกลุ่ม สมาชิก ผลงาน ช่องทางติดต่อ
//   #/member/2     -> โปรไฟล์สมาชิกคนที่ 2 (นับตามลำดับในห้องโถง)
//   #/chat         -> หน้าแชตเต็มจอกับ Guild Keeper (AI)
//   #/training     -> ห้องฝึก build (ตัวละครตัวอย่าง)
//   #/training/1   -> หน้าวางแผน build ของตัวละครตัวอย่างตัวที่ 1
//   #/developer    -> เบื้องหลังเว็บไซต์ (เทคโนโลยี, ระบบทำงานอย่างไร)
//   #/present      -> Presentation ของโปรเจกต์
// ใช้ hash เพราะลิงก์ตรงๆ ยังเปิดได้บน Static Site โดยไม่ต้องตั้งกฎ Rewrite เพิ่ม
function parse() {
  const parts = window.location.hash.replace(/^#/, '').split('/').filter(Boolean)
  if (parts[0] === 'lobby') return { name: 'lobby' }
  if (parts[0] === 'party') return { name: 'party' }
  if (parts[0] === 'chat') return { name: 'chat' }
  if (parts[0] === 'developer') return { name: 'developer' }
  if (parts[0] === 'present') return { name: 'present' }
  if (parts[0] === 'member' && parts[1]) return { name: 'member', index: Number(parts[1]) }
  if (parts[0] === 'training' && parts[1]) return { name: 'character', index: Number(parts[1]) }
  if (parts[0] === 'training') return { name: 'training' }
  return { name: 'start' }
}

export function useRoute() {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const update = () => {
      flushSync(() => setRoute(parse()))
      window.scrollTo(0, 0) // เปลี่ยนหน้าแล้วเลื่อนขึ้นบนสุด
    }
    // เปลี่ยนหน้าแบบนุ่มนวล: หน้าเก่าจางออก หน้าใหม่ลอยขึ้นมา (ดู KeeperNav.css)
    // ไม่ใช้ตอนเบราว์เซอร์ไม่รองรับ, ตอนตั้งค่าลดการเคลื่อนไหว, และตอนประตูกิลด์กำลังเล่น (ประตูบังอยู่แล้ว)
    const onChange = () => {
      const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      if (!document.startViewTransition || calm || document.querySelector('.guild-doors')) {
        update()
        return
      }
      const root = document.documentElement
      root.classList.add('page-switching')
      const transition = document.startViewTransition(update)
      transition.finished.finally(() => root.classList.remove('page-switching'))
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export const go = (path) => {
  window.location.hash = path
}
