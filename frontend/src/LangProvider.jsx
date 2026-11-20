import { useEffect, useMemo, useState } from 'react'
import { DICT, LangContext, STORAGE_KEY } from './i18n.js'

// ภาษาเริ่มต้น: ใช้ที่เคยเลือกไว้ ถ้าไม่มีใช้ภาษาไทย
function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'th' || saved === 'en') return saved
  } catch {
    /* localStorage ใช้ไม่ได้: ข้ามไป */
  }
  return 'th'
}

export default function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      setLang: (next) => {
        setLangState(next)
        try {
          localStorage.setItem(STORAGE_KEY, next)
        } catch {
          /* จำภาษาข้ามรีเฟรชไม่ได้ ไม่เป็นไร */
        }
      },
      // t('key') หรือ t('key', arg1, ...) ถ้าไม่มีคำแปลภาษาอังกฤษจะใช้ภาษาไทยแทน
      t: (key, ...args) => {
        const entry = DICT[lang][key] ?? DICT.th[key] ?? key
        return typeof entry === 'function' ? entry(...args) : entry
      },
    }),
    [lang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
