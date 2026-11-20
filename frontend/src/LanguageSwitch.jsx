import { useLang } from './i18n.js'

// ปุ่มสลับภาษา ไทย / EN (ลอยมุมขวาบนทุกหน้า)
export default function LanguageSwitch() {
  const { lang, setLang } = useLang()
  return (
    <div className="lang-switch" role="group" aria-label="Language / ภาษา">
      <button className={lang === 'th' ? 'active' : ''} aria-pressed={lang === 'th'} onClick={() => setLang('th')}>
        ไทย
      </button>
      <button className={lang === 'en' ? 'active' : ''} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
        EN
      </button>
    </div>
  )
}
