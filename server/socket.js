const amqp = require('amqplib')
const express = require('express')
const http = require('http')
const socket = require('socket.io')
const { connectRabbitMQ } = require('./services/rabbitmqService');
const { checkRabbitMQForUser } = require('./services/checkMissed')
require('dotenv').config()

const app = express()
const server = http.createServer(app);
const SPORT = parseInt(process.env.SPORT, 10)
const userSocketMap = new Map();

io = socket(server, {
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    userSocketMap.forEach((id, username) => {
      if (id === socket.id) {
        userSocketMap.delete(username);
      }
    });
  });
  socket.on('registerUsername', async (username) => {
    userSocketMap.set(username, socket.id);
    const missedMessages = await checkRabbitMQForUser(username);
    missedMessages.forEach((msg) => {
      socket.emit('friendRequestNotification', msg);
    });
  })
})

const startRabbitMQConsumer = async () => {
  try {
    const channel = await connectRabbitMQ()
    await channel.assertQueue('friendRequests');
    channel.consume('friendRequests', (msg) => {
      const { requesterUsername, friendUsername } = JSON.parse(msg.content.toString());
      const friendSocketId = userSocketMap.get(friendUsername);
      if (friendSocketId) {
        friendSocketId.emit('friendRequestNotification', {
          from: requesterUsername,
          message: `${requesterUsername} sent you a friend request.`
        });
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
