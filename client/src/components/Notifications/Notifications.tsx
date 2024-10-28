import { withUsernameAuth } from '../../contexts/UsernameContext';
import { clear } from '../../services/Services';

interface HeaderProps {
  setUsername: (username: string) => void;
  username: string;
}

const Notifications: React.FC<HeaderProps> = () => {
  return (
    <div className='notifications-container'>
      <p>Notification Component</p>
      <button onClick={clear}>Clear pending requests</button>
    </div>);
};

export default withUsernameAuth(Notifications);
