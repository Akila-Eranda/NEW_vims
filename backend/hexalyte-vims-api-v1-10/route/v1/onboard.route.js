const express = require('express')
const { auth } = require('../../middleware/auth')
const router = express.Router()
const onboardController = require('../../controller/onboard.controller')

router
    .route('/getStarted/:user')
    .get(onboardController.newUser)


module.exports = router