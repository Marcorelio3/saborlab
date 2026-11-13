import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { ConfigWarning } from './components/ConfigWarning'
import { isConfigured } from './lib/supabase'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isConfigured ? <App /> : <ConfigWarning />}
  </StrictMode>,
)
