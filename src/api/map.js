// src/api/map.js
import axios from './axios'

export const fetchSunInfoList = () => {
  return axios.get('/spot/sun-info-list')
}
