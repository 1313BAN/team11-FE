<script setup>
import { ref } from 'vue'

// 현재 마우스 올린 마커 정보를 저장
const hoveredMarker = ref(null)

// 마커 목록
const markers = [
  {
    id: 1,
    name: '서울',
    top: '30%',
    left: '60%',
    sunrise: '06:00',
    sunset: '18:30',
  },
  {
    id: 2,
    name: '제주',
    top: '85%',
    left: '50%',
    sunrise: '06:10',
    sunset: '18:45',
  },
]
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center bg-black text-white">
    <div class="relative w-[850px]">
      <!-- 지도 이미지 -->
      <img src="@/assets/korea-map.jpg" class="w-full h-auto" />

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
