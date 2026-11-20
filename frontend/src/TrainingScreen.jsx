import { Avatar } from './shared.jsx'
import { useLang } from './i18n.js'
import { resolveClass } from './sprites.js'
import './CharFrame.css'

// ห้องฝึก build (แท็บโบนัส): ตัวละครตัวอย่างที่ผู้เล่นเพิ่มเข้ามา กดเข้าไปลองย้ายแต้มและให้ AI ช่วยวาง build
// ตัวละครเหล่านี้ไม่ใช่สมาชิกของกลุ่ม สมาชิกจริงอยู่ในห้องโถง
export default function TrainingScreen({ characters }) {
  const { t } = useLang()
  return (
    <main className="page">
      <section className="hero compact">
        <p className="eyebrow">⚜ {t('tr_eyebrow')} ⚜</p>
        <h1>{t('tr_title')}</h1>
        <p className="concept">{t('tr_intro')}</p>
        <ol className="training-steps">
          {t('tr_steps').map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="section-title">{t('tr_characters')}</h2>
        <div className="tiles">
          {characters.map((c, i) => (
            <a className="tile" key={c.id} href={`#/training/${i + 1}`} data-class={resolveClass(c.dnd_class)}>
              <div className="char-wrap">
                <div className="char-frame">
                  <Avatar member={c} size="lg" variant={i} />
                </div>
                <span className="frame-level" aria-hidden="true">
                  {c.level}
                </span>
              </div>
              <h3>{c.name}</h3>
              <p className="class-line">
                {c.dnd_class} · {t('level', c.level)}
              </p>
              <span className="tile-cta">{t('tr_open')}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="page-foot">{t('stats_note')}</footer>
    </main>
  )
}
