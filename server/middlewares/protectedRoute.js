const jwt = require('jsonwebtoken')
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const CustomError = require('../utils/CustomError')
const User = require('../models/userModel')
require('dotenv').config()

exports.protectedRoute = asyncErrorHandler(async(req,res,next)=>{
    let token;
    if(req.cookies.rememberme){
        token = req.cookies.rememberme;
    }
    if(!token){
        return next(new CustomError('You are not logged in. Please log in to continue.', 401))
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_STR);
    const currentUser = await User.findById(decodedToken.id);
    if(!currentUser){
        return next(new CustomError('The user belonging to this token does not exist.', 401))
    }
    req.userId = currentUser.id;
    next();
})