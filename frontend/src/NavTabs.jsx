import './NavTabs.css'
import { useLang } from './i18n.js'

// แถบแท็บด้านบนทุกหน้า (แบบที่คั่นหนังสือ): หน้าแรก / ห้องโถง / ผู้พัฒนา / Presentation
// หน้ารายละเอียดสมาชิกนับเป็นส่วนหนึ่งของ "ห้องโถง"
const TABS = [
  { id: 'start', href: '#/', label: 'nav_home' },
  { id: 'party', href: '#/party', label: 'nav_hall', also: ['member'] },
  { id: 'developer', href: '#/developer', label: 'nav_dev' },
  { id: 'present', href: '#/present', label: 'nav_present' },
]

export default function NavTabs({ route }) {
  const { t } = useLang()
  return (
    <nav className="nav-tabs" aria-label={t('nav_label')}>
      <a className="nav-brand" href="#/">
        ⚜ Buddy Build
      </a>
      <div className="nav-tab-list">
        {TABS.map((tab) => {
          const active = route.name === tab.id || tab.also?.includes(route.name)
          return (
            <a key={tab.id} className="nav-tab" href={tab.href} aria-current={active ? 'page' : undefined}>
              {t(tab.label)}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
