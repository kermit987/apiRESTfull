const express = require('express')
const router = express.Router()
const app = express()
const {
  rootGet,
  subscriptionGet,
  subscriptionPost,
  loginGet,
  loginPost,
  forgetPasswordGet,
  forgetPasswordPost,
  checkTokenValidity,
  apiAuthenticatedGet
} = require('../controller')

app.use('/', router)

router.use((request, response, next) => {
  next()
})

router.get('/', rootGet)
router.get('/subscription', subscriptionGet)
router.post('/subscription', subscriptionPost)
router.get('/login', loginGet)
router.post('/login', loginPost)
router.get('/forgetPassword', forgetPasswordGet)
router.post('/forgetPassword', forgetPasswordPost)
router.get('/api/authenticated', checkTokenValidity, apiAuthenticatedGet)

module.exports = {
  router
}