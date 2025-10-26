import axiosInstance from './axios.js'

export const commentApi = {
  getComments: (storyId) => 
    axiosInstance.get(`/stories/${storyId}/comments`).then(res => res.data),
  
  addComment: (storyId, content) => 
    axiosInstance.post(`/stories/${storyId}/comments`, { content }).then(res => res.data),
  
  deleteComment: (commentId) => 
    axiosInstance.delete(`/comments/${commentId}`).then(res => res.data),
}