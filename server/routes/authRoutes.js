const express = require('express');
const { signUp, signIn } = require('../controllers/auth.controller');
const { searchUsers, updatePfp } = require('../controllers/user.controller');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

router.get('/searchUsers/:username', verifyToken, searchUsers);
router.put('/updatePfp/:index', verifyToken, updatePfp);

module.exports = router;
