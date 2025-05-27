// src/api/calendar.js
import axios from './axios'

export const fetchCalendarWeather = (spotId) => {
  return axios.get(`/calendar-weather-history/with-history/${spotId}`)
}
