var express = require('express')
var app = express()
var port = process.env.PORT || 8888
var bodyParser = require('body-parser')
var { router }= require('./routes')

app.use(bodyParser.urlencoded({extended: true}))
app.use('/', router)


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

app.listen(port)

module.exports = app
