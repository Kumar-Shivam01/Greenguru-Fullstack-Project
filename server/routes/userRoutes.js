const protectedRoute = require('./../middlewares/protectedRoute')
const express = require('express')
const userController = require('./../controllers/userController')

const userRouter = express.Router();
userRouter.route('/user-data').get(protectedRoute,userController)
module.exports = userRouter 