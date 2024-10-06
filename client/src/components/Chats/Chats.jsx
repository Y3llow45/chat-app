import { useState } from 'react';
import { displayInfo } from '../Notify/Notify';
import './Chats.css';

const Chats = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([
    { id: 1, username: 'Friend1', pfp: 'pfp1.jpg' },
    { id: 2, username: 'Friend2', pfp: 'pfp2.jpg' },
  ]);
  const [participants, setParticipants] = useState(['Me', 'Friend1']);
  const [groupName, setGroupName] = useState(null);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, { from: 'Me', content: message }]);
      setMessage('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      console.log('File sent:', file.name);
    } else {
      displayInfo('File size must be less than 10MB');
    }
  };

  return (
    <div className="chats-container">
      <div className="friends-search-container">
        <div className="search-add-container">
          <input type="text" placeholder="Search users..." />
          <button>Add Friend</button>
        </div>
        <div className="friends-list-container">
          {friends.map((friend) => (
            <div key={friend.id} className="friend-item">
              <img src={friend.pfp} alt="Profile" className="friend-pfp" />
              <span>{friend.username}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.from === 'Me' ? 'my-message' : 'friend-message'}`}>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
        <div className="input-container">
          <label htmlFor="file-upload" className="file-upload">
            📎
            <input
              type="file"
              id="file-upload"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>

      <div className="participants-container">
        <h4>Participants</h4>
        <ul>
          {participants.map((participant, index) => (
            <li key={index}>{participant}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chats;
