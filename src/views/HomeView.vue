<template>
  <div class="flex w-full h-[calc(100vh-56px)] bg-black text-white">
    <!-- 왼쪽 정보 패널 -->
    <div class="w-1/4 p-4 bg-gray-800">
      <h2 class="text-lg font-bold mb-4">위치 명</h2>
      <p>일출: 00시 00분</p>
      <p>일몰: 00시 40분</p>
      <button class="mt-2 underline">자세히 보기</button><br />
      <button class="mt-2 bg-blue-600 px-2 py-1 text-white">달력으로 가기</button>
    </div>

    <!-- 지도 영역 -->
    <div class="relative w-3/4">
      <img src="@/assets/korea-map.jpg" class="w-full h-full object-contain" />

      <!-- 마커 예시 (위치는 예시 좌표로 조정 필요) -->
      <div class="absolute top-[30%] left-[50%]">
        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
      </div>

      <div class="absolute top-[60%] left-[40%]">
        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapView',
}
</script>
