import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UsernameProvider } from './contexts/UsernameContext';
import { RoleProvider } from './contexts/RoleContext.jsx'
import { PfpProvider } from './contexts/PfpContext.jsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UsernameProvider>
        <RoleProvider>
          <PfpProvider>
            <App />
          </PfpProvider>
        </RoleProvider>
      </UsernameProvider>
    </BrowserRouter>
  </StrictMode>,
)
