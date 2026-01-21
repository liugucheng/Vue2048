import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // GitHub Pages deployment
  base: process.env.NODE_ENV === 'production' ? '/vue2048/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
          router: ['vue-router'],
          store: ['pinia']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
})