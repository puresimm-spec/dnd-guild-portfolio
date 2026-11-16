import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ตอนพัฒนา: ส่งคำขอ /api/* ต่อไปยัง backend (ไม่ต้องกังวลเรื่อง CORS)
    proxy: { '/api': 'http://localhost:3001' },
  },
})
