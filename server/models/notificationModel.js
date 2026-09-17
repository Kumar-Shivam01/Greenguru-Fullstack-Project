const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ["watering","health","plant-activity","account","ai-insight"],
        required: true
    },
    title:{
        type: String,
        required: [true, 'Notification title is required.'],
        trim: true
    },
    message:{
        type: String,
        required: [true,'Notification message is required'],
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
},{timestamps:true})

//fetch user's notifications sorted nwest-first, filter by read status
notificationSchema.index({user: 1,isRead: 1,createdAt: -1})  
const Notification = mongoose.models.Notification || mongoose.model('Notification',notificationSchema)

module.exports = Notification