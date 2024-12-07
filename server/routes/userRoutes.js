const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const {
  updatePfp,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  getUserRole,
  getFriends,
  checkInput,
  getPublicKey,
} = require('../controllers/userController');

const router = express.Router();

router.put('/updatePfp/:index', verifyToken, updatePfp);
router.get('/searchUsers/:username', verifyToken, searchUsers);
router.post('/friendRequest', verifyToken, sendFriendRequest);
router.post('/acceptFriendRequest', verifyToken, acceptFriendRequest);
router.get('/getUserRole', verifyToken, getUserRole);
router.get('/getFriends', verifyToken, getFriends);
router.get('/check/:type/:input', checkInput);
router.get('/publicKey/:username', getPublicKey);

module.exports = router;
