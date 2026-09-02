const nodemailer = require('nodemailer');
const asyncErrorHandler = require('./../utils/asyncErrorHandler')

const sendEmail = asyncErrorHandler(async (options)=>{
    //transporter creation
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        post: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    //email options creation
    const emailOptions = {
        from: 'GreenGuru support<support@GreenGuru.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    }
    await transporter.sendMail(emailOptions)
})
module.exports = sendEmail