const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const generateToken = require('./services/genToken');
const bodyParser = require('body-parser');
const User = require("./models/User");
const verifyToken = require('./middleware/verifyToken')

const app = express()
const PORT = parseInt(process.env.PORT, 10)
const saltRounds = parseInt(process.env.saltRounds, 10)
const AtlasUri = process.env.ATLASURI;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(AtlasUri).then(() => {
  console.log('Connected to db');
})

app.post('/signup', async (req, res) => {
  console.log('here at singup')
  try {
    let { username, password } = req.body;
    const testUsername = await User.find({ username: username })
    console.log('find')
    if (testUsername.length > 0) {
      console.log(testUsername)
      return res.status(400).json({ message: 'Username already exists' });
    }
    console.log('continnuing')
    bcrypt
      .hash(password, saltRounds)
      .then(hash => {
        let newUser = new User({ username: username, password: hash, role: 'user' })
        console.log('before saving')
        newUser.save();
        console.log('saved')
      })
      .catch((err) => { throw err })
  }
  catch (error) {
    res.statusMessage = `${error}`;
    return res.status(500).send();
  }
  console.log('acc created')
  res.status(201).json({ message: 'Account created' });
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.find({ username: username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    bcrypt
      .hash(user.password, saltRounds)
      .then(hash => {
        user.password = hash;
      })
      .catch((err) => { throw err })

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = generateToken(user._id, user.username);
    res.status(200).json({ message: 'Sign in successful', token, username: user.username });

  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/api/getUserRole', verifyToken, async (req, res) => {
  try {
    const username = req.username;
    const user = await User.findOne({ username });
    res.status(200).json({ role: user._doc.role });
  }
  catch (error) {
    console.log(error);
    res.status(401).json({ message: 'server error' });
  }
});

app.get('/check/:type/:input', async (req, res) => {
  try {
    let { type, input } = req.params;
    let user;
    let lesson;
    if (type == 'Username') {
      user = await User.findOne({ username: input });
    } else if (type == 'Email') {
      user = await User.findOne({ email: input });
    } else if (type == 'Title') {
      lesson = await Lesson.findOne({ title: input })
      if (!lesson) {
        return res.status(200).json({ message: 'false' });
      }
      return res.status(200).json({ message: 'true' });
    } else {
      return res.status(404).json({ message: 'No such type' });
    }
    if (!user) {
      return res.status(200).json({ message: 'false' });
    }
    return res.status(200).json({ message: 'true' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
})