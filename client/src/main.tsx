import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UsernameProvider } from './contexts/UsernameContext';
import { RoleProvider } from './contexts/RoleContext.jsx'
import { PfpProvider } from './contexts/PfpContext.jsx'
import { NotificationProvider } from './contexts/NotificationContext.js'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UsernameProvider>
        <RoleProvider>
          <PfpProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </PfpProvider>
        </RoleProvider>
      </UsernameProvider>
    </BrowserRouter>
  </StrictMode>,
)
