<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <!-- 🌐 로딩 중 -->
    <div v-if="isLoading" class="text-white text-xl font-semibold animate-pulse">
      날씨 정보를 불러오는 중...
    </div>

    <!-- ✅ 날씨 정보 렌더링 -->
    <div v-else class="space-y-10">
      <!-- 날짜 및 지역 -->
      <div class="text-center">
        <div class="text-7xl font-bold">📅 {{ currentDate }}</div>
        <div class="text-4xl text-gray-400 mt-6">📍 {{ regionName }}</div>
      </div>

      <!-- 날씨 이미지 -->
      <!-- 날씨 이미지 (가운데 정렬) -->
      <div class="flex justify-center">
        <img
          v-if="weatherImage"
          :src="weatherImage"
          alt="날씨 이미지"
          class="w-80 h-80 object-contain mt-32 mb-12"
        />
      </div>

      <!-- 날씨 정보 (가로 정렬) -->
      <div class="flex gap-12 justify-center text-4xl">
        <!-- 일출/일몰 -->
        <div class="text-center">
          <div class="font-semibold mb-1">🌅 일출 / 일몰</div>
          <div>일출: {{ sunrise }}</div>
          <div>일몰: {{ sunset }}</div>
        </div>

        <!-- 현재 날씨 -->
        <div class="text-center">
          <div class="font-semibold mb-1">☀️ 현재 날씨</div>
          <div>날씨: {{ rainTypeText }}</div>
          <div>온도: {{ temperature }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchMyLocationWeather } from '@/api/spot'

const currentDate = ref('')
const sunrise = ref('')
const sunset = ref('')
const temperature = ref('')
const rainTypeText = ref('')
const regionName = ref('')
const isLoading = ref(true) // ✅ 로딩 상태 추가

const weatherImage = computed(() => {
  const text = rainTypeText.value
  if (text.includes('비')) return new URL('@/assets/weather/rainy.png', import.meta.url).href
  if (text.includes('눈')) return new URL('@/assets/weather/snow.png', import.meta.url).href
  if (text.includes('맑음')) return new URL('@/assets/weather/sunny.png', import.meta.url).href
  if (text.includes('흐림')) return new URL('@/assets/weather/cloudy.png', import.meta.url).href
  return new URL('@/assets/unknown.png', import.meta.url).href
})

const formatDate = () => {
  const today = new Date()
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }
  return today.toLocaleDateString('ko-KR', options)
}

onMounted(() => {
  currentDate.value = formatDate()

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude
      const lon = position.coords.longitude

      try {
        const res = await fetchMyLocationWeather(lat, lon)
        sunrise.value = res.data.sunrise
        sunset.value = res.data.sunset
        temperature.value = res.data.temperature + '℃'
        rainTypeText.value = res.data.rainType || '알 수 없음'
        regionName.value = res.data.regionName || '현재 위치'
      } catch (err) {
        console.error('🌦️ 날씨 API 호출 실패:', err)
      } finally {
        isLoading.value = false // ✅ 완료되면 로딩 종료
      }
    },
    (error) => {
      console.error('📍 위치 정보 가져오기 실패:', error)
      isLoading.value = false
    },
  )
})
</script>
