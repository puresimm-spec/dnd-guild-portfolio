import { useEffect, useState } from 'react'
import PixelAvatar from './PixelAvatar.jsx'
import { MenuList, Typed } from './GuildMenu.jsx'
import { DESTINATIONS } from './destinations.js'
import { useLang } from './i18n.js'

// ลานต้อนรับ: หน้าแรกหลังเดินผ่านประตูกิลด์
// Guild Keeper (ตัวเดียวกับในหน้าแชต AI) ทักทาย แล้วแนะนำเมนูไปหน้าต่างๆ
// ชี้หรือโฟกัสเมนูไหน Guild Keeper จะเล่าว่าหน้านั้นมีอะไร

// หน้านี้ถูกเปิดไว้ข้างหลังประตูตั้งแต่ประตูยังปิด (html มี class guild-entering = ยังซ่อนเนื้อหาอยู่)
// รอจนเนื้อหาถูกเผยจริงก่อน แล้ว Guild Keeper ค่อยโผล่และเริ่มพูด ไม่งั้นจะพูดจบไปตอนยังมองไม่เห็น
function useRevealed() {
  const isHidden = () => document.documentElement.classList.contains('guild-entering')
  const [revealed, setRevealed] = useState(() => !isHidden())
  useEffect(() => {
    if (revealed) return
    const observer = new MutationObserver(() => !isHidden() && setRevealed(true))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [revealed])
  return revealed
}

export default function LobbyScreen({ group }) {
  const { t, lang } = useLang()
  const revealed = useRevealed()
  const [hint, setHint] = useState(null) // เมนูที่กำลังชี้อยู่ (Guild Keeper จะอธิบายหน้านั้น)
  const name = group?.name ?? 'Buddy Build'
  const say = hint ? t(`lb_${hint}_say`) : t('lb_greet', name)

  const items = [
    ...DESTINATIONS.filter((d) => d.id !== 'lobby').map((d) => ({ ...d, label: t(d.label), desc: t(`lb_${d.id}`) })),
    { id: 'leave', href: '#/', label: t('lb_leave'), desc: t('lb_leave_desc') },
  ]

  return (
    <main className="page lobby">
      <h1 className="sr-only">{t('lb_title')}</h1>
      {revealed && (
        <>
          <figure className="lobby-keeper" aria-hidden="true">
            <div className="lobby-keeper-art">
              <PixelAvatar dndClass="Wizard" variant={4} label="Guild Keeper" />
            </div>
            <figcaption>Guild Keeper</figcaption>
          </figure>

          <div className="lobby-panel">
            <div className="lobby-dialog">
              <span className="lobby-speaker">Guild Keeper</span>
              <Typed key={say} text={say} lang={lang} delay={hint ? 0 : 500} speed={hint ? 14 : 30} />
            </div>

            <nav className="lobby-menu" aria-label={t('lb_menu')}>
              <p className="lobby-menu-title">{t('lb_menu')}</p>
              <MenuList items={items} onHint={setHint} />
            </nav>
          </div>
        </>
      )}
    </main>
  )
}
