import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'
import { BrowserRouter } from 'react-router-dom'
import { UsernameProvider } from './contexts/UsernameContext.js';
import { RoleProvider } from './contexts/RoleContext.js'
import { PfpProvider } from './contexts/PfpContext.js'
import { NotificationProvider } from './contexts/NotificationContext.js'
import { Provider } from 'react-redux'
import { store } from './store/index.js'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UsernameProvider>
        <RoleProvider>
          <PfpProvider>
            <NotificationProvider>
              <Provider store={store}>
                <App />
              </Provider>
            </NotificationProvider>
          </PfpProvider>
        </RoleProvider>
      </UsernameProvider>
    </BrowserRouter>
  </StrictMode>,
)
