// src/api/user.js
import api from './axios'

export const fetchUserInfo = () => api.get('/user/me')
