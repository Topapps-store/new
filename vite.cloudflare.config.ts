import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./client/src/components', import.meta.url)),
      '@lib': fileURLToPath(new URL('./client/src/lib', import.meta.url)),
      '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./client/src/hooks', import.meta.url)),
      '@pages': fileURLToPath(new URL('./client/src/pages', import.meta.url)),
      '@assets': fileURLToPath(new URL('./client/src/assets', import.meta.url)),
    }
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'client/index.html'),
      },
    },
    minify: true,
    sourcemap: false,
  }
})