import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { useEffect } from 'react';
import { displaySuccess } from '../Notify/Notify';
import { withUsernameAuth } from '../../contexts/UsernameContext';
import { clear } from '../../services/Services';

interface CustomSocket extends Socket {
  hasRegistered?: boolean;
}

const socket: CustomSocket = io('http://localhost:5243');

interface HeaderProps {
  setUsername: (username: string) => void;
  username: string;
}

const Notifications: React.FC<HeaderProps> = (props) => {
  const { setUsername, username, } = props;
  useEffect(() => {
    if (!socket.hasRegistered) {
      socket.emit('registerUsername', username);
      socket.hasRegistered = true;
    }
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
