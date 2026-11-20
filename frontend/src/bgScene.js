// ข้อมูลฉากพื้นหลังห้องโถง (พิกัดเป็นพิกเซลบนรูป bg.jpg ขนาด 1920 x 1078)
// รูปใน public/bg/ สร้างจาก bg.jpg: ตัดโคมแขวนกับขนนกออกเป็นชิ้น (sprite-*.png) แล้ววาดพื้นหลังข้างใต้ใหม่ (clean.jpg)
// ชิ้นที่ตัดออกจะถูกวางกลับที่เดิมแล้วแกว่งรอบจุดแขวน (ox, oy) ส่วนแสง (gx, gy) วูบวาบตามโคม
export const SCENE_W = 1920
export const SCENE_H = 1078

// โคมแขวน: ตำแหน่งชิ้น (x, y, w, h), จุดแขวนบนเชือก (ox, oy), จุดกลางแสง (gx, gy) เทียบกับมุมบนซ้ายของชิ้น
// amp = มุมแกว่ง (องศา), dur = ครึ่งรอบ (วินาที), delay = เริ่มไม่พร้อมกัน, flick = รอบไฟวูบวาบ
export const LANTERNS = [
  { id: 'a', x: 732, y: 5, w: 52, h: 179, ox: 22, oy: 5, gx: 25, gy: 137, amp: 1.8, dur: 5.2, delay: 0, flick: 2.3 },
  { id: 'b', x: 871, y: 0, w: 50, h: 184, ox: 19, oy: 0, gx: 24, gy: 132, amp: 1.6, dur: 5.8, delay: -1.37, flick: 2.77 },
  { id: 'c', x: 902, y: 0, w: 57, h: 52, ox: 28, oy: -10, gx: 28, gy: 21, amp: 2.4, dur: 4.4, delay: -2.74, flick: 3.24 },
  { id: 'd', x: 991, y: 15, w: 43, h: 186, ox: 15, oy: 5, gx: 21, gy: 143, amp: 1.7, dur: 5.5, delay: -4.11, flick: 3.71 },
  { id: 'e', x: 1019, y: 90, w: 53, h: 215, ox: 21, oy: 5, gx: 26, gy: 163, amp: 2.2, dur: 4.8, delay: -0.68, flick: 4.18 },
  { id: 'f', x: 1102, y: 0, w: 75, h: 102, ox: 37, oy: -20, gx: 37, gy: 46, amp: 1.4, dur: 6.4, delay: -0.45, flick: 2.75 },
  { id: 'g', x: 1231, y: 20, w: 59, h: 260, ox: 21, oy: 5, gx: 29, gy: 191, amp: 1.2, dur: 6.8, delay: -1.42, flick: 3.22 },
  { id: 'h', x: 1151, y: 115, w: 51, h: 237, ox: 19, oy: 5, gx: 25, gy: 187, amp: 2.0, dur: 5.0, delay: -4.59, flick: 3.69 },
  { id: 'i', x: 1419, y: 0, w: 43, h: 74, ox: 21, oy: -10, gx: 21, gy: 32, amp: 2.2, dur: 4.6, delay: -1.76, flick: 4.16 },
  { id: 'k', x: 1759, y: 0, w: 53, h: 209, ox: 23, oy: 0, gx: 26, gy: 156, amp: 1.5, dur: 6.0, delay: -0.33, flick: 2.73 },
  { id: 'l', x: 1861, y: 20, w: 51, h: 152, ox: 25, oy: 5, gx: 25, gy: 116, amp: 1.9, dur: 5.3, delay: -3.1, flick: 3.2 },
  { id: 'm', x: 1814, y: 0, w: 50, h: 74, ox: 23, oy: -10, gx: 24, gy: 36, amp: 2.3, dur: 4.5, delay: -1.57, flick: 3.67 },
]
// ขนนกในขวดหมึกบนเคาน์เตอร์ โยกรอบปลายที่ปักในขวด
export const QUILL = { x: 1521, y: 713, w: 148, h: 178, ox: 28, oy: 171 }

// ฝุ่นในลำแสงหน้าต่าง 3 บาน และหิ่งห้อยใต้ต้นไม้ (ค่าตายตัว ไม่สุ่ม ทุกครั้งเหมือนเดิม)
const SHAFTS = [
  [700, 900, 470, 800],
  [930, 1150, 470, 820],
  [1190, 1320, 450, 740],
]
export const SPECKS = [
  ...Array.from({ length: 30 }, (_, i) => {
    const [x0, x1, y0, y1] = SHAFTS[i % 3]
    return {
      kind: 'dust',
      x: x0 + ((i * 53) % (x1 - x0)),
      y: y0 + ((i * 71) % (y1 - y0)),
      size: 2 + (i % 3),
      dur: 14 + (i % 7) * 2,
      delay: -((i * 1.7) % 20),
      dx: ((i * 17) % 40) - 20,
      dy: -20 - (i % 5) * 8,
    }
  }),
  ...Array.from({ length: 18 }, (_, i) => ({
    kind: 'fly',
    x: 700 + ((i * 97) % 1150),
    y: 20 + ((i * 61) % 260),
    size: 3 + (i % 2),
    dur: 9 + (i % 5) * 2,
    delay: -((i * 1.3) % 12),
    dx: ((i * 29) % 60) - 30,
    dy: ((i * 13) % 30) - 15,
  })),
]

// รูปที่ต้องโหลดครบก่อนเปิดโหมด "ฉากขยับ" (ระหว่างรอใช้รูปเดิม bg.jpg ไปก่อน)
export const LIVE_ASSETS = ['/bg/clean.jpg', ...LANTERNS.map((l) => `/bg/sprite-${l.id}.png`), '/bg/sprite-quill.png']
