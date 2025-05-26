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
  2: { top: '46.1%', left: '87%' }, // 호미곶
  3: { top: '52%', left: '86%' }, // 문무대왕릉
  4: { top: '57%', left: '85%' }, // 대왕암공원
  5: { top: '63%', left: '78%' }, // 해동용궁사
  6: { top: '92%', left: '30%' }, // 성산일출봉
  7: { top: '15%', left: '25%' }, // 석산곶
  8: { top: '13%', left: '40%' }, // 아차산
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
        <!-- 마커 + Hover 박스를 한 덩어리로 묶음 -->
        <div class="relative flex flex-col items-start">
          <!-- 마커 점 -->
          <!-- 이미지 마커 -->
          <img
            src="@/assets/logo.png"
            alt="마커"
            class="w-6 h-6 object-contain cursor-pointer transition-transform duration-200 hover:scale-125"
          />

          <!-- Hover 정보 박스 -->
          <div
            v-if="hoveredMarker?.id === marker.id"
            class="mt-1 bg-gray-200 text-black p-2 text-sm w-40 shadow-md z-50"
          >
            <div class="font-bold">{{ marker.name }}</div>
            <div>일출: {{ marker.sunrise }}</div>
            <div>일몰: {{ marker.sunset }}</div>
            <button @click="goToNearby(marker)">자세히 보기</button>
            <div class="mt-1 text-blue-600 cursor-pointer" @click="goToCalendar(marker)">
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
