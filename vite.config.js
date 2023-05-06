import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
