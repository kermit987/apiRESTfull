var express = require('express');
var app = express();
var port = process.env.PORT || 8888;
var bodyParser = require('body-parser')
var routes = require('./routes/routes.js')

app.use(bodyParser.urlencoded({extended: true}))
app.use('/', routes);


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

app.listen(port, () => {
  console.log("App running on port 8888")
})

module.exports = app
