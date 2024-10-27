import io from 'socket.io-client';
import { useEffect } from 'react';
import { displaySuccess } from '../Notify/Notify';
import { withUsernameAuth } from '../../contexts/UsernameContext';
import { clear } from '../../services/Services';

const socket = io('http://localhost:5243');

interface HeaderProps {
  setUsername: (username: string) => void;
  username: string;
}

const Notifications: React.FC<HeaderProps> = (props) => {
  const { setUsername, username, } = props;
  useEffect(() => {
    socket.emit('registerUsername', username);
  }, [username]);

  useEffect(() => {
    const handleNotification = (notification: string) => {
      displaySuccess("Received new friend request");
      console.log(notification);
    };

    socket.on('friendRequestNotification', handleNotification);

    return () => {
      socket.off('friendRequestNotification', handleNotification);
    };
  }, []);

  return (
    <div className='notifications-container'>
      <p>Notification Component</p>
      <button onClick={clear}>Clear pending requests</button>
    </div>);
};

export default withUsernameAuth(Notifications);
