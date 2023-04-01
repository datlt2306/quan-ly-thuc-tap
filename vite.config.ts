import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const PORT = process.env.VITE_DEFAULT_PORT;
const API = process.env.VITE_REACT_APP_API

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: PORT as unknown as number || 3000,
    proxy: {
      '/api': {
        target: API,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
