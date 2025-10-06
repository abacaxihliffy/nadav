import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal Vite config — do NOT set css.postcss plugins here.
export default defineConfig({
  plugins: [react()],
  base: '/nadav/',
})
