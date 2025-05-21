// src/api/map.js
import axios from './axios'

export async function fetchMyLocationWeather(lat, lon) {
  return await axios.get('/spot/my-location', {
    params: { lat, lon },
  })
}
