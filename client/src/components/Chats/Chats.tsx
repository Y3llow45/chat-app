import './Chats.css'
import { useState, ChangeEvent, useEffect } from 'react'
import { displayError, displayInfo, displaySuccess } from '../Notify/Notify'
import { getFriends, searchUsers, sendFriendRequest } from '../../services/Services'
import userPic from '../../assets/user.jpg' // default
import pfp1 from '../../assets/1.png' // avatar
import pfp2 from '../../assets/2.png' // avatar
import pfp3 from '../../assets/3.png' // avatar
import pfp4 from '../../assets/4.png' // avatar
import socket from '../../services/socket'
import { withUsernameAuth } from '../../contexts/UsernameContext'

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

interface ChatsProps {
  username: string;
}

const Chats: React.FC<ChatsProps> = (props) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ [key: string]: Message[] }>({});
  const [selectedChat, setSelectedChat] = useState<Friend | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const images = [userPic, pfp1, pfp2, pfp3, pfp4]
  const { username } = props;

  useEffect(() => {
    const fetchFriends = async () => {
      const data = await getFriends();
      if (data.friends) {
        setFriends(data.friends);
        localStorage.setItem('friends', JSON.stringify(data.friends));
      }
    };

    fetchFriends();

    socket.on('receiveMessage', ({ from, content }) => {
      setChatHistory((prevChats) => ({
        ...prevChats,
        [from]: [...(prevChats[from] || []), { from, content }],
      }));
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const message: Message = { from: username, content: newMessage.trim() }

      setChatHistory((prevChats) => ({
        ...prevChats,
        [selectedChat.username]: [...(prevChats[selectedChat.username] || []), message],
      }));
      socket.emit('sendMessage', { from: username, to: selectedChat.username, content: newMessage.trim() });
      setNewMessage('');
    }
  };

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

  const handleAddFriend = async (username: string) => {
    const data = await sendFriendRequest(username)
    if (data.message === "Friend request sent") {
      setSearchQuery('')
      setSearchResults([])
      displaySuccess('Friend request sent')
    } else if (data.message === 'Already friends or request pending') {
      displayInfo('Already friends or request pending')
    } else {
      displayError('User not found or server error')
    }
  }

  const selectChat = (friend: Friend) => {
    setSelectedChat(friend);
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
              {searchResults.map((user, index) => (
                <div key={user._id || index} className='search-result-item'>
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
        {selectedChat ? (
          <>
            <div className='messages-container'>
              {(chatHistory[selectedChat.username] || []).map((msg, index) => (
                <div key={index} className={`message ${msg.from === username ? 'my-message' : 'friend-message'}`}>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
            <div className='input-container'>
              <input
                type='text'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className='input-message'
                placeholder='Type a message...'
              />
              <button onClick={handleSendMessage} className='send-btn'>
                📨
              </button>
            </div>
          </>
        ) : (
          <p>Select a chat to start messaging.</p>
        )}
      </div>
    </div>
  )
}

export default withUsernameAuth(Chats)
