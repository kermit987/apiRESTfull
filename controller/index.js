const path = require('path')
const bcrypt = require('bcrypt')
const randomString = require('randomstring')
const jwt = require('jsonwebtoken')
const saltRounds = bcrypt.genSaltSync(10)
const {
  getUser,
  createUser,
  getUserInformation,
  getUserUsingEmail,
  updateUsingEmail
} = require('../model')

const rootGet = (req, res) => {
  return res.status(200).send('INSIDE THE /')
}

const subscriptionGet = (req, res) => {
  return res.status(200).sendFile(path.join(__dirname , '../views/', 'subscription.html'))
}

const subscriptionPost = async (req, res) => {
  const name = req.body.name
  const lastname = req.body.lastname
  const typeblood = req.body.typeblood
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  const confirmationPassword = req.body.confirmationPassword

  try {
    const result = await getUser(username, email)
    if (result.length == 0) {
      if (password != confirmationPassword)
        return res.status(401).sendFile(path.join(__dirname, '../views/', 'wrongPassword.html')) //changer ce code
      const encryptPassword = bcrypt.hashSync(password, saltRounds)
      try {
        await createUser(name, lastname, typeblood, username, email, encryptPassword)
      } catch(e) {
        return res.status(501).send('[ERROR] ' + e) // erreur db
      }
      return res.status(200).render('../views/successSubscription.ejs', {name:name, lastname:lastname, typeblood:typeblood, username:username, password:password})
    }
    return res.status(409).render('../views/failureSubscription.ejs', {object: 'email'}) //changer ce code
  } catch(e) {
    return res.status(501).send('[ERROR] ' + e) //// erreur de base de donne
  }
}

const loginGet = (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../views/', 'login.html'))
}

const loginPost = async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  try {
    const result = await getUserInformation(username)
    if (result.length == 0)
      return res.status(403).sendFile(path.join(__dirname, '../views/', 'failureLogin.html'))
    const bddPassword = result[0].password
    bcrypt.compare(password, bddPassword)
      .then((same) => {
        if (same == false)
          return res.status(403).sendFile(path.join(__dirname, '../views/', 'failureLogin.html'))
        jwt.sign({username: username}, 'Penis', (err) => {
          if (err)
            return res.status(500).send('[ERROR WHILE CREATING TOKEN] ' + err)
          return res.status(200).render('../views/successLogin.ejs', {username: username, password: password}) //changer ce code
        })
      })
      .catch((error) => {
        return res.status(500).send('[ERROR] ' + error)
      })
  } catch(e) {
    res.status(501)
  }
}

const forgetPasswordGet = (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../views/', 'forgetPassword.html'))
}

const forgetPasswordPost = async (req, res) => {
  const email = req.body.email
  try {
    const userEmail = await getUserUsingEmail(email)
    if (userEmail.length == 0)
      return res.status(403).sendFile(path.join(__dirname, '../views/', 'noEmailFound.html'))
    const newPassword = randomString.generate(10)
    const hashNewPassword = bcrypt.hashSync(newPassword, saltRounds)
    try {
      await updateUsingEmail(email, hashNewPassword)
      return res.status(200).send('Email has been sent to ' + email)
    } catch (err) {
      return res.status(500).send('[ERROR] ' + err)
    }
  } catch(err) {
    return res.status(500).send('[ERROR] ', err)
  }
}

const checkTokenValidity = async (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) {
    req.checkTokenValidity = 0
    next()
  }
  jwt.verify(token, 'Penis', function(error, decoded) { //process.env.KEY_CRYPTED
    if (error) {
      req.checkTokenValidity = -1
      next()
    }
    if (decoded != undefined)
      req.checkTokenValidity = decoded.username
    next()
  })
}

const apiAuthenticatedGet = async (req, res) => {
  if (req.checkTokenValidity === 0)
    return res.status(400).send('No token provided')
  if (req.checkTokenValidity === -1)
    return res.status(501).send('[ERROR] Problem occurs while decrypting the token')
  try {
    const result = await getUserInformation(req.checkTokenValidity)
    if (result.length == 0)
      return res.status(501).send('[ERROR] no user found')
    const string = 'Hello you\'re authenticated as ' + result[0].username
    return res.status(200).send(string)
  } catch(err) {
    return res.status(501).send('[ERROR] ', err)
  }
}

module.exports = {
  rootGet,
  subscriptionGet,
  subscriptionPost,
  loginGet,
  loginPost,
  forgetPasswordGet,
  forgetPasswordPost,
  checkTokenValidity,
  apiAuthenticatedGet
}