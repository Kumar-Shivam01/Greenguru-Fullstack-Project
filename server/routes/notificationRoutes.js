const express = require('express')
const protectedRoute = require('../middlewares/protectedRoute')

const {getNotifications,markAsRead,markAllAsRead,deleteNotification} = require('../controllers/notificationController')
const noticeRouter = express.Router();
noticeRouter.use(protectedRoute);

noticeRouter.route('/').get(getNotifications)
noticeRouter.route('/read-all').patch(markAllAsRead)
noticeRouter.route('/:id/read').patch(markAsRead)
noticeRouter.route('/:id').delete(deleteNotification)

module.exports = noticeRouter