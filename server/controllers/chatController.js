const pool = require('../services/db');

exports.getChatHistory = async (req, res) => {
    const username = req.username;
    const withUser = req.params.withUser;
    const offset = req.params.offset;
    const limit = 10;
  
    try {
        const { rows: messages } = await pool.query(
            `SELECT sender, 
                CASE 
                    WHEN sender = $1 THEN content_sender 
                    ELSE content 
                END AS content, 
                timestamp
            FROM messages 
            WHERE (sender = $1 AND receiver = $2) 
            OR (sender = $2 AND receiver = $1)
            ORDER BY timestamp DESC
            LIMIT $3 OFFSET $4`,
            [username, withUser, limit, offset]
      );
  
      res.status(200).json({ messages });
    } catch (error) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({ message: 'Server error' });
    }
};
