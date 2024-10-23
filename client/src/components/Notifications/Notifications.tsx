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
  socket.emit('registerUsername', username);

  useEffect(() => {
    socket.on('friendRequestNotification', (notification) => {
      displaySuccess("Received new friend request")
      console.log(notification)
    });
  }, []);

  return <div className='notifications-container'>Notification Component</div>;
};

export default withUsernameAuth(Notifications);
