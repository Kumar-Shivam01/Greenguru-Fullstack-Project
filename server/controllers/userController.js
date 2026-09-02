const asyncErrorHandler = require('../utils/asyncErrorHandler')
const User = require('./../models/userModel')
const CustomError = require('../utils/CustomError')

const getUserData = asyncErrorHandler(async (req, res,next) => {
    const { userId } = req
    const user = await User.findById(userId)
    if (!user) return next(new CustomError('No user found', 404))
    res.status(200).json({
        status: 'success',
        data: {
            name: user.name,
            email: user.email,
            isAccountVerified: user.isAccountVerified
        }
    })
})
module.exports = getUserData