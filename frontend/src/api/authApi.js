import axiosInstance from './axios.js'

export const authApi = {
  login: (email, password) => 
    axiosInstance.post('/auth/login', { email, password }).then(res => res.data),
  
  register: (username, email, password) => 
    axiosInstance.post('/auth/register', { username, email, password }).then(res => res.data),
  
  getMe: () => 
    axiosInstance.get('/auth/me').then(res => res.data),
}