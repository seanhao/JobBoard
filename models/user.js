const mongoose = require('mongoose')

const userSchema = {
  username: String,
  password: String,
  facebook_id: String,
  twitter_id: String,
  google_id: String
}

module.exports = mongoose.model('User', userSchema)
