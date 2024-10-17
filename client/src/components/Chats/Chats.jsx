import './Chats.css';
import { useState } from 'react';
import { displayInfo, displaySuccess } from '../Notify/Notify';
import { searchUsers } from '../../services/Services'
import userPic from '../../assets/user.jpg';  //default
import pfp1 from '../../assets/1.png';  // avatar
import pfp2 from '../../assets/2.png';  // avatar
import pfp3 from '../../assets/3.png';  // avatar
import pfp4 from '../../assets/4.png';  // avatar

const Chats = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([
    { id: 1, username: 'Friend1', pfp: 'pfp1.jpg' },
    { id: 2, username: 'Friend2', pfp: 'pfp2.jpg' },
  ]);
  const [participants, setParticipants] = useState(['Me', 'Friend1']);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const MAX_FILE_SIZE_BYTES = 10000000;
  const images = [userPic, pfp1, pfp2, pfp3, pfp4];

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 4) {
      const res = await searchUsers(query);
      setSearchResults(res);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectUser = (user) => {
    console.log(user)
    setSelectedUser(user);
  };

  const handleAddFriend = () => {
    if (selectedUser) {
      setFriends([...friends, selectedUser]);
      setSearchQuery('');
      setSearchResults([]);
      setSelectedUser(null);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, { from: 'Me', content: message }]);
      setMessage('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= MAX_FILE_SIZE_BYTES) {
      displaySuccess('File sent:', file.name);
    } else {
      displayInfo('File size must be less than 10MB');
    }
  };

  const selectChat = (friend) => {
    setSelectedChat(friend);
    setParticipants(['Me', friend.username]);
  };

  return (
    <div className="chats-container">
      <div className="friends-search-container">
        <div className="search-add-container">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="search-result-item"
                  onClick={() => handleSelectUser(user)}
                >
                  <img src={images[user.profilePic]} alt="Profile" className="search-pfp" />
                  <span>{user.username}</span>
                  <button className="add-friend-btn" onClick={handleAddFriend} disabled={!selectedUser}>Add</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="friends-list-container">
          {friends.map((friend) => (
            <div key={friend.id} className="friend-item" onClick={() => selectChat(friend)}>
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
            className='input-message'
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage} className="send-btn">
            📨
          </button>
        </div>
      </div>

      <div className="participants-container">
        <h4>Participants</h4>
        <ul>
          {participants.map((participant, index) => (
            <li key={index} className="participant-item">
              <img src={selectedChat?.pfp || 'default-pfp.jpg'} alt="Profile" className="participant-pfp" />
              {participant}
            </li>
          ))}
        </ul>
      </div>
    </div >
  );
};

export default Chats;
