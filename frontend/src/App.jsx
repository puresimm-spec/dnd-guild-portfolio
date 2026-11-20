import { useEffect, useState } from 'react'
import './App.css'
import './Screens.css'
import Background from './Background.jsx'
import ChatWidget from './ChatWidget.jsx'
import StartScreen from './StartScreen.jsx'
import PartyScreen from './PartyScreen.jsx'
import MemberScreen from './MemberScreen.jsx'
import DeveloperScreen from './DeveloperScreen.jsx'
import PresentationScreen from './PresentationScreen.jsx'
import NavTabs from './NavTabs.jsx'
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
      <Background />
      <Screens />
      <LanguageSwitch />
    </LangProvider>
  )
}

function Screens() {
  const route = useRoute()
  return (
    <>
      <NavTabs route={route} />
      <Page route={route} />
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

  // หน้านักพัฒนาเป็นข้อมูลคงที่ ไม่ต้องรอ backend (ผลงานของทีมจะโผล่มาเมื่อโหลดข้อมูลเสร็จ)
  if (route.name === 'developer') {
    return (
      <>
        <DeveloperScreen projects={data?.group?.projects} />
        <ChatWidget />
      </>
    )
  }

  // Presentation ก็เป็นข้อมูลคงที่ (ไม่ใส่ปุ่มแชต จะได้ไม่บังสไลด์ตอนนำเสนอ)
  if (route.name === 'present') {
    return <PresentationScreen />
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
      {route.name === 'member' && <MemberScreen members={data.members} index={route.index} />}
      <ChatWidget />
    </>
  )
}
