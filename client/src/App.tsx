import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home/Home';
import Header from './components/Header/Header';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import Chats from './components/Chats/Chats';
import Settings from './components/Settings/Settings';
import Footer from './components/Footer/Footer';
import { UsernameProvider } from './contexts/UsernameContext';
import { RoleProvider } from './contexts/RoleContext';
import { PfpProvider } from './contexts/PfpContext';
import Notifications from './components/Notifications/Notifications';

function App() {
  return (
    <PfpProvider>
      <UsernameProvider>
        <RoleProvider>
          <div className="App">
            <ToastContainer
              className="add-toast-container"
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick={true}
              rtl={false}
              pauseOnFocusLoss={false}
              draggable={false}
              pauseOnHover={false}
              theme="light"
            />
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
            <Footer />
          </div>
        </RoleProvider>
      </UsernameProvider>
    </PfpProvider>
  )
}

export default App;
