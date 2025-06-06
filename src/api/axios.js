// src/api/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
