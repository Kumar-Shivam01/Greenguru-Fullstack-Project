const protectedRoute = require('./../middlewares/protectedRoute')
const express = require('express')
const {updateUserProfile,getUserData} = require('./../controllers/userController')

const userRouter = express.Router();
userRouter.route('/user-data').get(protectedRoute,getUserData)
userRouter.route('/profile').patch(protectedRoute,updateUserProfile)
module.exports = userRouter 