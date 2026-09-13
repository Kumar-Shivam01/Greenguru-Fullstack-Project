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
const updateUserProfile = asyncErrorHandler(async (req,res,next)=>{
    const {userId} = req;
    const {name} = req.body;
    if(!name?.trim()) return next(new CustomError('Please enter your name',400))
    const user = await User.findByIdAndUpdate(userId,{name: name.trim()},{new: true, runValidators: true})
    
    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data:{
            name: user.name,
            email: user.email,
            isAccountVerified: user.isAccountVerified
        }
    })
})
module.exports = {getUserData,updateUserProfile}