import axios from './axios'

export function fetchNearbyAttractions(lat, lon, radiusKm = 3, contentType = '') {
  return axios.get('/attraction/nearby', {
    params: { lat, lon, radiusKm, contentType },
  })
}
