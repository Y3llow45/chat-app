import { withUsernameAuth } from '../../contexts/UsernameContext';
import { acceptFriendRequest, clear } from '../../services/Services';
import { useNotification } from '../../contexts/NotificationContext';

interface HeaderProps {
  setUsername: (username: string) => void;
  username: string;
}

const Notifications: React.FC<HeaderProps> = () => {
  const { notifications, removeNotification } = useNotification();

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
              <button onClick={() => acceptFriendRequest(notification.from)}>Accept</button>
            </div>
          ))
        ) : (
          <p>No new notifications</p>
        )}
      </div>
    </div>);
};

export default withUsernameAuth(Notifications);
