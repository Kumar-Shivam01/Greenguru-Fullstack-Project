const Notification = require('../models/notificationModel');
const Plant = require('../models/plantModel');
const User = require('../models/userModel');
const CustomError = require('../utils/CustomError');
const asyncErrorHandler = require('../utils/asyncErrorHandler');

// Helper to auto-generate dynamic notifications (watering, health, account)
const generateDynamicNotifications = async (userId) => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Check account verification status
    const user = await User.findById(userId);
    if (user && !user.isAccountVerified) {
        const existingNotice = await Notification.findOne({ //check if an already existing notice is there for the same user
            user: userId,
            type: 'account',
            createdAt: { $gte: oneDayAgo },
        });

        if (!existingNotice) { //if not then create a notification for the user
            await Notification.create({
                user: userId,
                type: 'account',
                title: 'Verify Your Account',
                message: 'Your email is not verified yet. Please verify to ensure you never lose access.',
            });
        }
    }

    // 2. Check plant watering & health conditions
    const plants = await Plant.find({ user: userId });
    const now = new Date();

    for (const plant of plants) {
        const intervalDays = plant.careInfo?.waterIntervalDays || 7;
        const lastWateredDate = plant.lastWatered ? new Date(plant.lastWatered) : new Date(plant.createdAt); //if lastWatered is present use it otherwise use the createdAt date 
        const daysSinceWatered = Math.floor((now - lastWateredDate) / (1000 * 60 * 60 * 24));

        // Overdue for watering
        if (daysSinceWatered >= intervalDays) { //if days since watered is greater than or equal to the interval days
            const existingWaterNotice = await Notification.findOne({
                user: userId,
                type: 'watering',
                title: { $regex: plant.nickname, $options: 'i' },
                createdAt: { $gte: oneDayAgo },
            });

            if (!existingWaterNotice) {
                await Notification.create({
                    user: userId,
                    type: 'watering',
                    title: `Water Due: ${plant.nickname}`,
                    message: `${plant.nickname} was last watered ${daysSinceWatered} day${daysSinceWatered === 1 ? '' : 's'} ago. Time to give it a drink!`,
                });
            }
        }

        // Sick or Needs-Attention Health Alert
        if (plant.healthStatus === 'sick' || plant.healthStatus === 'needs-attention') {
            const existingHealthNotice = await Notification.findOne({
                user: userId,
                type: 'health',
                title: { $regex: plant.nickname, $options: 'i' },
                createdAt: { $gte: oneDayAgo },
            });

            if (!existingHealthNotice) {
                await Notification.create({
                    user: userId,
                    type: 'health',
                    title: `Health Alert: ${plant.nickname}`,
                    message: `${plant.nickname} is marked as '${plant.healthStatus}'. ${plant.actionableFix || 'Review the care guide.'}`,
                });
            }
        }
    }
};

// GET /api/v1/notifications
exports.getNotifications = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req;

    // Run dynamic sync for overdue watering, sick plants, and account verification
    await generateDynamicNotifications(userId);

    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

    return res.status(200).json({
        success: true,
        unreadCount,
        count: notifications.length,
        data: notifications,
    });
});

// PATCH /api/v1/notifications/:id/read
exports.markAsRead = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
        { _id: id, user: userId },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        return next(new CustomError('Notification not found', 404));
    }

    return res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: notification,
    });
});

// PATCH /api/v1/notifications/read-all
exports.markAllAsRead = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req;

    await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });

    return res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
    });
});                                                                          

// DELETE /api/v1/notifications/:id
exports.deleteNotification = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req;
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({ _id: id, user: userId });

    if (!notification) {
        return next(new CustomError('Notification not found', 404));
    }

    return res.status(200).json({
        success: true,
        message: 'Notification deleted successfully',
    });
});