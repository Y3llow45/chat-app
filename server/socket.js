const amqp = require('amqplib')
const express = require('express')
const http = require('http')
const socket = require('socket.io')
const { connectRabbitMQ } = require('./services/rabbitmqService');
require('dotenv').config()

const app = express()
const server = http.createServer(app);
const SPORT = parseInt(process.env.SPORT, 10)
const userSocketMap = new Map();

io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    userSocketMap.forEach((id, username) => {
      if (id === socket.id) {
        userSocketMap.delete(username);
        console.log(`${username} has disconnected`);
      }
    });
  });
  socket.on('registerUsername', (username) => {
    userSocketMap.set(username, socket.id);
    console.log(`${username} is connected with socket id: ${socket.id}`);
  })
})

const startRabbitMQConsumer = async () => {
  try {
    const channel = await connectRabbitMQ()

    await channel.assertQueue('friendRequests');
    channel.consume('friendRequests', (msg) => {
      const { requesterUsername, friendUsername } = JSON.parse(msg.content.toString());
      console.log(`Socket, data: ${requesterUsername} and ${friendUsername}`)
      const friendSocketId = userSocketMap.get(friendUsername);
      if (friendSocketId) {
        console.log('online')
        friendSocketId.emit('friendRequestNotification', {
          from: requesterUsername,
          message: `${requesterUsername} sent you a friend request.`
        });
      } else {
        console.log('friend not online')
      }
      channel.ack(msg);
    });
  } catch (err) {
    console.error('Failed to start RabbitMQ consumer: ', err)
  }
}

startRabbitMQConsumer().then(() => {
  server.listen(SPORT, () => {
    console.log(`Socket server is listening on port: ${SPORT}`)
  })
})
