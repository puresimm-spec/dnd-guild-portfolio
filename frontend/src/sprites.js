// ตัวละครพิกเซลตามอาชีพ DnD: วาดเป็นตารางตัวอักษร ขนาด 16 x 20 พิกเซล
// ทุกตัวใช้ร่างพื้นฐานเดียวกัน แล้วทับด้วย "แพตช์" ของแต่ละอาชีพ (หมวก อาวุธ เสื้อคลุม)
//
// ความหมายของตัวอักษรในตาราง
//   .  ว่าง/โปร่งใส (ในแพตช์ = ไม่แตะพิกเซลเดิม)    o  เส้นขอบ     e  ตา
//   s  สีผิว   h  สีผม   a  สีเสื้อหลัก   b  สีเสื้อรอง
//   m  โลหะสว่าง   M  เหล็กเทาอ่อน   n  โลหะเทา   g  ทอง   w  ไม้   B  ขาว/กระดูก

export const SPRITE_W = 16
export const SPRITE_H = 20

const BASE = [
  '................',
  '................',
  '....oooooooo....',
  '...ohhhhhhhho...',
  '...ohhhhhhhho...',
  '...ohssssssho...',
  '...ohsessesho...',
  '...osssssssso...',
  '....osssssso....',
  '.....oooooo.....',
  '...oaaaaaaaao...',
  '..oaaaabbaaaao..',
  '..osaaabbaaaso..',
  '...oggggggggo...',
  '...oaaaaaaaao...',
  '....obboobbo....',
  '....obboobbo....',
  '...owwwoowwwo...',
  '...oooooooooo...',
  '................',
]

const COLORS = {
  o: '#1b1210',
  e: '#1b1210',
  m: '#e3e8ee',
  n: '#8b97a3',
  M: '#b9c3ce',
  g: '#f0c94b',
  w: '#7a4a21',
  B: '#f3ead2',
}

// ผู้เล่นหลายคนที่เลือกอาชีพเดียวกันจะได้หน้าตา/สีผมต่างกัน (เลือกตามลำดับในปาร์ตี้)
const SKINS = ['#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#ffdbac']
const HAIRS = ['#3b2314', '#1c1c1c', '#a0522d', '#d4a017', '#c0392b', '#7d7d86']

const p = (row, col, chars) => ({ row, col, chars })
const column = (col, from, to, ch) => Array.from({ length: to - from + 1 }, (_, i) => p(from + i, col, ch))

// ---------- ชิ้นส่วนที่ใช้ซ้ำ ----------
const helmet = (crest) => [
  p(0, 7, 'oo'),
  p(1, 6, `o${crest}${crest}o`),
  p(3, 4, 'MMMMMMMM'),
  p(4, 4, 'MMMMMMMM'),
  p(5, 4, 'M......M'),
  p(6, 4, 'M......M'),
]
const shield = (emblem) => [
  p(10, 0, 'onno'),
  p(11, 0, `o${emblem}${emblem}o`),
  p(12, 0, `o${emblem}${emblem}o`),
  p(13, 0, 'onno'),
  p(14, 1, 'oo'),
]
const sword = [...column(14, 5, 11, 'm'), p(12, 14, 'g'), p(13, 14, 'w')].flatMap((x) => [
  x,
  p(x.row, 15, 'o'),
])
const robe = [p(15, 3, 'oaaaaaaaao'), p(16, 3, 'oaaaaaaaao'), p(17, 3, 'oaaaaaaaao')]
const hood = [
  p(2, 3, 'oaaaaaaaao'),
  p(3, 3, 'oaaaaaaaao'),
  p(4, 3, 'oaaaaaaaao'),
  p(5, 4, 'a......a'),
  p(6, 4, 'a......a'),
  p(7, 4, 'a......a'),
]
const staff = column(14, 7, 18, 'w')

// ---------- อาชีพ ----------
const CLASSES = {
  fighter: { a: '#7b8794', b: '#a8323e', patches: [...helmet('b'), ...shield('b'), ...sword] },
  barbarian: {
    a: '#8a5a2b',
    b: '#c9a24b',
    patches: [
      p(1, 1, 'B'), p(2, 2, 'B'), p(3, 2, 'B'),
      p(1, 14, 'B'), p(2, 13, 'B'), p(3, 13, 'B'),
      p(3, 4, 'nnnnnnnn'), p(4, 4, 'nnnnnnnn'),
      p(11, 3, 's'), p(11, 12, 's'),
      p(3, 14, 'nn'), p(4, 14, 'nn'), p(5, 14, 'nn'),
      ...column(14, 6, 13, 'w'),
    ],
  },
  wizard: {
    a: '#5b3fa0',
    b: '#7fd4ff',
    patches: [
      p(0, 7, 'oo'), p(1, 6, 'oaao'), p(2, 5, 'oaaaao'),
      p(3, 3, 'oggggggggo'), p(4, 1, 'oaaaaaaaaaaaao'),
      p(8, 5, 'BBBBBB'), p(9, 6, 'BBBB'), p(10, 7, 'BB'),
      ...robe, ...staff,
      p(4, 13, 'bb'), p(5, 13, 'bb'), p(6, 13, 'oo'),
    ],
  },
  sorcerer: {
    a: '#d94f70',
    b: '#ffd166',
    patches: [
      p(1, 5, 'h..h.h'), p(2, 4, 'hhhhhhhh'),
      p(9, 1, 'b'), p(10, 0, 'bb'), p(11, 0, 'bb'),
    ],
  },
  warlock: {
    a: '#3b2a50',
    b: '#b04cff',
    patches: [
      ...hood, p(6, 6, 'b'), p(6, 9, 'b'),
      p(9, 1, 'b'), p(10, 0, 'bb'), p(11, 0, 'bb'),
      ...robe,
    ],
  },
  cleric: {
    a: '#ece7da',
    b: '#d4a017',
    patches: [
      p(0, 5, 'gggggg'), p(1, 4, 'g......g'),
      ...robe,
      ...column(14, 7, 13, 'w'), p(4, 13, 'nnn'), p(5, 13, 'nnn'), p(6, 14, 'n'),
    ],
  },
  paladin: { a: '#cdd6df', b: '#e6c36a', patches: [...helmet('g'), ...shield('g'), ...sword] },
  rogue: {
    a: '#34495e',
    b: '#7f8c8d',
    patches: [
      ...hood, p(7, 4, 'bbbbbbbb'),
      p(9, 14, 'm'), p(10, 14, 'm'), p(11, 14, 'g'),
      p(9, 1, 'm'), p(10, 1, 'm'), p(11, 1, 'g'),
    ],
  },
  ranger: {
    a: '#3f7d3a',
    b: '#7a4a21',
    patches: [
      ...hood,
      p(5, 1, 'w'), ...column(0, 6, 13, 'w'), p(14, 1, 'w'),
      ...column(1, 6, 13, 'B'),
    ],
  },
  monk: {
    a: '#e08a2b',
    b: '#7a2f1a',
    patches: [
      p(0, 7, 'oo'), p(1, 6, 'ohho'),
      p(4, 3, 'obbbbbbbbo'),
      p(13, 4, 'bbbbbbbb'),
      p(15, 5, 'aa'), p(15, 9, 'aa'), p(16, 5, 'aa'), p(16, 9, 'aa'),
      p(17, 4, 'sss'), p(17, 9, 'sss'),
      p(10, 14, 'gg'), p(11, 14, 'gg'),
    ],
  },
  bard: {
    a: '#2e86ab',
    b: '#e6c36a',
    patches: [
      p(2, 3, 'oaaaaaaaao'), p(3, 3, 'oaaaaaaaao'), p(4, 2, 'oaaaaaaaaaao'),
      p(0, 12, 'bb'), p(1, 11, 'bb'),
      p(9, 1, 'w'), p(10, 1, 'w'),
      p(11, 0, 'www'), p(12, 0, 'wow'), p(13, 0, 'www'),
    ],
  },
  druid: {
    a: '#6b8e23',
    b: '#8b5a2b',
    patches: [
      p(1, 5, 'a..a.a'), p(2, 4, 'aaaaaaaa'),
      ...robe,
      ...column(14, 4, 18, 'w'), p(3, 13, 'aa'), p(4, 13, 'a'),
    ],
  },
  artificer: {
    a: '#b5651d',
    b: '#4aa3a3',
    patches: [
      p(4, 4, 'nbbnnbbn'),
      p(7, 13, 'nnn'), ...column(14, 8, 13, 'n'),
      p(10, 0, 'ggg'), p(11, 0, 'gng'), p(12, 0, 'ggg'),
    ],
  },
  adventurer: { a: '#6c7a89', b: '#8e5a3c', patches: [] },
}

// ชื่ออื่นที่ผู้ใช้อาจพิมพ์ใน seed.json -> อาชีพมาตรฐาน
const ALIASES = {
  warrior: 'fighter', knight: 'fighter', soldier: 'fighter',
  mage: 'wizard', magician: 'wizard',
  thief: 'rogue', assassin: 'rogue',
  priest: 'cleric', healer: 'cleric',
  archer: 'ranger', hunter: 'ranger',
  berserker: 'barbarian',
  engineer: 'artificer', inventor: 'artificer',
}

export function resolveClass(name) {
  const key = String(name ?? '').trim().toLowerCase()
  const resolved = ALIASES[key] ?? key
  return resolved in CLASSES ? resolved : 'adventurer'
}

// สร้างตัวละคร -> รายการสี่เหลี่ยม { x, y, w, color } (รวมพิกเซลสีเดียวกันในแถวเดียวกันให้เป็นแท่งเดียว)
export function buildSprite(dndClass, variant = 0) {
  const cls = CLASSES[resolveClass(dndClass)]
  const grid = BASE.map((line) => line.split(''))

  for (const { row, col, chars } of cls.patches) {
    for (let i = 0; i < chars.length; i++) {
      const x = col + i
      if (chars[i] !== '.' && row >= 0 && row < SPRITE_H && x >= 0 && x < SPRITE_W) grid[row][x] = chars[i]
    }
  }

  const palette = {
    ...COLORS,
    a: cls.a,
    b: cls.b,
    s: SKINS[variant % SKINS.length],
    h: HAIRS[(variant * 2 + 1) % HAIRS.length],
  }

  const rects = []
  grid.forEach((cells, y) => {
    let x = 0
    while (x < SPRITE_W) {
      const ch = cells[x]
      if (ch === '.' || !palette[ch]) {
        x++
        continue
      }
      let end = x
      while (end + 1 < SPRITE_W && cells[end + 1] === ch) end++
      rects.push({ x, y, w: end - x + 1, color: palette[ch] })
      x = end + 1
    }
  })
  return rects
}

export const CLASS_NAMES = Object.keys(CLASSES)
