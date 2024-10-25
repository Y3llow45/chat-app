import io from 'socket.io-client';
import { useEffect } from 'react';
import { displaySuccess } from '../Notify/Notify';
import { withUsernameAuth } from '../../contexts/UsernameContext';

const socket = io('http://localhost:5243');


interface HeaderProps {
  setUsername: (username: string) => void;
  //setUserRole: (role: string) => void;
  username: string;
  //userRole: string;
  //userPfp: number | null;
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

  return <div className='notifications-container'>Notification Component</div>;
};

export default withUsernameAuth(Notifications);
