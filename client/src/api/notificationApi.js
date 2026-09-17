import axiosClient from './axiosClient';

// Fetch all notifications for the current user (includes unreadCount)
export const getNotifications = async () => {
    const response = await axiosClient.get('/notifications');
    return response.data;
};

// Mark a single notification as read
export const markAsRead = async (id) => {
    const response = await axiosClient.patch(`/notifications/${id}/read`);
    return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
    const response = await axiosClient.patch('/notifications/read-all');
    return response.data;
};

// Delete a notification
export const deleteNotification = async (id) => {
    const response = await axiosClient.delete(`/notifications/${id}`);
    return response.data;
};
