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

    if (missedMessages && missedMessages.length > 0) {
      missedMessages.forEach((obj) => {
        if (obj.type === 'friendRequest') {
          socket.emit('friendRequestNotification', {
            from: obj.requesterUsername,
            message: `${obj.requesterUsername} sent you a friend request.`
          });
        } else if (obj.type === 'friendRequestAccepted') {
          socket.emit('friendRequestAcceptedNotification', {
            from: obj.friendUsername,
            message: `${obj.friendUsername} accepted your friend request.`,
          });
        } else {
          socket.emit('receiveMessage', { from: obj.from, content: obj.content });
        }
      });
    }
  })

  socket.on('sendMessage', async (data) => {
    const { from, to, content } = data;
    const recipientSocketId = userSocketMap.get(to);
    const message = { type: "message", from, to, content };

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receiveMessage', message);
    } else {
      const missedQueueName = `missedMessages_${to}`;
      const channel = await connectRabbitMQ();
      await channel.assertQueue(missedQueueName, { durable: true });
      channel.sendToQueue(missedQueueName, Buffer.from(JSON.stringify(message)));
    }
  });
})

const startRabbitMQConsumer = async () => {
  try {
    const channel = await connectRabbitMQ()
    await channel.assertQueue('friendRequests');

    channel.consume('friendRequests', async (msg) => {
      const { requesterUsername, friendUsername, accepted } = JSON.parse(msg.content.toString());
      const targetUsername = accepted ? requesterUsername : friendUsername
      const friendSocketId = userSocketMap.get(targetUsername);
      const friendSocket = io.sockets.sockets.get(friendSocketId);

      if (!friendSocketId || !friendSocket) {
        const missedQueueName = `missedMessages_${targetUsername}`;
        await channel.assertQueue(missedQueueName, { durable: true });
        channel.sendToQueue(missedQueueName, Buffer.from(msg.content.toString()));

        channel.ack(msg);
        return;
      }

      if (accepted) {
        friendSocket.emit('friendRequestAcceptedNotification', {
          from: friendUsername,
          message: `${friendUsername} accepted your friend request.`
        });
      } else {
        friendSocket.emit('friendRequestNotification', {
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
