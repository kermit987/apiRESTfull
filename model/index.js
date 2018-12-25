const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'steven',
  password: 'invadimpact', //change password depending on the computer
  database: 'apiRESTful', //We can't change but don't give a damn
})

connection.connect((error) => {
  if (error) {
    throw new Error('Error: connection to database failed')
  }
  // console.log('[INITIALIZATION] ... Connection to database success !')
})

const getUser = (username, email) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT username, email FROM user WHERE username=? or email=?', [username, email], (err, result) => {
      if (err)
        reject(err)
      else
        resolve(result)
    })
  })
}

const createUser = (name, lastname, typeblood, username, email, password) => {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO user (name, lastname, typeblood, username, email, password) VALUES(?,?,?,?,?,?)',
      [name, lastname, typeblood, username, email, password], (err, result) => {
        if (err)
          reject(err)
        else
          resolve(result)
      })
  })
}

const getUserInformation = (username) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM user WHERE username=?', [username], (error, result) => {
      if (error)
        reject (error)
      else
        resolve(result)
    })
  })
}

const getUserUsingEmail = (email) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT email FROM user WHERE email=?', [email], (error, result) => {
      if (error)
        reject(error)
      else
        resolve(result)
    })
  })
}

const updateUsingEmail = (email, password) => {
  return new Promise((resolve, reject) => {
    connection.query('UPDATE user SET password=? WHERE email=?', [password, email], (error, result) => {
      if (error)
        reject(error)
      else
        resolve(result)
    })
  })
}

module.exports = {
  getUser,
  createUser,
  getUserInformation,
  getUserUsingEmail,
  updateUsingEmail
}

