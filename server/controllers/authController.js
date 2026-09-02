const User = require('../models/userModel')
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const CustomError = require('../utils/CustomError')
const jwt = require('jsonwebtoken')
const ms = require('ms')
require('dotenv').config();

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_STR, { expiresIn: process.env.JWT_EXPIRE })
}
exports.register = asyncErrorHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new CustomError('Please provide you name, email and password for signup.', 400))
    }
    const existingUser = User.findOne({ email });
    if (existingUser) {
        return next(new CustomError('User already exists. Please login.', 400))
    }
    const user = await User.create(req.body);
    const token = signToken(user._id)
    res.cookie('rememberme', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // important for cookies to work in different domains
        maxAge: ms(process.env.JWT_EXPIRE)
    })
    res.status(201).json({
        status: 'success',
        data:{
            id: user._id,
            name: user.name,
            email: user.email
        }
    })
})