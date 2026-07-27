import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Tailwind rulează prin plugin-ul de Vite, nu prin PostCSS. Fără linia asta,
  // Vite caută în sus și preia postcss.config.js din folderul HUMANEX (alt proiect),
  // care cere @tailwindcss/postcss — pachet neinstalat aici.
  css: { postcss: {} },
})
