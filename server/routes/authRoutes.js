const express = require('express');
const protectedRoute = require('./../middlewares/protectedRoute')
const controller = require('./../controllers/authController')
const { authLimiter, otpLimiter } = require('./../middlewares/rateLimiter')
const router = express.Router()

router.route('/register').post(authLimiter, controller.register)
router.route('/login').post(authLimiter, controller.login)
router.route('/logout').get(controller.logout)
router.route('/send-verify-otp').post(protectedRoute, otpLimiter, controller.sendVerifyOtp)
router.route('/verify-account').post(protectedRoute, controller.verifyAccount)
router.route('/send-reset-otp').post(otpLimiter, controller.sendResetPasswordOtp)
router.route('/reset-password').post(authLimiter, controller.resetPassword)

module.exports = router