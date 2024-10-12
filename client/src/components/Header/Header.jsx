import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import './Header.css';
import logo from '../../assets/logo.png';
import pic1 from '../../assets/1.png';
import pic2 from '../../assets/2.png';
import pic3 from '../../assets/3.png';
import pic4 from '../../assets/4.png';
import { withUsernameAuth } from '../../contexts/UsernameContext';
import { withRoleAuth } from '../../contexts/RoleContext';
import { withPfpAuth } from '../../contexts/PfpContext';
import { displaySuccess } from '../Notify/Notify';

const Header = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setUsername, setUserRole, username, userRole, userPfp } = props;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('Guest');
    setUserRole('guest');
    displaySuccess('Logged out');
  };

  return (
    <header className="header-container">
      <div className="logo">
        <NavLink to="/" style={{ display: 'flex' }}>
          <img src={logo} alt="Logo" className="logo-img" />
          <h2 className="logo-text">Chato</h2>
        </NavLink>
      </div>

      <nav className="nav-links">
        <NavLink to="/chats" className="nav-link">Chats</NavLink>
        <a href="https://github.com/Y3llow45/chat-app" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
        <NavLink to="/signUp" className="nav-link">SignUp</NavLink>
        <NavLink to="/signIn" className="nav-link">SignIn</NavLink>
      </nav>

      <div className='nav-user'>
        {username && username !== "Guest" ? (
          <p className='nav-user-wellcome blue'>{username}</p>
        ) : (
          <p className='nav-user-wellcome'>Guest</p>
        )}
      </div>

      <div className="profile-container" onClick={toggleDropdown}>
        <img src={`pic${userPfp}`} alt="User Profile" className="profile-pic" />

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <NavLink to="/settings" className="dropdown-link">Settings</NavLink>
            <br />
            <NavLink to="/signIn" className="dropdown-link" onClick={logout}>Log out</NavLink>
          </div>
        )}
      </div>

      <Menu
        isOpen={isMenuOpen}
        onStateChange={({ isOpen }) => setIsMenuOpen(isOpen)}
        menuClassName="slide-menu"
        right
      >
        <NavLink to="/" className="nav-link-hamburger" onClick={toggleMenu}>Home</NavLink>
        <NavLink to="/chats" className="nav-link-hamburger" onClick={toggleMenu}>Chats</NavLink>
        <a href="https://github.com/your-repo-link" className="nav-link-hamburger" onClick={toggleMenu}>GitHub</a>
        <NavLink to="/register" className="nav-link-hamburger" onClick={toggleMenu}>Register</NavLink>
        <NavLink to="/login" className="nav-link-hamburger" onClick={toggleMenu}>Login</NavLink>
      </Menu>
    </header>
  );
};

export default withPfpAuth(withUsernameAuth(withRoleAuth(Header)));