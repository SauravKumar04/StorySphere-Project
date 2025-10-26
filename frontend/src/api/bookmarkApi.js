import axiosInstance from './axios.js'

export const bookmarkApi = {
  getBookmarks: () => 
    axiosInstance.get('/library').then(res => res.data),
  
  toggleBookmark: (storyId) => 
    axiosInstance.post(`/library/${storyId}`).then(res => res.data),
}