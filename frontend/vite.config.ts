import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  // ADD THESE NEW SETTINGS:
  resolve: {
    dedupe: ['react', 'react-dom'] // Crucial for React 19
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Ensures single instance
    esbuildOptions: {
      target: 'es2020' // Better compatibility
    }
  },
  server: {
    fs: {
      strict: false // Helps with module resolution
    }
  }
})