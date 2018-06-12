var express = require('express')
var router = express.Router();
var app = express();
var requestHandler = require('../controller/requestHandler.js')

app.use('/', router);

router.use((request, response, next) => {
  console.log(request.method, request.url)
  next();
})

router.get('/', rootGet)
router.get('/subscription', subscriptionGet);
router.post('/subscription', subscriptionPost);
router.get('/login', loginGet);
router.post('/login', loginPost);
router.get('/forgetPassword', forgetPasswordGet)
router.post('/forgetPassword', forgetPasswordPost)
router.get('/api/authenticated', checkTokenValidity, apiAuthenticatedGet);

module.exports = router
