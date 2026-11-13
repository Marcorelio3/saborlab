import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// O site está em https://marcorelio3.github.io/saborlab/
// O base deve ser o nome do repositório para o HashRouter funcionar
export default defineConfig({
  base: '/saborlab/',
  plugins: [react()]
})