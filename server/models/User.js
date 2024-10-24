const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  profilePic: { type: Number, default: 0 },
  friends: [{ type: String }],
  pendingRequests: [{ type: String }]
})

module.exports = mongoose.model('User', userSchema)
