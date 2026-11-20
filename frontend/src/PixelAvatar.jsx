import { useMemo } from 'react'
import { SPRITE_H, SPRITE_W, buildSprite } from './sprites.js'
import { buildPortrait, hasPortrait } from './portraits.js'

// ตัวละครพิกเซลตามอาชีพ (วาดด้วย SVG จากข้อมูลใน sprites.js)
// variant = ลำดับของผู้เล่นในปาร์ตี้ ใช้เลือกสีผิว/สีผม ให้คนที่อาชีพเดียวกันหน้าตาไม่ซ้ำ
// portrait = ชื่อภาพครึ่งตัวใน portraits.js (ถ้ามี ใช้แทนตัวละครตามอาชีพ)
export default function PixelAvatar({ dndClass, variant = 0, label, portrait }) {
  const { width, height, rects } = useMemo(
    () =>
      hasPortrait(portrait)
        ? buildPortrait(portrait)
        : { width: SPRITE_W, height: SPRITE_H, rects: buildSprite(dndClass, variant) },
    [dndClass, variant, portrait]
  )
  return (
    <svg
      className="pixel-sprite"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={hasPortrait(portrait) ? 'xMidYMax meet' : undefined}
      shapeRendering="crispEdges"
      role="img"
      aria-label={label}
    >
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height="1" fill={r.color} />
      ))}
    </svg>
  )
}
