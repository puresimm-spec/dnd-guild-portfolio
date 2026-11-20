// หน้าที่ไปได้จากเมนูของ Guild Keeper (แทนแถบแท็บเดิม) ใช้ทั้งในลานต้อนรับและปุ่มมุมซ้ายบน
export const DESTINATIONS = [
  { id: 'lobby', href: '#/lobby', label: 'lb_title' },
  { id: 'party', href: '#/party', label: 'nav_hall' },
  { id: 'chat', href: '#/chat', label: 'nav_chat' },
  { id: 'training', href: '#/training', label: 'nav_training' },
  { id: 'developer', href: '#/developer', label: 'nav_dev' },
  { id: 'present', href: '#/present', label: 'nav_present' },
]
// หน้าย่อยนับเป็นส่วนของหน้าแม่: โปรไฟล์สมาชิก -> ห้องโถง, หน้าวางแผนตัวละคร -> ห้องฝึก build
export const sectionOf = (routeName) => ({ member: 'party', character: 'training' })[routeName] ?? routeName
