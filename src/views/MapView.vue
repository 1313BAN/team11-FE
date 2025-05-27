<script setup>
import { ref, onMounted } from 'vue'
import { fetchSunInfoList } from '@/api/map'
import { useRouter } from 'vue-router'

const hoveredMarker = ref(null)
const markers = ref([])

const router = useRouter()

function goToCalendar(marker) {
  console.log('➡️ 이동할 marker:', marker)
  router.push({
    name: 'CalendarView',
    params: { spotId: marker.id },
    query: { name: marker.name },
  })
}
const goToNearby = (spot) => {
  console.log('🔍 marker:', spot) // ✅ 여기에 추가
  router.push({
    name: 'NearbyAttractions',
    query: {
      lat: spot.latitude,
      lon: spot.longitude,
      name: spot.name,
    },
  })
}

// 지도 위에서의 마커 위치 % 수기 매핑
const positionMap = {
  1: { top: '15%', left: '72%' }, // 정동진
  2: { top: '46.1%', left: '82%' }, // 호미곶
  3: { top: '52%', left: '81%' }, // 문무대왕릉
  4: { top: '57%', left: '77%' }, // 대왕암공원
  5: { top: '59%', left: '72%' }, // 해동용궁사
  6: { top: '90%', left: '25%' }, // 성산일출봉
  7: { top: '15%', left: '20%' }, // 석산곶
  8: { top: '13%', left: '38%' }, // 아차산
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
      <!-- ✅ 세로 기준 확대 -->
      <!-- 지도 이미지 -->
      <img src="@/assets/korea.png" class="h-full object-contain" />

      <!-- 마커 + Hover 정보 -->
      <div
        v-for="marker in markers"
        :key="marker.id"
        class="absolute"
        :style="{ top: marker.top, left: marker.left }"
        @mouseenter="hoveredMarker = marker"
        @mouseleave="hoveredMarker = null"
      >
        <div class="relative flex flex-col items-start">
          <img
            src="@/assets/marker/marker4.png"
            alt="마커"
            class="w-9 h-9 object-contain cursor-pointer transition-transform duration-200 hover:scale-125"
          />
          <div
            v-if="hoveredMarker?.id === marker.id"
            class="mt-4 bg-gray-100 text-black px-6 py-5 w-72 sm:w-80 md:w-96 shadow-2xl z-50 rounded-2xl transition-all duration-200"
          >
            <div class="font-bold text-xl sm:text-3xl mb-4">{{ marker.name }}</div>

            <div class="text-lg sm:text-2xl font-semibold mb-4">
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

            <div class="text-base sm:text-xl text-gray-800 mb-5 leading-relaxed">
              ☀ <strong>일출:</strong> {{ marker.sunrise }}<br />
              🌇 <strong>일몰:</strong> {{ marker.sunset }}
            </div>

            <button
              class="text-blue-600 text-base sm:text-lg underline font-xl mb-3"
              @click="goToNearby(marker)"
            >
              자세히 보기
            </button>

            <div
              class="text-blue-700 cursor-pointer text-base sm:text-lg underline font-xl"
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
