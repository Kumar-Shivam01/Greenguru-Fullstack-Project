const rateLimit = require('express-rate-limit');

// General API Rate Limiter (for general API routes)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 'fail',
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
});

// Strict Auth Rate Limiter (for login, register, reset-password)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'fail',
        message: 'Too many authentication attempts from this IP, please try again after 15 minutes.'
    }
});

// Sensitive OTP Rate Limiter (for send-verify-otp, send-reset-otp)
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 OTP requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'fail',
        message: 'Too many OTP requests from this IP, please try again after 15 minutes.'
    }
});

module.exports = {
    apiLimiter,
    authLimiter,
    otpLimiter
};
