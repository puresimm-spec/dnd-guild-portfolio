// D&D 5e formulas used by the stat planner (pure functions, no browser needed)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { abilityMod, deriveStats, scoreOf, signed } from '../src/rules.js'

test('ability modifier follows floor((score - 10) / 2)', () => {
  assert.equal(abilityMod(10), 0)
  assert.equal(abilityMod(9), -1)
  assert.equal(abilityMod(17), 3)
  assert.equal(abilityMod(18), 4)
  assert.equal(abilityMod(3), -4)
})

test('signed() always shows the sign', () => {
  assert.equal(signed(3), '+3')
  assert.equal(signed(0), '+0')
  assert.equal(signed(-1), '-1')
})

test('missing or non-numeric stats count as 10', () => {
  assert.equal(scoreOf({}, 'STR'), 10)
  assert.equal(scoreOf({ STR: 'abc' }, 'STR'), 10)
  assert.equal(scoreOf({ STR: 15 }, 'STR'), 15)
})

test('Paladin level 9 (Brannoc) matches the hand-checked numbers', () => {
  const d = deriveStats('Paladin', 9, { STR: 17, DEX: 9, CON: 16, INT: 10, WIS: 12, CHA: 15 })
  assert.equal(d.prof, 4) // levels 9-12
  assert.equal(d.hp, 85) // 10 + 3 + 8 * (6 + 3)
  assert.equal(d.ac, 9) // unarmored: 10 + DEX mod
  assert.equal(d.spellDc, 14) // 8 + prof + CHA mod
  assert.deepEqual(d.saves, ['WIS', 'CHA'])
})

test('Wizard level 8 with INT 20 has spell DC 16 and attack +8', () => {
  const d = deriveStats('Wizard', 8, { STR: 8, DEX: 14, CON: 13, INT: 20, WIS: 12, CHA: 10 })
  assert.equal(d.spellDc, 16)
  assert.equal(d.spellAttack, 8)
})

test('class aliases work (Warrior -> Fighter) and non-casters have no spell DC', () => {
  const d = deriveStats('Warrior', 5, { CON: 12 })
  assert.equal(d.hitDie, 10)
  assert.equal(d.spellDc, null)
})
