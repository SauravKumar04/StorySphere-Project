import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Stories API
export const storyAPI = {
  getAll: () => api.get('/stories'),
  getById: (id) => api.get(`/stories/${id}`),
  create: (storyData) => api.post('/stories', storyData),
  update: (id, storyData) => api.put(`/stories/${id}`, storyData),
  delete: (id) => api.delete(`/stories/${id}`),
  like: (id) => api.post(`/stories/${id}/like`),
  addComment: (id, comment) => api.post(`/stories/${id}/comments`, comment),
  getComments: (id) => api.get(`/stories/${id}/comments`),
};

// Chapters API
export const chapterAPI = {
  getByStory: (storyId) => api.get(`/chapters/${storyId}`),
  create: (storyId, chapterData) => api.post(`/chapters/${storyId}`, chapterData),
  update: (chapterId, chapterData) => api.put(`/chapters/${chapterId}`, chapterData),
  delete: (chapterId) => api.delete(`/chapters/${chapterId}`),
};

// Users API
export const userAPI = {
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  toggleFollow: (id) => api.post(`/users/follow/${id}`),
  getFollowingFeed: () => api.get('/users/following-feed'),
};

// Library API
export const libraryAPI = {
  getBookmarks: () => api.get('/library'),
  toggleBookmark: (storyId) => api.post(`/library/${storyId}`),
};

// Notifications API
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api;