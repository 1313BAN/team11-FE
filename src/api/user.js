// src/api/user.js
import api from './axios'

export const fetchUserInfo = () => api.get('/user/me')
export const signup = (payload) => api.post('/user/create', payload)
