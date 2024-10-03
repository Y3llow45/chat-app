import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import './Header.css';
import logo from '../../assets/logo.png';
import userPic from '../../assets/user.jpg';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <header className="header-container">
      <div className="logo">
        <NavLink to="/" style={{ "display": "flex" }}>
          <img src={logo} alt="Logo" className="logo-img" />
          <h2 className='logo-text'>Chato</h2>
        </NavLink>
      </div>

      <nav className="nav-links">
        <NavLink to="/chats" className="nav-link">Chats</NavLink>
        <a href="https://github.com/Y3llow45/chat-app" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
        <NavLink to="/signUp" className="nav-link">SignUp</NavLink>
        <NavLink to="/signIn" className="nav-link">SignIn</NavLink>
      </nav>

      <div className="profile-container" onClick={toggleDropdown}>
        <img src={userPic} alt="User Profile" className="profile-pic" />
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <NavLink to="/settings" className="dropdown-link">Settings</NavLink>
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
    </header >
  );
};

export default Header;
