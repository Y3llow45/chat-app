const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  liked: Array
})

module.exports = mongoose.model("User", userSchema)