import './Chats.css'
import { useState, ChangeEvent, useEffect } from 'react'
import { displayError, displayInfo, displaySuccess, displayWarning } from '../Notify/Notify'
import { getChatHistory, getFriends, getFriendsPublicKey, searchUsers, sendFriendRequest } from '../../services/Services'
import userPic from '../../assets/user.jpg' // default
import pfp1 from '../../assets/1.png' // avatar
import pfp2 from '../../assets/2.png' // avatar
import pfp3 from '../../assets/3.png' // avatar
import pfp4 from '../../assets/4.png' // avatar
import socket from '../../services/socket'
import { withUsernameAuth } from '../../contexts/UsernameContext'
import forge from 'node-forge'
import { useRef } from 'react';

interface Friend {
  publicKey: string
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
  const [myPublicKey, setMyPublicKey] = useState<string>("");
  const [selectedFriendPublicKey, setSelectedFriendPublicKey] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>
  const images = [userPic, pfp1, pfp2, pfp3, pfp4]
  const { username } = props;

  useEffect(() => {
    if (selectedChat) {
      const chatKey = `chat-${selectedChat.username}`;
      const cachedMessages = localStorage.getItem(chatKey);
  
      if (cachedMessages) {
        setChatHistory((prevChats) => ({
          ...prevChats,
          [selectedChat.username]: JSON.parse(cachedMessages),
        }));
      } else {
        fetchInitialMessages();
      }
    }
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat && chatHistory[selectedChat.username]?.length > 0) {
      scrollToBottom();
    }
  }, [selectedChat, chatHistory]);

  useEffect(() => {
    const fetchFriends = async () => {
        try {
            const publicKeyResponse = await getFriendsPublicKey(username);
            if (!publicKeyResponse.publicKey) {
                displayWarning('Failed to fetch your public key');
                return;
            }
            setMyPublicKey(publicKeyResponse.publicKey);
    
            const data = await getFriends();
            if (data.friends) {
                setFriends(data.friends);
                localStorage.setItem('friends', JSON.stringify(data.friends));
            }
        } catch (error) {
            console.error('Error fetching friends or public key:', error);
            displayError('Unable to load friends or public key');
        }
    };

    fetchFriends();

    socket.on('receiveMessage', ({ from, content }) => {
        try{
            const decryptedContent = decryptMessage(content);
            setChatHistory((prevChats) => ({
                ...prevChats,
                [from]: [...(prevChats[from] || []), { from, content: decryptedContent }],
            }));
        }catch(error) {
            displayError('Error processing received message')
            console.error('Error processing received message:', error);
        }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const fetchInitialMessages = async () => {
    if (!selectedChat) return;
    try {
      const { messages } = await getChatHistory(selectedChat.username, 0, 10);
      const decryptedMessages = messages.map((msg: any) => ({
        from: msg.sender,
        content: decryptMessage(msg.content),
      }));
  
      setChatHistory((prevChats) => ({
        ...prevChats,
        [selectedChat.username]: decryptedMessages,
      }));
  
      const chatKey = `chat-${selectedChat.username}`;
      localStorage.setItem(chatKey, JSON.stringify(decryptedMessages));
    } catch (error) {
      console.error('Error fetching initial messages:', error);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const decryptMessage = (encryptedMessage: string | null) => {
    try {
        if (!encryptedMessage) {
            displayWarning('Encrypted message is missing');
            return '[System] Message unavailable';
        }

        const privateKeyPem = localStorage.getItem('privateKey') || '';
        if (!privateKeyPem) {
            displayWarning('Private key is missing');
            return '[System] Message unavailable';
        }
        const privateKeyObj = forge.pki.privateKeyFromPem(privateKeyPem);

        const decodedMessage = forge.util.decode64(encryptedMessage);
        return forge.util.decodeUtf8(privateKeyObj.decrypt(decodedMessage));
    } catch (error) {
        console.error('Failed to decrypt message:', error);
        return '[System] Unable to decrypt message';
    }
};

  const encryptMessageWithMultipleKeys = (message: string, publicKey1: string, publicKey2: string) => {
    const publicKeyObj1 = forge.pki.publicKeyFromPem(publicKey1);
    const publicKeyObj2 = forge.pki.publicKeyFromPem(publicKey2);
  
    const encryptedForUser = forge.util.encode64(publicKeyObj1.encrypt(forge.util.encodeUtf8(message)));
    const encryptedForFriend = forge.util.encode64(publicKeyObj2.encrypt(forge.util.encodeUtf8(message)));
  
    return { encryptedForUser, encryptedForFriend };
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat && selectedFriendPublicKey) {
        const { encryptedForUser, encryptedForFriend } = encryptMessageWithMultipleKeys(
            newMessage.trim(),
            myPublicKey,
            selectedFriendPublicKey
          );
        const message: Message = { from: username, content: newMessage.trim() }

        setChatHistory((prevChats) => ({
            ...prevChats,
            [selectedChat.username]: [...(prevChats[selectedChat.username] || []), message],
        }));

        socket.emit('sendMessage', {
            from: username,
            to: selectedChat.username,
            content: encryptedForFriend,
            content_sender: encryptedForUser
        });
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

  const selectChat = async (friend: Friend) => {
    if (selectedChat?.username === friend.username) return;
    setSelectedChat(friend);

    try {
        const { publicKey } = await getFriendsPublicKey(friend.username);
        if (!publicKey) {
            displayWarning(`Could not fetch public key for ${friend.username}`);
            setSelectedFriendPublicKey('');
            return;
        }
        setSelectedFriendPublicKey(publicKey);

        const data = await getChatHistory(friend.username)
    
        if (data.messages) {
            setChatHistory((prevChats) => ({
                ...prevChats,
                [friend.username]: data.messages.map((msg: any) => {
                    const decryptedContent = decryptMessage(msg.content);
                    return {
                        from: msg.sender,
                        content: decryptedContent,
                    };
                }),
            }));
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        displayError('Unable to load chat history');
      }
  }

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop === 0 && selectedChat) {
      const chatKey = `chat-${selectedChat.username}`;
      const currentMessages = chatHistory[selectedChat.username] || [];
      const offset = currentMessages.length;
  
      try {
        const { messages } = await getChatHistory(selectedChat.username, offset, 10);
        if (messages.length > 0) {
          const decryptedMessages = messages.map((msg: any) => ({
            from: msg.sender,
            content: decryptMessage(msg.content),
          }));
  
          setChatHistory((prevChats) => ({
            ...prevChats,
            [selectedChat.username]: [...decryptedMessages, ...prevChats[selectedChat.username] || []],
          }));
  
          localStorage.setItem(chatKey, JSON.stringify(chatHistory[selectedChat.username]));
        }
      } catch (error) {
        console.error('Error loading more messages:', error);
      }
    }
  };

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
                  <img src={images[user.profilePic] || userPic} alt='Profile' className='search-pfp' />
                  <span>{user.username}</span>
                  <button className='add-friend-btn' onClick={() => handleAddFriend(user.username)}>Add</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='friends-list-container'>
          {friends.map((friend) => (
            <div key={friend.id} className={`friend-item ${selectedChat?.username === friend.username ? 'disabled' : ''}`} onClick={() => selectChat(friend)}>
              <img src={friend.pfp} alt='Profile' className='friend-pfp' />
              <span>{friend.username}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='chat-container'>
        {selectedChat ? (
          <>
            <div className='messages-container' onScroll={handleScroll}>
              {(chatHistory[selectedChat.username] || []).map((msg, index) => (
                <div key={index} className={`message ${msg.from === username ? 'my-message' : 'friend-message'}`}>
                  <p>{msg.content}</p>
                </div>
              ))}
              <div ref={chatEndRef}></div>
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
