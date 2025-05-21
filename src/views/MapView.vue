<script setup>
import { ref, onMounted } from 'vue'
import { fetchSunInfoList } from '@/api/map'

const hoveredMarker = ref(null)
const markers = ref([])

// 지도 위치 수기 매핑
const positionMap = {
  1: { top: '15%', left: '72%' },
  2: { top: '46.1%', left: '87%' },
  3: { top: '52%', left: '86%' },
  4: { top: '57%', left: '85%' },
  5: { top: '63%', left: '78%' },
  6: { top: '92%', left: '30%' },
  7: { top: '15%', left: '25%' },
  8: { top: '13%', left: '40%' },
}

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

      <!-- 마커 + 호버 -->
      <div
        v-for="marker in markers"
        :key="marker.id"
        class="absolute"
        :style="{ top: marker.top, left: marker.left }"
      >
        <!-- 마커 -->
        <div
          class="w-3 h-3 bg-red-500 rounded-full cursor-pointer"
          @mouseover="hoveredMarker = marker"
          @mouseleave="hoveredMarker = null"
        ></div>

        <!-- Hover 정보 박스 -->
        <div
          v-if="hoveredMarker?.id === marker.id"
          class="absolute left-4 top-[-20px] bg-gray-200 text-black p-2 text-sm w-40 shadow-md z-50"
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
</template>
