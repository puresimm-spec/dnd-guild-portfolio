// สูตรคำนวณค่าต่างๆ จากค่าสถานะ ตามกติกา D&D 5e (SRD)
// ใช้ในหน้ารายละเอียดสมาชิก (เป็นของเล่นในธีมเกม ไม่ใช่การประเมินความสามารถจริง)
import { resolveClass } from './sprites.js'

// hitDie = ลูกเต๋าพลังชีวิต, saves = saving throw ที่ถนัด, cast = ค่าที่ใช้ร่ายเวท (null = ไม่ร่าย)
const CLASS_RULES = {
  barbarian: { hitDie: 12, saves: ['STR', 'CON'], cast: null },
  fighter: { hitDie: 10, saves: ['STR', 'CON'], cast: null },
  paladin: { hitDie: 10, saves: ['WIS', 'CHA'], cast: 'CHA' },
  ranger: { hitDie: 10, saves: ['STR', 'DEX'], cast: 'WIS' },
  bard: { hitDie: 8, saves: ['DEX', 'CHA'], cast: 'CHA' },
  cleric: { hitDie: 8, saves: ['WIS', 'CHA'], cast: 'WIS' },
  druid: { hitDie: 8, saves: ['INT', 'WIS'], cast: 'WIS' },
  monk: { hitDie: 8, saves: ['STR', 'DEX'], cast: null },
  rogue: { hitDie: 8, saves: ['DEX', 'INT'], cast: null },
  warlock: { hitDie: 8, saves: ['WIS', 'CHA'], cast: 'CHA' },
  artificer: { hitDie: 8, saves: ['CON', 'INT'], cast: 'INT' },
  sorcerer: { hitDie: 6, saves: ['CON', 'CHA'], cast: 'CHA' },
  wizard: { hitDie: 6, saves: ['INT', 'WIS'], cast: 'INT' },
  adventurer: { hitDie: 8, saves: [], cast: null },
}

export const STAT_MIN = 3
export const STAT_MAX = 20

export const abilityMod = (score) => Math.floor((score - 10) / 2)
export const signed = (n) => (n >= 0 ? `+${n}` : `${n}`)

// ค่าสถานะที่ไม่มีหรือไม่ใช่ตัวเลข ให้ถือเป็น 10 (ค่ากลาง)
export const scoreOf = (stats, key) => {
  const n = Number(stats?.[key])
  return Number.isFinite(n) ? n : 10
}

export function deriveStats(dndClass, level, stats) {
  const rules = CLASS_RULES[resolveClass(dndClass)]
  const lv = Math.max(1, Math.floor(Number(level) || 1))
  const prof = 2 + Math.floor((lv - 1) / 4)
  const con = abilityMod(scoreOf(stats, 'CON'))
  const castMod = rules.cast ? abilityMod(scoreOf(stats, rules.cast)) : null
  return {
    level: lv,
    prof,
    hitDie: rules.hitDie,
    // เลเวลแรกได้เต็มลูกเต๋า เลเวลถัดไปใช้ค่าเฉลี่ย (ครึ่งลูกเต๋า + 1) บวกโบนัส CON ทุกเลเวล
    hp: Math.max(1, rules.hitDie + con + (lv - 1) * (rules.hitDie / 2 + 1 + con)),
    ac: 10 + abilityMod(scoreOf(stats, 'DEX')),
    initiative: abilityMod(scoreOf(stats, 'DEX')),
    speed: 30,
    passive: 10 + abilityMod(scoreOf(stats, 'WIS')),
    carry: scoreOf(stats, 'STR') * 15,
    saves: rules.saves,
    cast: rules.cast,
    spellDc: rules.cast ? 8 + prof + castMod : null,
    spellAttack: rules.cast ? prof + castMod : null,
  }
}
