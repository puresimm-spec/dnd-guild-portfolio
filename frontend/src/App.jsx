import { useEffect, useState } from 'react'
import './App.css'
import './Screens.css'
import './Portfolio.css'
import Background from './Background.jsx'
import StartScreen from './StartScreen.jsx'
import LobbyScreen from './LobbyScreen.jsx'
import PartyScreen from './PartyScreen.jsx'
import MemberScreen from './MemberScreen.jsx'
import ProfileScreen from './ProfileScreen.jsx'
import TrainingScreen from './TrainingScreen.jsx'
import DeveloperScreen from './DeveloperScreen.jsx'
import PresentationScreen from './PresentationScreen.jsx'
import ChatScreen from './ChatScreen.jsx'
import KeeperNav from './KeeperNav.jsx'
import GuildDoors from './GuildDoors.jsx'
import LangProvider from './LangProvider.jsx'
import LanguageSwitch from './LanguageSwitch.jsx'
import { useLang } from './i18n.js'
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
  return (
    <LangProvider>
      <Shell />
    </LangProvider>
  )
}

// หน้าแรก = "ข้างนอกกิลด์": ไม่มีแถบแท็บ และพื้นหลังเป็นท้องฟ้ายามค่ำ (ไม่มีรูป)
// ลานต้อนรับ = ในกิลด์แล้ว (มีรูปพื้นหลัง) เมนูของ Guild Keeper อยู่กลางหน้าอยู่แล้ว
// หน้าอื่น = "ในกิลด์": มีรูปห้องโถงเป็นพื้นหลัง และ Guild Keeper มุมซ้ายบนไว้เลือกไปหน้าอื่น (แทนแถบแท็บเดิม)
function Shell() {
  const route = useRoute()
  const outside = route.name === 'start'
  return (
    <>
      <Background outside={outside} />
      {!outside && route.name !== 'lobby' && <KeeperNav key={route.name} route={route} />}
      <Page route={route} />
      <LanguageSwitch />
      <GuildDoors />
    </>
  )
}

function Page({ route }) {
  const { t } = useLang()
  const { data, error, reload } = usePortfolio()

  // หน้าแรกแสดงทันที (ระหว่างรอข้อมูลจะโชว์ข้อความรอ) เพื่อให้ได้ปลุก backend ไปด้วย
  if (route.name === 'start') {
    return <StartScreen group={data?.group} error={error} onRetry={reload} />
  }

  // ลานต้อนรับแสดงทันที (ใช้แค่ชื่อกลุ่มในคำทักทาย ถ้ายังโหลดไม่เสร็จใช้ชื่อสำรอง)
  if (route.name === 'lobby') {
    return <LobbyScreen group={data?.group} />
  }

  // เบื้องหลังเว็บเป็นข้อมูลคงที่ ไม่ต้องรอ backend
  if (route.name === 'developer') {
    return <DeveloperScreen members={data?.members} />
  }

  // Presentation ใช้ข้อมูลล่าสุดจาก API (กลุ่ม สมาชิก ผลงาน ติดต่อ) ระหว่างโหลดจะแสดงส่วนที่ไม่ต้องใช้ข้อมูลก่อน
  if (route.name === 'present') {
    return <PresentationScreen group={data?.group} members={data?.members} />
  }

  // หน้าแชตเต็มจอ ไม่ต้องรอข้อมูล (ฝั่ง backend อ่านเองตอนถาม AI)
  if (route.name === 'chat') {
    return <ChatScreen members={data?.members} />
  }

  // หน้าอื่นต้องมีข้อมูลก่อน
  if (error) {
    return (
      <main className="page center">
        <div className="notice">
          <h2>{t('err_title')}</h2>
          <p>{t('err_body', error)}</p>
          <button className="btn-gold" onClick={reload}>
            {t('retry')}
          </button>
        </div>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="page center">
        <p className="loading">{t('loading_scroll')}</p>
      </main>
    )
  }

  return (
    <>
      {route.name === 'party' && <PartyScreen group={data.group} members={data.members} />}
      {route.name === 'member' && <ProfileScreen group={data.group} members={data.members} index={route.index} />}
      {route.name === 'training' && <TrainingScreen characters={data.characters} />}
      {route.name === 'character' && <MemberScreen members={data.characters} index={route.index} />}
    </>
  )
}
