const pool = require('../services/db');
const { publishToQueue } = require('../services/rabbitmqService');

exports.updatePfp = async (req, res) => {
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
};

exports.searchUsers = async (req, res) => {
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
};

exports.sendFriendRequest = async (req, res) => {
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
};

exports.acceptFriendRequest = async (req, res) => {
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
};

exports.getUserRole = async (req, res) => {
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
};

exports.getFriends = async (req, res) => {
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
};

exports.checkInput = async (req, res) => {
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
};

exports.getPublicKey = async (req, res) => {
    try {
        const { username } = req.params;
        const query = 'SELECT public_key FROM users WHERE username = $1';
        const { rows } = await pool.query(query, [username]);
  
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        res.json({ publicKey: rows[0].public_key });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
