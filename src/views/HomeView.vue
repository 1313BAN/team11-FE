<template>
  <div class="w-screen h-screen bg-black text-white flex items-center justify-center">
    <div class="bg-white text-black p-24 rounded-2xl shadow-2xl w-[1200px] space-y-16">
      <!-- 날짜 및 지역 -->
      <div class="text-center text-4xl font-bold">
        📅 {{ currentDate }}
        <div class="text-xl text-gray-600 mt-2">📍 {{ regionName }}</div>
      </div>

      <!-- 본문: 날씨 이미지 + 정보 텍스트 나란히 배치 -->
      <div class="flex items-center justify-center gap-24">
        <!-- 왼쪽: 날씨 이미지 -->
        <div>
          <img v-if="weatherImage" :src="weatherImage" alt="날씨 이미지" class="w-52 h-52" />
        </div>

        <!-- 오른쪽: 일출/일몰 + 현재 날씨 -->
        <div class="space-y-10 text-xl">
          <!-- 일출/일몰 -->
          <div>
            <div class="text-2xl font-semibold text-gray-700 mb-2">🌅 일출 / 일몰</div>
            <div>일출: {{ sunrise }}</div>
            <div>일몰: {{ sunset }}</div>
          </div>

          <!-- 현재 날씨 -->
          <div>
            <div class="text-2xl font-semibold text-gray-700 mb-2">☀️ 현재 날씨</div>
            <div>날씨: {{ rainTypeText }}</div>
            <div>온도: {{ temperature }}</div>
          </div>
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
const regionName = ref('') // 지역명 표시

// ✅ 날씨 텍스트에 따라 이미지 매핑
const weatherImage = computed(() => {
  const text = rainTypeText.value

  if (text.includes('비')) {
    return new URL('@/assets/rain.png', import.meta.url).href
  } else if (text.includes('눈')) {
    return new URL('@/assets/snow.png', import.meta.url).href
  } else if (text.includes('맑음')) {
    return new URL('@/assets/good.png', import.meta.url).href
  } else if (text.includes('흐림') || text.includes('구름')) {
    return new URL('@/assets/cloud.png', import.meta.url).href
  } else {
    return new URL('@/assets/unknown.png', import.meta.url).href
  }
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
      }
    },
    (error) => {
      console.error('📍 위치 정보 가져오기 실패:', error)
    },
  )
})
</script>
