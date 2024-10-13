import { displayInfo } from '../components/Notify/Notify';
const url = 'http://localhost:5242/';

export const updatePfp = (index) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  return fetch(`${url}updatePfp/${index}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })
};

export const getRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  return fetch(`${url}api/getUserRole`, { headers: { 'Authorization': token } })
    .then(res => res.json())
    .then((data) => {
      return data
    })
    .catch(
      (error) => console.log(error)
    );
}

export const searchUsers = (username) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  return fetch(`${url}searchUsers/${username}`, { headers: { 'Authorization': token } })
    .then(res => res.json())
    .then((data) => {
      return data
    })
    .catch(
      (error) => console.log(error)
    );
}

export const signUp = (username, email, password) => {
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

export const signIn = (username, password) => {
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

export const checkDuplicate = (type, username) => {
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