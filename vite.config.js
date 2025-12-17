import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './src',  // ahora sí es correcto
  build: {
    outDir: '../dist'
  }
})
