import './Header.css';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import logo from '../../assets/logo.png';
import userPic from '../../assets/user.jpg';  //default
import pfp1 from '../../assets/1.png';  // avatar
import pfp2 from '../../assets/2.png';  // avatar
import pfp3 from '../../assets/3.png';  // avatar
import pfp4 from '../../assets/4.png';  // avatar
import { withUsernameAuth } from '../../contexts/UsernameContext';  // context
import { withRoleAuth } from '../../contexts/RoleContext';  // context
import { withPfpAuth } from '../../contexts/PfpContext';  // context
import { useNotification } from '../../contexts/NotificationContext';
import { displaySuccess } from '../Notify/Notify';  // notifications
import socket from '../../services/socket';

const images = [userPic, pfp1, pfp2, pfp3, pfp4];

interface HeaderProps {
  setUsername: (username: string) => void;
  setUserRole: (role: string) => void;
  username: string;
  userPfp: number | null;
}

const Header: React.FC<HeaderProps> = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setUsername, setUserRole, username, userPfp } = props;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const [hasNotification, setHasNotification] = useState(false);
  const { addNotification } = useNotification();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('Guest');
    setUserRole('guest');
    displaySuccess('Logged out');
  };

  const clearNotifications = () => {
    setHasNotification(false);
  }

  useEffect(() => {
    if (username) {
      console.log(`Registered and username: ${username}`)
      socket.emit('registerUsername', username)
    }

    const handleFriendRequestNotification = (notification: { from: string; }) => {
      console.log(`Recieved new notification in Notifications component`)
      addNotification({
        id: `${Date.now()}-${notification.from}`,
        message: `${notification.from} sent you a friend request.`,
        from: notification.from,
      });
      displaySuccess('Received a friend request')
      setHasNotification(true);
    };

    socket.off('friendRequestNotification');

    socket.on('friendRequestNotification', handleFriendRequestNotification);

    return () => {
      socket.off('friendRequestNotification', handleFriendRequestNotification);
    };
  }, [username]);


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
        {(userPfp !== undefined && userPfp !== null) ?
          <img src={images[userPfp]} alt="User Profile" className={`profile-pic ${hasNotification ? 'notifications' : ''}`} /> :
          <img src={userPic} alt="User Profile" className={`profile-pic ${hasNotification ? 'notifications' : ''}`} />
        }

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <NavLink to="/settings" className="dropdown-link">Settings</NavLink>
            <br />
            <NavLink to="/notifications" className="dropdown-link" onClick={clearNotifications}>Notifications</NavLink>
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
