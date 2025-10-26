import axiosInstance from './axios.js'

export const storyApi = {
  getAllStories: () => 
    axiosInstance.get('/stories').then(res => res.data),
  
  getStoryById: (id) => 
    axiosInstance.get(`/stories/${id}`).then(res => res.data),
  
  createStory: (storyData) => 
    axiosInstance.post('/stories', storyData).then(res => res.data),
  
  updateStory: (id, storyData) => 
    axiosInstance.put(`/stories/${id}`, storyData).then(res => res.data),
  
  deleteStory: (id) => 
    axiosInstance.delete(`/stories/${id}`).then(res => res.data),
  
  toggleLike: (storyId) => 
    axiosInstance.post(`/stories/${storyId}/like`).then(res => res.data),
}