const amqp = require('amqplib')
const express = require('express')
const http = require('http')
const socket = require('socket.io')
const { getChannel } = require('./services/rabbitmqService')
const { connectRabbitMQ } = require('./services/rabbitmqService');
require('dotenv').config()

const app = express()
const server = http.createServer(app);
//const server = http.createServer(app)
//const io = new Server(server)
const SPORT = parseInt(process.env.SPORT, 10)


io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});



io.on('connection', (socket) => {
  console.log('A user connected')
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

const startRabbitMQConsumer = async () => {
  try {
    const channel = await connectRabbitMQ()

    await channel.assertQueue('friendRequests');
    channel.consume('friendRequests', (msg) => {
      const { requesterUsername, friendUsername } = JSON.parse(msg.content.toString());

      const friendSocket = io.sockets.sockets.get(friendUsername);
      if (friendSocket) {
        console.log('online')
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
