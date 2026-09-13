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
const changePassword = asyncErrorHandler(async (req,res,next)=>{
    const {currentPassword, newPassword} = req.body;
    if(!currentPassword || !newPassword) return next(new CustomError('Current and new password are required',400))
    
    const user = await User.findById(req.userId).select('+password');
    const isCurrentPasswordValid = await user.comparePassword(currentPassword,user.password);
    if(!isCurrentPasswordValid) return next(new CustomError('Your current password is incorrect',400))
    
    user.password = newPassword;
    await user.save();
    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    })

})
module.exports = {getUserData,updateUserProfile,changePassword}