import { displayInfo } from '../components/Notify/Notify';
const url = 'http://localhost:5242/';

const fetchWithAuth = (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token,
    ...(options.headers || {}),
  };

  return fetch(`${url}${endpoint}`, { ...options, headers })
    .then(res => res.json())
    .catch(error => console.log(error));
};

export const updatePfp = (index: number) => {
  return fetchWithAuth(`updatePfp/${index}`, {
    method: 'PUT',
  });
};

export const getRole = () => {
  return fetchWithAuth('api/getUserRole');
};

export const searchUsers = (username: string) => {
  return fetchWithAuth(`searchUsers/${username}`);
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

export const signUp = (username: string, email: string, password: string) => {
  let user = {
    username,
    email,
    password,
  };

  return fetch(`${url}signup`, {
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

  return fetch(`${url}signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user)
  })
};

export const checkDuplicate = (type: string, username: string) => {
  return fetch(`${url}check/${type}/${username}`, {
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
