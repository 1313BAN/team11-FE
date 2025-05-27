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
  <div class="w-screen h-screen/2 flex justify-center items-center">
    <div class="relative w-[400px]">
      <!-- 지도 이미지 -->
      <img src="@/assets/korea.png" class="w-full h-auto" />

      <!-- 마커 + Hover 정보 -->
      <div
        v-for="marker in markers"
        :key="marker.id"
        class="absolute"
        :style="{ top: marker.top, left: marker.left }"
        @mouseenter="hoveredMarker = marker"
        @mouseleave="hoveredMarker = null"
      >
        <!-- 마커와 Hover 박스를 묶은 컨테이너 -->
        <div class="relative flex flex-col items-start">
          <!-- 마커 이미지 -->
          <img
            src="@/assets/marker/marker4.png"
            alt="마커"
            class="w-9 h-9 object-contain cursor-pointer transition-transform duration-200 hover:scale-125"
          />

          <!-- Hover 정보 박스 -->
          <div
            v-if="hoveredMarker?.id === marker.id"
            class="mt-2 bg-gray-100 text-black p-3 w-52 shadow-lg z-50 rounded-lg"
          >
            <!-- 장소명 -->
            <div class="font-bold text-lg mb-2">{{ marker.name }}</div>

            <!-- 추천도 강조 -->
            <div class="text-base font-semibold mb-3">
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

            <!-- 일출 일몰 정보 -->
            <div class="text-sm text-gray-800 mb-3">
              ☀ 일출: {{ marker.sunrise }}<br />
              🌇 일몰: {{ marker.sunset }}
            </div>

            <!-- 버튼 -->
            <button class="text-blue-500 text-sm underline mb-1" @click="goToNearby(marker)">
              자세히 보기
            </button>
            <div
              class="text-blue-700 cursor-pointer text-sm underline"
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
.custom-header {
  background-color: hsla(20, 80%, 55%, 1); /* 오렌지 계열 강조 */
}
</style>
