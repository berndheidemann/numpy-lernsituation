import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import PyodideProvider from './components/pyodide/PyodideProvider'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <PyodideProvider>
        <App />
      </PyodideProvider>
    </HashRouter>
  </StrictMode>,
)
