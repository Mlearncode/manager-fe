import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    proxy: {
      "/api": {
        target: "http://localhost:3000"
      }
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
