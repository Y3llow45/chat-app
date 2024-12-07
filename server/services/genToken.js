const jwt = require('jsonwebtoken')
require('dotenv').config()
const SSKEY = process.env.SSKEY

const generateToken = (userId, username, role) => {
    userId = userId.toString()
    const token = jwt.sign({ userId, username, role }, SSKEY)//, { expiresIn: '1d' }
    return token
}

module.exports = generateToken
