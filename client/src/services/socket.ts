import { io } from 'socket.io-client';

const socket = io('http://localhost:5243');

export default socket;
