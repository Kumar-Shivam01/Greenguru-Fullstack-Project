const express = require('express');
const protectedRoute = require('./../middlewares/protectedRoute')
const controller = require('./../controllers/authController')
const router = express.Router()

router.route('/register').post(controller.register)
router.route('/login').post(controller.login)
router.route('/logout').get(controller.logout)
router.route('/send-verify-otp').post(protectedRoute,controller.sendVerifyOtp)
router.route('/verify-account').post(protectedRoute,controller.verifyAccount)
router.route('/send-reset-otp').post(controller.sendResetPasswordOtp)
router.route('/reset-password').post(controller.resetPassword)

module.exports = router    