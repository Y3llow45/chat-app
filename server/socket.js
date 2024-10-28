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
    origin: "http://localhost:5173",
  }
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log(`${socket} left`)
    userSocketMap.forEach((id, username) => {
      if (id === socket.id) {
        userSocketMap.delete(username);
      }
    });
  });
  socket.on('registerUsername', async (username) => {
    if (userSocketMap.get(username) === socket.id) return;
    userSocketMap.set(username, socket.id);
    const missedMessages = await checkRabbitMQForUser(username);
    console.log(`${username} has missed messages: ${missedMessages} and ${missedMessages.length}`)
    if (missedMessages && missedMessages.length > 0) {
      missedMessages.forEach((msg) => {
        socket.emit('friendRequestNotification', msg);
      });
    }
  })
})

const startRabbitMQConsumer = async () => {
  try {
    const channel = await connectRabbitMQ()
    await channel.assertQueue('friendRequests');

    channel.consume('friendRequests', async (msg) => {
      const { requesterUsername, friendUsername } = JSON.parse(msg.content.toString());
      const friendSocketId = userSocketMap.get(friendUsername);
      const friendSocket = io.sockets.sockets.get(friendSocketId);

      if (!friendSocketId || !friendSocket) {
        console.log(`User ${friendUsername} is not currently connected.`);
        const missedQueueName = `missedMessages_${friendUsername}`;
        await channel.assertQueue(missedQueueName, { durable: true });
        //channel.sendToQueue(missedQueueName, Buffer.from(msg.content.toString()));
        console.log(`Stored missed message for ${friendUsername} in ${missedQueueName}`);

        channel.ack(msg);
        return;
      }
      console.log('Current userSocketMap:', Array.from(userSocketMap.entries()));
      console.log(`FriendsSocketId: ${friendSocketId}`)
      console.log(`Channel consume: ${requesterUsername} to ${friendUsername} and fr socket: ${friendSocket}`);

      console.log(`Friend online and Published friend request from ${requesterUsername} to ${friendUsername}`);
      friendSocket.emit('friendRequestNotification', {
        from: requesterUsername,
        message: `${requesterUsername} sent you a friend request.`
      });

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
