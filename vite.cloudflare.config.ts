import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: './client', // Set the project root in the client folder
  plugins: [react()],
  resolve: {
    alias: {
      // Using path.resolve for more consistent path resolution in Cloudflare environment
      '@': path.resolve(__dirname, 'client/src/components'),
      '@components': path.resolve(__dirname, 'client/src/components'),
      '@lib': path.resolve(__dirname, 'client/src/lib'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@hooks': path.resolve(__dirname, 'client/src/hooks'),
      '@pages': path.resolve(__dirname, 'client/src/pages'),
      '@assets': path.resolve(__dirname, 'client/src/assets'),
      // Add explicit path resolution for UI components to avoid the duplicated path error
      'components': path.resolve(__dirname, 'client/src/components')
    }
  },
  build: {
    outDir: '../dist', // Output folder relative to root (client)
    emptyOutDir: true,
    minify: true,
    sourcemap: false,
  }
})