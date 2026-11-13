import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' + HashRouter: o site funciona em qualquer subpasta do GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
})
