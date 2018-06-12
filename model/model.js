var mongoose = require('mongoose')
var user = require('./userSchema.js')

mongoose.connect('mongodb://forInterview:poss3id0n@ds153003.mlab.com:53003/apirestfull')

db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('[MONGOOSE] ... Connection to database success !')
})

getUser = function(username, email) {
  return new Promise((resolve, reject) => {
    user.find({
      $or:
      [{email: email},
      {username: username}]
    }, (err, result) => {
      if (err)
        reject(err)
      resolve(result)
    })
  })
}

createUser = function(name, lastname, typeblood, username, email, password) {
  return new Promise((resolve, reject) => {
    var newUser = new user({
      name: name,
      lastname: lastname,
      email: email,
      username: username,
      typeblood: typeblood,
      password: password
    })
    newUser.save(function (err) {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

getUserInformation = function(username) {
  console.log("Value of username ", username)
  return new Promise((resolve, reject) => {
    user.findOne(
      {username: username},
      'password',
      (err, result) => {
        if (err)
          reject(err)
        resolve(result)
      }
    )
  })
}

getUserUsingEmail = function(email) {
  return new Promise((resolve, reject) => {
    user.findOne(
      {email: email},
      'email',
      (err, result) => {
        if (err)
          reject(Err)
        resolve(result)
      }
    )
  })
}

updateUsingEmail = function(email, password) {
  return new Promise((resolve, reject) => {
    user.findOneAndUpdate(
      {email: email},
      {password: password},
      (err, result) => {
        if (err)
          reject(err)
        resolve(result)
      }
    )
  })
}

module.exports = getUser
module.exports = createUser
module.exports = getUserInformation
module.exports = getUserUsingEmail
module.exports = updateUsingEmail
