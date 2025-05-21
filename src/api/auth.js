// src/api/auth.js
import api from './axios'

export const login = (payload) => api.post('/auth/login', payload)
export const signup = (payload) => api.post('/auth/signup', payload)
