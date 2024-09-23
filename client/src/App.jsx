import './App.css'
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home/Home'
import Header from './components/Header/Header';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Chats from './components/Chats/Chats';
import Footer from './components/Footer/Footer';

function App() {
  return (
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
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;