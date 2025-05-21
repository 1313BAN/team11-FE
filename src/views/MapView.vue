<script setup>
import { ref, onMounted } from 'vue'
import { fetchSunInfoList } from '@/api/map'

const hoveredMarker = ref(null)
const markers = ref([])

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

// API 호출 및 마커 구성
onMounted(async () => {
  try {
    const res = await fetchSunInfoList()
    markers.value = res.data.map((spot) => ({
      id: spot.spotId,
      name: spot.name,
      sunrise: spot.sunrise_time,
      sunset: spot.sunset_time,
      ...positionMap[spot.spotId],
    }))
  } catch (e) {
    console.error('🌅 마커 불러오기 실패:', e)
  }
})
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center bg-black text-white">
    <div class="relative w-[850px]">
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
          <div class="w-3 h-3 bg-red-500 rounded-full cursor-pointer"></div>

          <!-- Hover 정보 박스 -->
          <div
            v-if="hoveredMarker?.id === marker.id"
            class="mt-1 bg-gray-200 text-black p-2 text-sm w-40 shadow-md z-50"
          >
            <div class="font-bold">{{ marker.name }}</div>
            <div>일출: {{ marker.sunrise }}</div>
            <div>일몰: {{ marker.sunset }}</div>
            <div class="underline mt-1 cursor-pointer">자세히 보기</div>
            <div class="mt-1 text-blue-600 cursor-pointer">달력으로 가기</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
