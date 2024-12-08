import { displayInfo } from '../components/Notify/Notify';
const url = 'http://localhost:5242/';

const fetchWithAuth = (endpoint: string, options: RequestInit = {}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token,
      ...(options.headers || {}),
    };

    return fetch(`${url}${endpoint}`, { ...options, headers })
      .then(res => res.json())
      .catch(error => {
        console.log(error)
        throw error
      });
  } catch (error) {
    console.log(error)
  }
};

export const updatePfp = (index: number) => {
  return fetchWithAuth(`users/updatePfp/${index}`, {
    method: 'PUT',
  });
};

export const getRole = () => {
  return fetchWithAuth('api/getUserRole');
};

export const getFriendsPublicKey = (username: string) => {
    return fetchWithAuth(`users/publicKey/${username}`, { method: 'GET' });
};
  
export const searchUsers = (query: string) => {
    return fetchWithAuth(`users/searchUsers/${query}`, { method: 'GET' });
};

export const getFriends = () => {
  return fetchWithAuth('api/getFriends', { method: 'GET' });
};

export const sendFriendRequest = (friendUsername: string) => {
  return fetchWithAuth('friendRequest', {
    method: 'POST',
    body: JSON.stringify({ friendUsername }),
  });
};

export const acceptFriendRequest = (requesterUsername: string) => {
  return fetchWithAuth('acceptFriendRequest', {
    method: 'POST',
    body: JSON.stringify({ requesterUsername }),
  });
};

export const getChatHistory = async (username: string, offset: number = 0) => {
    return fetchWithAuth(`api/chatHistory/${username}/${offset}`)
};

export const signUp = (username: string, email: string, password: string) => {
  let user = {
    username,
    email,
    password,
  };

  return fetch(`${url}auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user)
  });
};

export const signIn = (username: string, password: string) => {
  let user = {
    username,
    password,
  };

  return fetch(`${url}auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user)
  })
};

export const checkDuplicate = (type: string, username: string) => {
  return fetch(`${url}auth/check/${type}/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'true') {
        displayInfo(`${type} already exists`)
        return true;
      }
      return false;
    })
    .catch(
      (error) => console.log(error)
    );
};
