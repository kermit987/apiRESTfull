var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  email: String,
  username: String,
  typeblood: String,
  password: String
})

hello = function() {
  console.log("Hello World!")
}

module.exports = mongoose.model('users', userSchema)
