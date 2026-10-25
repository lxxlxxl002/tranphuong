import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), ViteImageOptimizer({ png: { quality: 82 }, jpg: { quality: 80 }, jpeg: { quality: 80 } })],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router'],
          query: ['@tanstack/react-query', 'zustand', 'zod'],
          charts: ['recharts'],
          pdf: ['jspdf', 'html2canvas'],
          excel: ['exceljs']
        }
      }
    }
  }
})