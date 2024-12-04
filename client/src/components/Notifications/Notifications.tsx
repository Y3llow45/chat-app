import { withUsernameAuth } from '../../contexts/UsernameContext';
import { acceptFriendRequest } from '../../services/Services';
import { useNotification } from '../../contexts/NotificationContext';

interface HeaderProps {
  setUsername: (username: string) => void;
  username: string;
  isAuthenticated: boolean;
}

const Notifications: React.FC<HeaderProps> = () => {
  const { notifications, removeNotification } = useNotification();

  const acceptFriend = (username: string, id: string) => {
    const updatedFriends = [...JSON.parse(localStorage.getItem('friends') || '[]'), username];
    localStorage.setItem('friends', JSON.stringify(updatedFriends));
    removeNotification(id);
    acceptFriendRequest(username)
  };

  return (
    <div className='notifications-container'>
      <p>Notification Component</p>
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
