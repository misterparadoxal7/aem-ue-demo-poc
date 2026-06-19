import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3100,
    proxy: {
      '/content': {
        target: 'https://localhost:8443',
        secure: false,
        changeOrigin: true
      },
      '/adobe': {
        target: 'https://localhost:8443',
        secure: false,
        changeOrigin: true
      },
      '/etc.clientlibs': {
        target: 'https://localhost:8443',
        secure: false,
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    manifest: true
  }
})
