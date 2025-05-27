<script setup>
import { ref, onMounted } from 'vue'
import { fetchSunInfoList } from '@/api/map'
import { useRouter } from 'vue-router'

const hoveredMarkerId = ref(null) // ✅ 마커 + 박스 hover 추적용
const markers = ref([])

const router = useRouter()

function goToCalendar(marker) {
  router.push({
    name: 'CalendarView',
    params: { spotId: marker.id },
    query: { name: marker.name },
  })
}

function goToNearby(spot) {
  router.push({
    name: 'NearbyAttractions',
    query: {
      lat: spot.latitude,
      lon: spot.longitude,
      name: spot.name,
    },
  })
}

// 추천도에 따른 마커 이미지 선택
function getMarkerImage(recommendation) {
  switch (recommendation) {
    case '추천':
      return new URL('@/assets/marker/good.png', import.meta.url).href
    case '보통':
      return new URL('@/assets/marker/soso.png', import.meta.url).href
    case '비추천':
      return new URL('@/assets/marker/bad.png', import.meta.url).href
    case '위험':
      return new URL('@/assets/marker/danger.png', import.meta.url).href
    default:
      return new URL('@/assets/marker/default.png', import.meta.url).href
  }
}

// 지도 위 마커 위치 (수기 % 좌표)
const positionMap = {
  1: { top: '15%', left: '72%' },
  2: { top: '46.1%', left: '82%' },
  3: { top: '52%', left: '81%' },
  4: { top: '57%', left: '77%' },
  5: { top: '59%', left: '72%' },
  6: { top: '90%', left: '25%' },
  7: { top: '15%', left: '20%' },
  8: { top: '13%', left: '38%' },
}

onMounted(async () => {
  try {
    const res = await fetchSunInfoList()
    markers.value = res.data.map((spot) => ({
      id: spot.spotId,
      name: spot.name,
      sunrise: spot.sunriseTime,
      sunset: spot.sunsetTime,
      latitude: spot.lat,
      longitude: spot.lon,
      recommendation: spot.recommendationLevel,
      ...positionMap[spot.spotId],
    }))
  } catch (e) {
    console.error('🌅 마커 불러오기 실패:', e)
  }
})
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center">
    <div class="relative h-[90vh]">
      <!-- 지도 이미지 -->
      <img src="@/assets/korea.png" class="h-full object-contain" />

      <!-- 마커 + Hover 정보 -->
      <div
        v-for="marker in markers"
        :key="marker.id"
        class="absolute"
        :style="{ top: marker.top, left: marker.left }"
        @mouseenter="hoveredMarkerId = marker.id"
        @mouseleave="hoveredMarkerId = null"
      >
        <div class="relative flex flex-col items-start">
          <!-- 마커 이미지 -->
          <img
            :src="getMarkerImage(marker.recommendation)"
            alt="마커"
            :class="[
              'w-6 h-6 object-contain cursor-pointer transition-transform duration-200',
              hoveredMarkerId === marker.id ? 'rotate-animation' : '',
            ]"
          />

          <!-- Hover 정보 박스 -->
          <div
            v-if="hoveredMarkerId === marker.id"
            :class="[
              'absolute z-50 bg-gray-100 text-orange-600 px-6 py-5 w-72 sm:w-80 md:w-96 shadow-2xl rounded-2xl transition-all duration-200',
              parseFloat(marker.top) > 70 ? 'translate-y-[-100%] mt-2' : 'mt-4',
            ]"
            @mouseenter="hoveredMarkerId = marker.id"
            @mouseleave="hoveredMarkerId = null"
          >
            <div class="font-bold text-xl sm:text-3xl mb-4">{{ marker.name }}</div>

            <div class="text-black text-lg sm:text-2xl font-semibold mb-4">
              🌅 관람:
              <span
                :class="{
                  'text-green-600 font-bold': marker.recommendation === '추천',
                  'text-yellow-600 font-bold': marker.recommendation === '보통',
                  'text-red-600 font-bold': marker.recommendation === '비추천',
                  'text-pink-700 font-bold': marker.recommendation === '위험',
                }"
              >
                {{ marker.recommendation }}
              </span>
            </div>

            <div class="font-bold sm:text-xl text-gray-800 mb-5 leading-relaxed">
              ☀ <strong>일출:</strong> {{ marker.sunrise }}<br />
              🌇 <strong>일몰:</strong> {{ marker.sunset }}
            </div>

            <button
              class="text-orange-600 font-bold sm:text-lg underline font-xl mb-3"
              @click="goToNearby(marker)"
            >
              자세히 보기
            </button>

            <div
              class="text-orange-700 font-bold cursor-pointer text-base sm:text-lg underline font-xl"
              @click="goToCalendar(marker)"
            >
              달력으로 가기
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes rotateMarker {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.rotate-animation {
  animation: rotateMarker 1.2s linear infinite;
}
</style>
