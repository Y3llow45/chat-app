const mongoose = require("mongoose")
import genRandomPfp from '../services/genRandomPfp'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  profilePic: { type: String, default: () => genRandomPfp() }
})

module.exports = mongoose.model("User", userSchema)