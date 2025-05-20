import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true,
})

instance.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err)
)

export default instance
