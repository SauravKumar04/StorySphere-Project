import axiosInstance from './axios.js'

export const userApi = {
  getUserById: (id) => 
    axiosInstance.get(`/users/${id}`).then(res => res.data),
  
  updateProfile: (profileData) => 
    axiosInstance.put('/users/profile', profileData).then(res => res.data),
  
  toggleFollow: (userId) => 
    axiosInstance.post(`/users/follow/${userId}`).then(res => res.data),
  
  getFollowingFeed: () => 
    axiosInstance.get('/users/following-feed').then(res => res.data),
}