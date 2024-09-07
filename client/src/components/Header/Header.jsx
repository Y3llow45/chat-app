import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import './Header.css';
import logo from '../../assets/logo.png';
import userPic from '../../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <header className="header-container">
      <div className="logo">
        <NavLink to="/">
          <img src={logo} alt="Logo" />
        </NavLink>
      </div>

      {/* Mid-right links */}
      <nav className="nav-links">
        <NavLink to="/chats">Chats</NavLink>
        <a href="https://github.com/your-repo-link" target="_blank" rel="noopener noreferrer">
          Github
        </a>
        <NavLink to="/register">Register</NavLink>
        <NavLink to="/login">Login</NavLink>
      </nav>

      {/* Profile Picture and Dropdown */}
      <div className="user-profile" onClick={toggleDropdown}>
        <img src={userPic} alt="User Profile" className="profile-pic" />
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <NavLink to="/settings">Settings</NavLink>
          </div>
        )}
      </div>

      {/* Burger Menu on the very right */}
      <Menu
        isOpen={isMenuOpen}
        onStateChange={({ isOpen }) => setIsMenuOpen(isOpen)}
        menuClassName="slide-menu"
        right
      >
        <div className="hamburger-links">
          <NavLink to="/" className="nav-link-hamburger" onClick={toggleMenu}>Home</NavLink>
          <NavLink to="/chats" className="nav-link-hamburger" onClick={toggleMenu}>Chats</NavLink>
          <a href="https://github.com/your-repo-link" className="nav-link-hamburger" onClick={toggleMenu} target="_blank" rel="noopener noreferrer">Github</a>
          <NavLink to="/register" className="nav-link-hamburger" onClick={toggleMenu}>Register</NavLink>
          <NavLink to="/login" className="nav-link-hamburger" onClick={toggleMenu}>Login</NavLink>
        </div>
      </Menu>
    </header>
  );
};

export default Header;
