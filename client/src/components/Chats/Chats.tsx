import './Chats.css'
import { useState, ChangeEvent } from 'react'
import { displayError, displayInfo, displaySuccess } from '../Notify/Notify'
import { searchUsers, sendFriendRequest } from '../../services/Services'
import userPic from '../../assets/user.jpg' // default
import pfp1 from '../../assets/1.png' // avatar
import pfp2 from '../../assets/2.png' // avatar
import pfp3 from '../../assets/3.png' // avatar
import pfp4 from '../../assets/4.png' // avatar
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface Friend {
  id: number;
  username: string;
  pfp: string;
}

interface Message {
  from: string;
  content: string;
}

interface User {
  _id: string;
  username: string;
  profilePic: number;
}

const Chats: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<string[]>(['Me', 'Friend1']);
  const [selectedChat, setSelectedChat] = useState<Friend | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const friends = useSelector((state: RootState) => state.friends.friends);
  const images = [userPic, pfp1, pfp2, pfp3, pfp4]

  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length >= 4) {
      const res = await searchUsers(query)
      setSearchResults(res)
    } else {
      setSearchResults([])
    }
  }

  const handleAddFriend = (username: string) => {
    sendFriendRequest(username).then((response) => {  //Object is possibly 'undefined'.
      if (response.message === 'Friend request sent') {
        setSearchQuery('')
        setSearchResults([])
        displaySuccess('Friend request sent')
      } else if (response.message === 'Already friends or request pending') {
        displayInfo('Already friends or request pending')
      } else {
        displayError('User not found or server error')
      }
    })
  }

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, { from: 'Me', content: message }])
      setMessage('')
    }
  }

  const selectChat = (friend: Friend) => {
    setSelectedChat(friend)
    setParticipants(['Me', friend.username])
  }

  return (
    <div className='chats-container'>
      <div className='friends-search-container'>
        <div className='search-add-container'>
          <input
            type='text'
            placeholder='Search users...'
            value={searchQuery}
            onChange={handleSearchChange}
            className='search-input'
          />
          {searchResults.length > 0 && (
            <div className='search-dropdown'>
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className='search-result-item'
                >
                  <img src={images[user.profilePic]} alt='Profile' className='search-pfp' />
                  <span>{user.username}</span>
                  <button className='add-friend-btn' onClick={() => handleAddFriend(user.username)}>Add</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='friends-list-container'>
          {friends.map((friend) => (
            <div key={friend.id} className='friend-item' onClick={() => selectChat(friend)}>
              <img src={friend.pfp} alt='Profile' className='friend-pfp' />
              <span>{friend.username}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='chat-container'>
        <div className='messages-container'>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.from === 'Me' ? 'my-message' : 'friend-message'}`}>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
        <div className='input-container'>
          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className='input-message'
            placeholder='Type a message...'
          />
          <button onClick={handleSendMessage} className='send-btn'>
            📨
          </button>
        </div>
      </div>

      <div className='participants-container'>
        <h4>Participants</h4>
        <ul>
          {participants.map((participant, index) => (
            <li key={index} className='participant-item'>
              <img src={selectedChat?.pfp || 'default-pfp.jpg'} alt='Profile' className='participant-pfp' />
              {participant}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Chats
