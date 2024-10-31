import { withUsernameAuth } from '../../contexts/UsernameContext';
import { acceptFriendRequest, clear } from '../../services/Services';

interface HeaderProps {
  setUsername: (username: string) => void;
  username: string;
}

const Notifications: React.FC<HeaderProps> = () => {
  return (
    <div className='notifications-container'>
      <p>Notification Component</p>
      <button onClick={clear}>Clear pending requests</button>
      <div className='nots'>
        <p>fr req from j</p>
        <button onClick={() => acceptFriendRequest}></button>
      </div>
    </div>);
};

export default withUsernameAuth(Notifications);
