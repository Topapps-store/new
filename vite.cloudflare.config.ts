import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: './client', // Establecer la raíz del proyecto en la carpeta client
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
    }
  },
  build: {
    outDir: '../dist', // La carpeta de salida relativa a la raíz (client)
    emptyOutDir: true,
    minify: true,
    sourcemap: false,
  }
})