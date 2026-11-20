// ตัวละครพิกเซลแบบครึ่งตัว (32 x 32) วาดเฉพาะคน ใช้แทนตัวละครตามอาชีพใน sprites.js
// ใช้ในหน้าผู้พัฒนา: ใส่ portrait: 'ชื่อ' ใน developer.js
//
// ความหมายของตัวอักษร
//   .  ว่าง   o  เส้นขอบ   E  ตา   h  ผม   H  ไฮไลต์ผม   r  คิ้ว
//   s  ผิว   S  เงาผิว   L  ปาก   a  เสื้อ   b  ปกเสื้อ   c  ผ้าคาดเอว   T  เนคไท

const PORTRAITS = {
  // พอล: Monk ใส่เชิ้ตขาว เนคไทเทา (ชุดเดียวกับรูปในเรซูเม่)
  paul: {
    width: 32,
    height: 32,
    palette: {
      o: '#1b1210',
      E: '#1b1210',
      h: '#1b1615',
      H: '#3d3433',
      r: '#1b1615',
      s: '#e2aa7e',
      S: '#bd8159',
      L: '#a95e52',
      a: '#eef0f2',
      b: '#cfd5db',
      c: '#eef0f2',
      T: '#8d949b',
    },
    rows: [
      '................................',
      '................................',
      '............oooooooo............',
      '..........ooHHhhhhhhoo..........',
      '.........oHHhhhhhhhhhho.........',
      '........ohHhhhhhhhhhhhho........',
      '........ohhhhhhhhhhhhhho........',
      '.......ohhhhhhhhhhhhhhhho.......',
      '.......ohhhhhhhhhhhhhhhho.......',
      '.......ohhhhhhhhhhhhhhhho.......',
      '.......ohhhhhhhhhhhhhhhho.......',
      '.......ohhhhhshhhhshhhhho.......',
      '.......ohhsrrrssssrrrshho.......',
      '.......ohhssEEssssEEsshho.......',
      '.......ohhsssssssssssshho.......',
      '.......ohhssssssSssssshho.......',
      '.......ohhsssssssssssshho.......',
      '........ohssssLLLLssssho........',
      '.........oSssssssssssSo.........',
      '..........oSssssssssSo..........',
      '...........ooSSSSSSoo...........',
      '.............oSSSSo.............',
      '......ooaaaaaoSssSoaaaaaoo......',
      '.....oaaaaaaaabTTbaaaaaaaao.....',
      '....oaaaaaaaaabTTbaaaaaaaaao....',
      '...oaaaaaaaaaaaTTaaaaaaaaaaao...',
      '..oaaaaaaaaaaaaTTaaaaaaaaaaaao..',
      '..oaaaaaaaaaaaaTTaaaaaaaaaaaao..',
      '..occccccccccccTTcccccccccccco..',
      '..occccccccccccTTcccccccccccco..',
      '..oaaaaaaaaaaaTTTTaaaaaaaaaaao..',
      '..oaaaaaaaaaaaaTTaaaaaaaaaaaao..',
    ],
  },

  // เซนส์: Warrior สาย Purple Dragon Knight เกราะม่วง เกราะไหล่ทอง ผ้าคลุมม่วง ใส่แว่น
  //   p  เกราะไหล่   P  เงาเกราะไหล่   q  ผ้าคลุม   G  กรอบแว่น
  sense: {
    width: 32,
    height: 32,
    palette: {
      o: '#1b1210',
      E: '#1b1210',
      h: '#141212',
      H: '#3a3434',
      r: '#141212',
      s: '#e8b892',
      S: '#c48f6a',
      L: '#b26a5e',
      a: '#4b2d6b',
      b: '#e6c36a',
      c: '#e6c36a',
      p: '#e6c36a',
      P: '#a8873f',
      q: '#6b3fa0',
      G: '#141010',
    },
    rows: [
      '................................',
      '................................',
      '............oooooooo............',
      '..........ooHhhhhhhhoo..........',
      '.........ohHhhhhhhhhhho.........',
      '........ohhhhhhhhhhhhhho........',
      '........ohhhhhhhhhhhhhho........',
      '........ohhhhhhhhhhhhhho........',
      '........ohhhhhhhhhhhhhho........',
      '........ohhhhhhhhhhhhhho........',
      '........ohhhhhhhhhhhssho........',
      '........ohsrrrssssrrrsho........',
      '........ohsGGGGssGGGGsho........',
      '........oGGGEEGGGGEEGGGo........',
      '........ossGGGGssGGGGsso........',
      '........oSssssssSsssssSo........',
      '.........osssssssssssso.........',
      '.........ossssLLLLsssso.........',
      '..........oSssssssssSo..........',
      '...........ooSSSSSSoo...........',
      '.........qqqqoSSSSoqqqq.........',
      '....oooooqqqqoSSSSoqqqqooooo....',
      '...oppppPoaaabbbbbbaaaoPppppo...',
      '..opppppPoaaaaabbaaaaaoPpppppo..',
      '..oPPPPPPoaaaaabbaaaaaoPPPPPPo..',
      '.qqooooooaaaaaabbaaaaaaooooooqq.',
      'qqoaaaaaaaaaaaabbaaaaaaaaaaaaoqq',
      'qqobbbbbbbbbbbbbbbbbbbbbbbbbboqq',
      'qqoccccccccccccccccccccccccccoqq',
      'qqoccccccccccccccccccccccccccoqq',
      'qqoaaaaaaaaaaaaaaaaaaaaaaaaaaoqq',
      'qqoaaaaaaaaaaaaaaaaaaaaaaaaaaoqq',
    ],
  },

  // แม็ค: Ranger ฮู้ดเขียว ผ้าพันคอปิดปาก เห็นคิ้วหนากับตาเรียว มีลูกศรข้างหลัง
  //   q  ฮู้ด   z  ผ้าพันคอ   f  ขนหางลูกศร   w  ด้ามลูกศร
  max: {
    width: 32,
    height: 32,
    palette: {
      o: '#1b1210',
      E: '#1b1210',
      h: '#141414',
      r: '#141414',
      s: '#d9a07a',
      S: '#b07c58',
      a: '#3f7d3a',
      b: '#a8d57a',
      c: '#5a3a22',
      q: '#2f5e2c',
      z: '#5a3a22',
      f: '#c0392b',
      w: '#7a4a21',
    },
    rows: [
      '................................',
      '............oooooooo............',
      '..........ooqqqqqqqqoo..........',
      '.........oqqqqqqqqqqqqo.........',
      '........oqqqqqqqqqqqqqqo........',
      '.......oqqqqqqqqqqqqqqqqo.......',
      '......oqqqqqqqqqqqqqqqqqqo......',
      '......oqqqqqqqqssqqqqqqqqo......',
      '......oqqhhhhsssssshhhhqqo......',
      '......oqqhhhsssssssshhhqqo......',
      '......oqqhhsssssssssshhqqo......',
      '......oqqhsrrrrssrrrrshqqo......',
      '....ffoqqhsSSSssssSSSshqqo......',
      '...fwfoqqhsEEEssssEEEshqqo......',
      '...fwfoqqhsssssssssssshqqo......',
      '....w.oqqhssssSSSSsssshqqo......',
      '....w.oqqhzzzzzzzzzzzzhqqo......',
      '....w.oqqhzzzzzzzzzzzzhqqo......',
      '....w.oqqhzzzzzzzzzzzzhqqo......',
      '....w.oqqhzzzzzzzzzzzzhqqo......',
      '....w.oqqhozzzzzzzzzzohqqo......',
      '....w.oqqhhzzzzzzzzzzhhqqo......',
      '....w.oqqhh..zzzzzz..hhqqo......',
      '......ooqhaaaoSssSoaaahqoo......',
      '.....oaahhaaaabSSbaaaahhaao.....',
      '....oaaahhaaaabSSbaaaahhaaao....',
      '...oaaaahhaaaaabbaaaaahhaaaao...',
      '..oaaaaaaaaaaaaaaaaaaaaaaaaaao..',
      '..o' + 'c'.repeat(26) + 'o..',
      '..o' + 'c'.repeat(26) + 'o..',
      '..oaaaaaaaaaaaaaaaaaaaaaaaaaao..',
      '..oaaaaaaaaaaaaaaaaaaaaaaaaaao..',
    ],
  },
}

export const hasPortrait = (name) => Object.hasOwn(PORTRAITS, name ?? '')

// แปลงเป็นรายการสี่เหลี่ยม { x, y, w, color } เหมือน buildSprite ใน sprites.js
export function buildPortrait(name) {
  const { width, height, palette, rows } = PORTRAITS[name]
  const rects = []
  rows.forEach((line, y) => {
    let x = 0
    while (x < width) {
      const ch = line[x]
      if (!palette[ch]) {
        x++
        continue
      }
      let end = x
      while (end + 1 < width && line[end + 1] === ch) end++
      rects.push({ x, y, w: end - x + 1, color: palette[ch] })
      x = end + 1
    }
  })
  return { width, height, rects }
}
