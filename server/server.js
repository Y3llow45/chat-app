const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const bcrypt = require('bcrypt')
const generateToken = require('./services/genToken')
const bodyParser = require('body-parser')
const User = require('./models/User')
const verifyToken = require('./middleware/verifyToken')
const findUsers = require('./services/findUsers')
const { publishToQueue, connectRabbitMQ } = require('./services/rabbitmqService');

const app = express()
const PORT = parseInt(process.env.PORT, 10)
const saltRounds = parseInt(process.env.saltRounds, 10)
const AtlasUri = process.env.ATLASURI

app.use(cors())
app.use(bodyParser.json())

mongoose.connect(AtlasUri).then(() => {
  console.log('Connected to db')
  return connectRabbitMQ()
}).then(() => {
  console.log('Connected to RabbitMQ')

  app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
  })
}).catch((err) => {
  console.error('Error starting server: ', err)
})

app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body
    const testUsername = await User.find({ username })
    if (testUsername.length > 0) {
      return res.status(400).json({ message: 'Username already exists' })
    }
    bcrypt
      .hash(password, saltRounds)
      .then(hash => {
        const newUser = new User({ username, email, password: hash, role: 'user' })
        newUser.save()
      })
      .catch((err) => { throw err })
  } catch (error) {
    res.statusMessage = `${error}`
    return res.status(500).send()
  }
  res.status(201).json({ message: 'Account created' })
})

app.post('/signin', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }
    const token = generateToken(user._id, user.username, user.role)
    res.status(200).json({ message: 'Sign in successful', token, username: user.username })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.put('/updatePfp/:index', verifyToken, async (req, res) => {
  try {
    const index = req.params.index
    const username = req.username
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    user.profilePic = index
    await user.save()
    res.json({ message: 'Pfp updated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/searchUsers/:username', verifyToken, async (req, res) => {
  try {
    const username = req.params.username

    if (username.length < 4) {
      return res.status(400).json({ message: 'Search query too short' })
    }
    const users = await User.find({
      username: { $regex: `^${username}`, $options: 'i' }
    }).select('username profilePic')

    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/friendRequest', verifyToken, async (req, res) => {
  const { friendUsername } = req.body
  const requesterUsername = req.username

  const { friend, error, status } = await findUsers(friendUsername, requesterUsername)
  if (error) return res.status(status).json({ message: error })

  if (friend.friends.includes(requesterUsername) || friend.pendingRequests.includes(requesterUsername)) {
    return res.status(400).json({ message: 'Already friends or request pending' })
  }

  friend.pendingRequests.push(requesterUsername)
  await friend.save()

  console.log(`Published friend request from ${requesterUsername} to ${friendUsername}`);
  await publishToQueue('friendRequests', { requesterUsername, friendUsername });

  res.json({ message: 'Friend request sent' })
})

app.post('/acceptFriendRequest', verifyToken, async (req, res) => {
  const { requesterUsername } = req.body
  const friendUsername = req.username

  const { friend, requester, error, status } = await findUsers(friendUsername, requesterUsername);
  if (error) return res.status(status).json({ message: error });

  friend.pendingRequests = friend.pendingRequests.filter(req => req !== requesterUsername)
  friend.friends.push(requesterUsername)
  requester.friends.push(friendUsername)

  await friend.save()
  await requester.save()

  res.json({ message: 'Friend request accepted' })
})

app.get('/api/getUserRole', verifyToken, async (req, res) => {
  try {
    const username = req.username
    const user = await User.findOne({ username })
    res.status(200).json({ role: user._doc.role })
  } catch (error) {
    res.status(401).json({ message: 'server error' })
  }
})

app.get('/clear', async (req, res) => {
  try {
    const username = 'bobi'
    const second_username = 'test'
    const user = await User.findOne({ username })
    const second_user = await User.findOne({ username: second_username })
    user.pendingRequests = []
    second_user.pendingRequests = []
    await user.save()
    await second_user.save()
  } catch (error) {
    res.status(401).json({ message: 'server error' })
  }
})

app.get('/check/:type/:input', async (req, res) => {
  try {
    const { type, input } = req.params
    let user
    if (type === 'Username') {
      user = await User.findOne({ username: input })
    } else if (type === 'Email') {
      user = await User.findOne({ email: input })
    } else {
      return res.status(404).json({ message: 'No such type' })
    }
    if (!user) {
      return res.status(200).json({ message: 'false' })
    }
    return res.status(200).json({ message: 'true' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


