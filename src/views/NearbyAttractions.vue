<template>
  <!-- 전체 화면 정중앙 배치 -->
  <div class="w-screen h-screen flex justify-center items-center bg-black text-white relative">
    <!-- 로딩 오버레이 -->
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <p class="text-white text-xl animate-pulse">잠시만 기다려주세요...</p>
    </div>

    <!-- 콘텐츠 최대 너비 제한 -->
    <div class="max-w-[1400px] w-full px-4">
      <!-- 제목과 콘텐츠 타입 필터 -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold">🗺 {{ spotName }} 주변 관광지</h1>
        <select
          v-model="selectedType"
          class="p-2 border rounded bg-white text-black border-gray-300"
        >
          <option value="">전체 보기</option>
          <option value="관광지">관광지</option>
          <option value="문화시설">문화시설</option>
          <option value="축제공연행사">축제공연행사</option>
          <option value="여행코스">여행코스</option>
          <option value="레포츠">레포츠</option>
          <option value="숙박">숙박</option>
          <option value="쇼핑">쇼핑</option>
          <option value="음식점">음식점</option>
        </select>
      </div>

      <!-- 지도 -->
      <div id="map" class="w-full rounded shadow mb-6" style="height: 700px"></div>

      <!-- 관광지 상세 정보 -->
      <div v-if="selectedAttraction" class="border p-6 rounded shadow bg-white text-black">
        <h2 class="text-2xl font-bold mb-2">{{ selectedAttraction.title }}</h2>
        <img
          v-if="selectedAttraction.firstImage"
          :src="selectedAttraction.firstImage"
          class="w-full max-h-64 object-contain mb-4 rounded"
        />

        <p><strong>주소:</strong> {{ selectedAttraction.addr1 }}</p>
        <p v-if="selectedAttraction.overview" class="mt-2 whitespace-pre-line">
          <strong>소개:</strong><br />
          {{ selectedAttraction.overview }}
        </p>
        <p v-if="selectedAttraction.homepage" class="mt-2">
          <strong>홈페이지:</strong>
          <span v-html="selectedAttraction.homepage" class="text-blue-600 underline"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
/* global kakao */
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchNearbyAttractions } from '@/api/attraction'
import markerBlue from '@/assets/marker-blue.png'
import markerGreen from '@/assets/marker-green.png'

const route = useRoute()
const lat = parseFloat(route.query.lat)
const lon = parseFloat(route.query.lon)
const spotName = route.query.name

const attractions = ref([])
const selectedType = ref('')
const selectedAttraction = ref(null)
const markerList = ref([])
const selectedMarker = ref(null)
const isLoading = ref(true)

let map

const drawCenterMarker = () => {
  const centerImage = new kakao.maps.MarkerImage(
    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
    new kakao.maps.Size(24, 35),
  )

  new kakao.maps.Marker({
    map,
    position: new kakao.maps.LatLng(lat, lon),
    title: spotName,
    image: centerImage,
  })
}

const renderMarkers = () => {
  markerList.value.forEach(({ marker }) => marker.setMap(null))
  markerList.value = []
  selectedAttraction.value = null
  selectedMarker.value = null

  const blueImage = new kakao.maps.MarkerImage(markerBlue, new kakao.maps.Size(24, 35))
  const greenImage = new kakao.maps.MarkerImage(markerGreen, new kakao.maps.Size(24, 35))

  attractions.value.forEach((item) => {
    if (!item.latitude || !item.longitude) return
    if (selectedType.value && item.contentType !== selectedType.value) return

    const marker = new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(item.latitude, item.longitude),
      title: item.title,
      image: blueImage,
    })

    markerList.value.push({ marker, item })

    kakao.maps.event.addListener(marker, 'click', () => {
      selectedAttraction.value = item

      if (selectedMarker.value) {
        selectedMarker.value.setImage(blueImage)
      }

      marker.setImage(greenImage)
      selectedMarker.value = marker
    })
  })
}

onMounted(async () => {
  isLoading.value = true

  const res = await fetchNearbyAttractions(lat, lon, 3, selectedType.value)
  attractions.value = res.data
  await nextTick()

  const waitForKakao = () =>
    new Promise((resolve) => {
      const check = () => {
        if (window.kakao && window.kakao.maps) resolve()
        else setTimeout(check, 100)
      }
      check()
    })

  await waitForKakao()

  kakao.maps.load(() => {
    const container = document.getElementById('map')
    const options = {
      center: new kakao.maps.LatLng(lat, lon),
      level: 6,
    }
    map = new kakao.maps.Map(container, options)

    drawCenterMarker()
    renderMarkers()
    isLoading.value = false
  })
})

watch(selectedType, async () => {
  if (!map) return
  isLoading.value = true
  const res = await fetchNearbyAttractions(lat, lon, 3, selectedType.value)
  attractions.value = res.data
  renderMarkers()
  isLoading.value = false
})
</script>
