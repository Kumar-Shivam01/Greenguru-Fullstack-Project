const CustomError = require('../utils/CustomError');
require('dotenv').config()

const devErrors = (res,error)=>{
    res.status(error.statusCode).json({
        status:error.status,
        error:error,
        message:error.message,
        stackTrace:error.stack
    })
}
const prodError=(res,error)=>{
    if(error.isOperational){ //all the errors which we are creating from our CustomError class are set to isOperational = true;
        res.status(error.statusCode).json({
            status:error.status,
            message:error.message
        })
    }else{ //in case of other errors (database errors, programmer errors, etc.) we will send a generic error message.
        res.status(500).json({
            status:'error',
            message:'Something went wrong! Please try again later.'
        })
    }
}
const castErrorHandler=(err)=>{
    const msg = `Invalid value for ${err.path}: ${err}!`
    return new CustomError(msg,400)
}
const duplicateKeyErrorHandler=(err)=>{
    const msg = `Resource with value : "${err.keyValue}" already exists!`
    return new CustomError(msg,400)
}
const validationErrorHandler=(err)=>{
    const errors = Object.values(err.errors).map(val => val.message)
    const erMsgs = errors.join('. ')
    const msg = `Invalid input data! ${erMsgs}`
    return new CustomError(msg,400)
}
const jsonWebTokenError=(err)=>{
    const msg = `Invalid token! Please login again!`
    return new CustomError(msg,401)
}
const tokenExpiredError=(err)=>{
    const msg = `Your session has expired! Please login again!`
    return new CustomError(msg,401)
}
module.exports = ((error,req,res,next)=>{ //global error handling middleware
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        devErrors(res,error)
    }
    else if(process.env.NODE_ENV === 'production'){
        if(error.name === 'CastError') error = castErrorHandler(error)
        if(error.code === 11000) error = duplicateKeyErrorHandler(error)
        if(error.name === 'ValidationError') error = validationErrorHandler(error)
        if(error.name === 'JsonWebTokenError') error = jsonWebTokenError(error)
        if(error.name === 'TokenExpiredError') error = tokenExpiredError(error)  
        prodError(res,error)        
    }
})