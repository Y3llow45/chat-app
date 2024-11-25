require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const generateToken = require('./services/genToken')
const bodyParser = require('body-parser')
const verifyToken = require('./middleware/verifyToken')
const { publishToQueue, connectRabbitMQ } = require('./services/rabbitmqService');
const pool = require('./services/db');

const app = express()
const PORT = parseInt(process.env.PORT, 10)
const saltRounds = parseInt(process.env.saltRounds, 10)

connectRabbitMQ().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port: ${PORT}`);
      });
}).catch((err) => {
    console.error('Error starting server: ', err);
});

app.use(cors())
app.use(bodyParser.json())

app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username already exists' })
    }
    const hash = await bcrypt.hash(password, saltRounds);
    await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
      [username, email, hash, 'user']
    );
    res.status(201).json({ message: 'Account created' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/signin', async (req, res) => {
  const { username, password } = req.body
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user.id, user.username, user.role);
    res.status(200).json({ message: 'Sign in successful', token, username: user.username })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.put('/updatePfp/:index', verifyToken, async (req, res) => {
  try {
    const index = req.params.index
    const username = req.username
    const result = await pool.query(
      'UPDATE users SET profile_pic = $1, updated_at = NOW() WHERE username = $2 RETURNING *',
      [index, username]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Pfp updated' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/searchUsers/:username', verifyToken, async (req, res) => {
  try {
    const username = req.params.username

    if (username.length < 4) {
      return res.status(400).json({ message: 'Search query too short' })
    }
    const query = `
      SELECT username, profile_pic 
      FROM users 
      WHERE username ILIKE $1
    `;
    const { rows: users } = await pool.query(query, [`${username}%`]);

    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/friendRequest', verifyToken, async (req, res) => {
  try {
    const { friendUsername } = req.body
    const requesterUsername = req.username

    const query = 'SELECT username, friends, pending_requests FROM users WHERE username = $1';
    const { rows: [friend] } = await pool.query(query, [friendUsername]);

    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    if (friend.friends.includes(requesterUsername) || friend.pending_requests.includes(requesterUsername)) {
      return res.status(400).json({ message: 'Already friends or request pending' });
    }

    const updateQuery = `
      UPDATE users 
      SET pending_requests = array_append(pending_requests, $1) 
      WHERE username = $2
    `;
    await pool.query(updateQuery, [requesterUsername, friendUsername]);

    await publishToQueue('friendRequests', { requesterUsername, friendUsername, type: 'friendRequest' });

    res.json({ message: 'Friend request sent' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/acceptFriendRequest', verifyToken, async (req, res) => {
  try {
    const { requesterUsername } = req.body
    const friendUsername = req.username

    const query = `
      SELECT username, friends, pending_requests 
      FROM users 
      WHERE username = $1 OR username = $2
    `;
    const { rows } = await pool.query(query, [friendUsername, requesterUsername]);

    const friend = rows.find(user => user.username === friendUsername);
    const requester = rows.find(user => user.username === requesterUsername);

    if (!friend || !requester) {
      return res.status(404).json({ message: 'Users not found' });
    }

    const friendUpdateQuery = `
      UPDATE users 
      SET friends = array_append(friends, $1), 
        pending_requests = array_remove(pending_requests, $2)
      WHERE username = $3
    `;
    const requesterUpdateQuery = `
      UPDATE users 
      SET friends = array_append(friends, $1) 
      WHERE username = $2
    `;
    await pool.query(friendUpdateQuery, [requesterUsername, requesterUsername, friendUsername]);
    await pool.query(requesterUpdateQuery, [friendUsername, requesterUsername]);

    await publishToQueue('friendRequests', { requesterUsername, friendUsername, type: 'friendRequestAccepted', accepted: true });

    res.json({ message: 'Friend request accepted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
    console.error(error)
  }
})

app.get('/api/getUserRole', verifyToken, async (req, res) => {
  try {
    const username = req.username
    const query = 'SELECT role FROM users WHERE username = $1';
    const { rows: [user] } = await pool.query(query, [username]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ role: user.role })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/getFriends', verifyToken, async (req, res) => {
  try {
    const username = req.username

    const query = 'SELECT friends FROM users WHERE username = $1';
    const { rows: [user] } = await pool.query(query, [username]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friends = Array.isArray(user.friends)
      ? user.friends.map((friendUsername, index) => ({
        id: index,
        username: friendUsername,
      }))
      : [];

    res.status(200).json({ friends });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/clear', async (req, res) => {
  try {
    const username = 'bobi';
    const secondUsername = 'test';

    const clearUserDataQuery = `
      UPDATE users 
      SET pending_requests = '{}', friends = '{}' 
      WHERE username = $1
    `;

    await pool.query(clearUserDataQuery, [username]);
    await pool.query(clearUserDataQuery, [secondUsername]);

    res.status(200).json({ message: 'Data cleared successfully' });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/check/:type/:input', async (req, res) => {
  try {
    const { type, input } = req.params

    let query;
    if (type === 'Username') {
      query = 'SELECT 1 FROM users WHERE username = $1';
    } else if (type === 'Email') {
      query = 'SELECT 1 FROM users WHERE email = $1';
    } else {
      return res.status(404).json({ message: 'No such type' });
    }

    const { rows } = await pool.query(query, [input]);

    if (rows.length === 0) {
      return res.status(200).json({ message: 'false' });
    }
    res.status(200).json({ message: 'true' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})
