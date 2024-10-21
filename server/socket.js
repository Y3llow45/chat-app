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

server.listen(SPORT, () => {
  console.log(`Socket server is listening on port: ${SPORT}`)
})
