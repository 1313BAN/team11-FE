import axios from './axios'

export async function fetchCalendarWeather(spotId) {
  return await axios.get(`/calendar-weather/${spotId}`)
}
