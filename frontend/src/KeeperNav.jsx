import { useEffect, useId, useRef, useState } from 'react'
import './KeeperNav.css'
import PixelAvatar from './PixelAvatar.jsx'
import { MenuList, Typed } from './GuildMenu.jsx'
import { DESTINATIONS, sectionOf } from './destinations.js'
import { useLang } from './i18n.js'

// ตัวนำทางแทนแถบแท็บเดิม: Guild Keeper ยืนรอที่มุมซ้ายบนทุกหน้าในกิลด์
// กดแล้วจะมีกล่องคำพูดบอกว่าตอนนี้อยู่ที่ไหน พร้อมเมนูไปหน้าอื่น (ชุดเดียวกับลานต้อนรับ)
// ปิดได้ด้วย Esc, กดข้างนอก, หรือเมื่อเปลี่ยนหน้า (App ใส่ key={route.name} ให้ ทำให้เริ่มใหม่ทุกหน้า)
export default function KeeperNav({ route }) {
  const { t, lang } = useLang()
  const [open, setOpen] = useState(false)
  const [hint, setHint] = useState(null)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const panelId = useId()

  const current = sectionOf(route.name)
  const here = DESTINATIONS.find((d) => d.id === current)
  const say = hint && hint !== current ? t(`lb_${hint}_say`) : t('kn_where', here ? t(here.label) : '')

  const items = DESTINATIONS.map((d) => ({ ...d, label: t(d.label), desc: t(`lb_${d.id}`) }))

  // ปิดเมื่อกด Esc (แล้วโฟกัสกลับที่ปุ่ม) หรือกดนอกกล่อง
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    const onPointer = (e) => !rootRef.current?.contains(e.target) && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  const toggle = () => {
    setHint(null)
    setOpen((o) => !o)
  }
  // ลูกศรลงที่ปุ่ม = เปิดแล้วไปที่เมนูแรก
  const onButtonKey = (e) => {
    if (e.key !== 'ArrowDown') return
    e.preventDefault()
    setOpen(true)
    requestAnimationFrame(() => listRef.current?.querySelector('a')?.focus())
  }

  return (
    <div className="keeper-nav" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="keeper-nav-btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        onKeyDown={onButtonKey}
      >
        <span className="keeper-nav-face" aria-hidden="true">
          <PixelAvatar dndClass="Wizard" variant={4} label="" />
        </span>
        <span className="keeper-nav-label">{open ? t('kn_close') : t('kn_button')}</span>
      </button>

      {open && (
        <nav id={panelId} className="keeper-pop" aria-label={t('nav_label')}>
          <div className="keeper-pop-say">
            <span className="lobby-speaker">Guild Keeper</span>
            <Typed key={say} text={say} lang={lang} speed={hint ? 12 : 22} />
          </div>
          <MenuList items={items} current={current} onHint={setHint} listRef={listRef} />
        </nav>
      )}
    </div>
  )
}
