import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    // Three.js is isolated in a near-viewport async chunk; the entry bundle has
    // a separate 150 KB gzip budget enforced by scripts/check-bundle.mjs.
    chunkSizeWarningLimit: 550,
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
