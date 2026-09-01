const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please enter your name.']
    },
    email:{
        type: String,
        required: [true,'Please enter your email.'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail,'Please provide a valid email.']
    },
    password:{
        type: String,
        select: false,
        required: [true,'Password is required'],
        minLength:[6,'Password must be at least 6 characters long.']
    },
    verifyOtp:{
        type: String,
        default: '',
        select: false
    },
    verifyOtpExpireAt:{
        type: Number,
        default: 0,
        select: false
    },
    isAccountVerified:{
        type: Boolean,
        default: false
    },
    resetOtp:{
        type: String,
        default: '',
        select: false
    },
    resetOtpExpireAt:{
        type: Number,
        default: 0,
        select: false
    },
    passwordChangedAt:{
        type: Date,
    },
})
//password encryption/hashing before saving the document
userSchema.pre('save',async function(){
    if(!this.isModified('password')) return; //checks if password is modified or not
    this.password = await bcrypt.hash(this.password,12); //encrypting the password using bcrypt
})
//method to compare password
userSchema.methods.comparePasswordInDB = async function(pswd,pswdInDB){
    return await bcrypt.compare(pswd,pswdInDB)
}
const User = mongoose.models.user || mongoose.model('User',userSchema)
module.exports = User