import { useEffect, useState } from 'react'

// เราเตอร์แบบง่ายด้วย "hash" ในลิงก์ ไม่ต้องติดตั้ง library เพิ่ม
//   #/            -> หน้าเริ่มต้น
//   #/party       -> หน้าปาร์ตี้ (รายชื่อสมาชิก)
//   #/member/2    -> รายละเอียดสมาชิกคนที่ 2 (นับตามลำดับในหน้าปาร์ตี้)
//   #/developer   -> ข้อมูลผู้พัฒนาเว็บไซต์
//   #/present     -> Presentation ของโปรเจกต์
// ใช้ hash เพราะลิงก์ตรงๆ ยังเปิดได้บน Static Site โดยไม่ต้องตั้งกฎ Rewrite เพิ่ม
function parse() {
  const parts = window.location.hash.replace(/^#/, '').split('/').filter(Boolean)
  if (parts[0] === 'party') return { name: 'party' }
  if (parts[0] === 'developer') return { name: 'developer' }
  if (parts[0] === 'present') return { name: 'present' }
  if (parts[0] === 'member' && parts[1]) return { name: 'member', index: Number(parts[1]) }
  return { name: 'start' }
}

export function useRoute() {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const onChange = () => {
      setRoute(parse())
      window.scrollTo(0, 0) // เปลี่ยนหน้าแล้วเลื่อนขึ้นบนสุด
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export const go = (path) => {
  window.location.hash = path
}
