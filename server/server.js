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
  try {
    let { username, email, password } = req.body;
    const testUsername = await User.find({ username: username })
    if (testUsername.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    bcrypt
      .hash(password, saltRounds)
      .then(hash => {
        let newUser = new User({ username: username, email: email, password: hash, role: 'user' })
        newUser.save();
      })
      .catch((err) => { throw err })
  }
  catch (error) {
    res.statusMessage = `${error}`;
    return res.status(500).send();
  }
  res.status(201).json({ message: 'Account created' });
})

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = generateToken(user._id, user.username, user.role);
    res.status(200).json({ message: 'Sign in successful', token, username: user.username });

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.put('/updatePfp/:index', verifyToken, async (req, res) => {
  try {
    const index = req.params.index;
    const username = req.username;
    var user = await User.findOne({ username: username })
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.profilePic = index;
    await user.save()
    res.json({ message: 'Pfp updated' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/searchUsers/:username', verifyToken, async (req, res) => {
  try {
    const username = req.params.username;

    if (username.length < 4) {
      return res.status(400).json({ message: 'Search query too short' });
    }
    //rewrite this
    const users = await User.find({
      username: { $regex: `^${username}`, $options: 'i' }
    }).select('username profilePic');

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/getUserRole', verifyToken, async (req, res) => {
  try {
    const username = req.username;
    const user = await User.findOne({ username });
    res.status(200).json({ role: user._doc.role });
  }
  catch (error) {
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