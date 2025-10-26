import axiosInstance from './axios.js'

export const notificationApi = {
  getNotifications: () => 
    axiosInstance.get('/notifications').then(res => res.data),
  
  markAsRead: (notificationId) => 
    axiosInstance.put(`/notifications/${notificationId}/read`).then(res => res.data),
  
  markAllAsRead: () => 
    axiosInstance.put('/notifications/read-all').then(res => res.data),
}