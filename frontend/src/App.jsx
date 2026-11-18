import { useEffect, useState } from 'react'
import './App.css'
import './Screens.css'
import ChatWidget from './ChatWidget.jsx'
import StartScreen from './StartScreen.jsx'
import PartyScreen from './PartyScreen.jsx'
import MemberScreen from './MemberScreen.jsx'
import { useRoute } from './useRoute.js'

// โหลดข้อมูล portfolio ครั้งเดียวที่นี่ แล้วแจกให้ทุกหน้า
function usePortfolio() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setError(null)
    setData(null)
    fetch('/api/portfolio')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  return { data, error, reload: () => setReloadKey((k) => k + 1) }
}

export default function App() {
  const route = useRoute()
  const { data, error, reload } = usePortfolio()

  // หน้าแรกแสดงทันที (ระหว่างรอข้อมูลจะโชว์ข้อความรอ) เพื่อให้ได้ปลุก backend ไปด้วย
  if (route.name === 'start') {
    return <StartScreen group={data?.group} error={error} onRetry={reload} />
  }

  // หน้าอื่นต้องมีข้อมูลก่อน
  if (error) {
    return (
      <main className="page center">
        <div className="notice">
          <h2>ประตูห้องโถงถูกปิดอยู่</h2>
          <p>โหลดข้อมูลไม่สำเร็จ ({error})</p>
          <button className="btn-gold" onClick={reload}>
            ลองใหม่
          </button>
        </div>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="page center">
        <p className="loading">กำลังเปิดม้วนคัมภีร์…</p>
      </main>
    )
  }

  return (
    <>
      {route.name === 'party' && <PartyScreen group={data.group} members={data.members} />}
      {route.name === 'member' && <MemberScreen members={data.members} index={route.index} />}
      <ChatWidget />
    </>
  )
}
