const amqp = require('amqplib')
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const SPORT = parseInt(process.env.SPORT, 10)

io.on('connection', (socket) => {
  console.log('A user connected')
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

const startRabbitMQConsumer = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URI);
  const channel = await connection.createChannel();

  await channel.assertQueue('friendRequests');
  channel.consume('friendRequests', (msg) => {
    const { requesterUsername, friendUsername } = JSON.parse(msg.content.toString());

    const friendSocket = io.sockets.sockets.get(friendUsername);
    if (friendSocket) {
      friendSocket.emit('friendRequestNotification', {
        from: requesterUsername,
        message: `${requesterUsername} sent you a friend request.`
      });
    }
    channel.ack(msg);
  });
};

startRabbitMQConsumer();

server.listen(SPORT, () => {
  console.log(`Socket server is listening on port: ${SPORT}`)
})
