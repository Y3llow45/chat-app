const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { getChatHistory } = require('../controllers/chatController');

const router = express.Router();

router.get('/history/:withUser/:offset', verifyToken, getChatHistory);

module.exports = router;
