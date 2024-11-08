import { withUsernameAuth } from '../../contexts/UsernameContext';
import { acceptFriendRequest, clear } from '../../services/Services';
import { useNotification } from '../../contexts/NotificationContext';
import { useDispatch } from 'react-redux';
import { addFriend } from '../../store/friendsSlice';
import userPic from '../../assets/user.jpg';  //default avatar

interface HeaderProps {
  setUsername: (username: string) => void;
  username: string;
  isAuthenticated: boolean;
}

const Notifications: React.FC<HeaderProps> = () => {
  const { notifications, removeNotification } = useNotification();
  const dispatch = useDispatch();

  const acceptFriend = (username: string, id: string) => {
    dispatch(addFriend({ id: Date.now(), username, pfp: userPic }));
    removeNotification(id);
    acceptFriendRequest(username)
  };

  return (
    <div className='notifications-container'>
      <p>Notification Component</p>
      <button onClick={clear}>Clear pending requests</button>
      <div className='notifications-list'>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className='notification-item'>
              <p>{notification.message}</p>
              <button onClick={() => removeNotification(notification.id)}>Dismiss</button>
              <button onClick={() => acceptFriend(notification.from, notification.id)}>Accept</button>
            </div>
          ))
        ) : (
          <p>No new notifications</p>
        )}
      </div>
    </div>);
};

export default withUsernameAuth(Notifications);
