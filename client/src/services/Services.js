import { displayInfo, displaySuccess } from '../components/Notify/Notify';
const url = 'http://localhost:5242/';

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