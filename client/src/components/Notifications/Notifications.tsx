import io from 'socket.io-client';
import { useEffect } from 'react';
import { displaySuccess } from '../Notify/Notify';

const socket = io('http://localhost:5243');

const Notifications = () => {
  useEffect(() => {
    socket.on('friendRequestNotification', (notification) => {
      displaySuccess("Received new friend request")
      console.log(notification)
    });
  }, []);

  return <div className='notifications-container'>Notification Component</div>;
};

export default Notifications;
