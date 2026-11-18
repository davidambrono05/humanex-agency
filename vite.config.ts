import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Tailwind rulează prin plugin-ul de Vite, nu prin PostCSS. Fără linia asta,
  // Vite caută în sus și preia postcss.config.js din folderul HUMANEX (alt proiect),
  // care cere @tailwindcss/postcss — pachet neinstalat aici.
  css: { postcss: {} },
  // Două pagini: site-ul (index.html) și formularul din reclame (formular.html,
  // servit la humanex.space/formular datorită cleanUrls din vercel.json).
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        formular: resolve(import.meta.dirname, 'formular.html'),
      },
    },
  },
})
