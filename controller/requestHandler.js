var express = require('express')
var app = express()
var connection = require('../model/model.js')
var path = require('path');
var bcrypt = require('bcrypt');
var randomString = require('randomstring');
var jwt = require('jsonwebtoken');
var saltRounds = bcrypt.genSaltSync(10);

rootGet = function(req, res) {
  return res.status(200).send("INSIDE THE /");
}

subscriptionGet = function(req, res) {
  return res.status(200).sendFile(path.join(__dirname , '../views/', 'subscription.html'));
}

subscriptionPost = async function(req, res) {
  var name = req.body.name;
  var lastname = req.body.lastname;
  var typeblood = req.body.typeblood;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var confirmationPassword = req.body.confirmationPassword;

  try {
    let result = await getUser(username, email)
    if (result.length == 0) {
      if (password != confirmationPassword)
        return res.status(401).sendFile(path.join(__dirname, '../views/', 'wrongPassword.html'));
      var encryptPassword = bcrypt.hashSync(password, saltRounds);
      try {
        await createUser(name, lastname, typeblood, username, email, encryptPassword)
      } catch(e) {
        return res.status(501).send("[ERROR] " + e);
      }
      return res.status(200).render('../views/successSubscription.ejs', {name:name, lastname:lastname, typeblood:typeblood, username:username, password:password})
    }
    return res.status(409).render('../views/failureSubscription.ejs', {object: "email"})
  } catch(e) {
    return res.status(501).send("[ERROR] " + e);
  }
}

loginGet = function(req, res) {
  return res.status(200).sendFile(path.join(__dirname, '../views/', 'login.html'))
}

loginPost = async function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  try {
    let result = await getUserInformation(username)
    console.log("Valeur de result ", result)
    if (result == null)
    // if (result.length == 0)
      return res.status(403).sendFile(path.join(__dirname, '../views/', 'failureLogin.html'))
    var bddPassword = result.password
    bcrypt.compare(password, bddPassword)
      .then((same) => {
        if (same == false)
          return res.status(403).sendFile(path.join(__dirname, '../views/', 'failureLogin.html'));
        jwt.sign({username: username}, "secret", (error, token) => {
          if (error)
            return res.status(500).send("[ERROR WHILE CREATING TOKEN] " + err)
          return res.status(200).render('../views/successLogin.ejs', {username: username, password: token})
        })
      })
      .catch((error) => {
        console.log("Dedans")
        return res.status(500).send("[ERROR] " + error);
      })
  } catch(e) {
    res.status(501)
  }
}

forgetPasswordGet = function(request, response) {
  response.status(200).sendFile(path.join(__dirname, '../views/', 'forgetPassword.html'))
}

forgetPasswordPost = async function(req, res) {
  var email = req.body.email;
  try {
    let result = await getUserUsingEmail(email)
      if (result == null)
        return res.status(403).sendFile(path.join(__dirname, '../views/', 'noEmailFound.html'))
      var newPassword = randomString.generate(10);
      var hashNewPassword = bcrypt.hashSync(newPassword, saltRounds);
      try {
        let result = await updateUsingEmail(email, hashNewPassword)
        return res.status(200).send("Email has been sent to " + email);
      } catch (err) {
        return res.status(500).send("[ERROR] " + err)
      }
  } catch(err) {
    return res.status(500).send("[ERROR] ", err);
  }
}

checkTokenValidity = function(req, res, next) {
    var token = req.headers["x-access-token"];
    if (!token) {
      req.checkTokenValidity = 0;
      next();
    }
    jwt.verify(token, "secret", function(error, decoded) {
      if (error) {
        req.checkTokenValidity = -1;
        next();
      }
      if (decoded != undefined)
        req.checkTokenValidity = decoded.username;
      next();
    });
}

apiAuthenticatedGet = async function(req, res) {
  if (req.checkTokenValidity === 0)
    return res.status(400).send("No token provided")
  if (req.checkTokenValidity === -1)
    return res.status(501).send("[ERROR] Problem occurs while decrypting the token")
  try {
    let result = await getUserInformation(req.checkTokenValidity)
    if (result == null)
      return res.status(501).send("[ERROR] no user found")
    var string = "Hello you're authenticated as " + req.checkTokenValidity;
    return res.status(200).send(string);
  } catch(err) {
    return res.status(501).send("[ERROR] ", err)
  }
}

module.exports = rootGet
module.exports = subscriptionGet
module.exports = subscriptionPost
module.exports = loginGet
module.exports = loginPost
module.exports = forgetPasswordGet
module.exports = forgetPasswordPost
module.exports = checkTokenValidity
module.exports = apiAuthenticatedGet
