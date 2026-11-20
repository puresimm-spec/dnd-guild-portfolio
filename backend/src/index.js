// จุดเริ่มต้นของ Backend: เตรียมฐานข้อมูล แล้วเปิดเซิร์ฟเวอร์
// เส้นทาง API ทั้งหมดอยู่ใน app.js (แยกไว้ให้เทสต์เรียกใช้ได้)
import { setup } from './db.js';
import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 3001);
setup()
  .then(() => createApp().listen(port, () => console.log(`Server is running on port ${port}`)))
  .catch((err) => {
    console.error('เตรียมฐานข้อมูลไม่สำเร็จ:', err);
    process.exit(1);
  });
