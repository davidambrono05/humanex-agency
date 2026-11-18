import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Analytics } from '@vercel/analytics/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* Vercel Web Analytics: câți vizitatori are site-ul și de unde vin. Fără cookie-uri. */}
    <Analytics />
  </StrictMode>,
)
