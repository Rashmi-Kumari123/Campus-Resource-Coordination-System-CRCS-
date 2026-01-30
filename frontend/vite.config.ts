import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API calls to the gateway so the browser makes same-origin requests (no CORS).
      '/auth': { target: 'http://localhost:6000', changeOrigin: true },
      '/users': { target: 'http://localhost:6000', changeOrigin: true },
      '/resources': { target: 'http://localhost:6000', changeOrigin: true },
      '/bookings': { target: 'http://localhost:6000', changeOrigin: true },
      '/api-docs': { target: 'http://localhost:6000', changeOrigin: true },
    },
  },
})
