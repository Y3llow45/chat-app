require('dotenv').config();
const jwt = require('jsonwebtoken');
const SSKEY = process.env.SSKEY;
console.log('hi from middleware')

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        res.status(401).json({ error: 'Access denied' });
        return;
    }

    try {
        const payload = jwt.verify(token, SSKEY);
        req.username = payload.username;
        req.role = payload.role;
        next();
        
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;