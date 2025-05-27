<template>
  <div class="min-h-screen w-screen bg-black text-white flex justify-center items-center py-20">
    <div class="w-full max-w-[1100px] p-6">
      <!-- 달력 카드 -->
      <div class="bg-white text-black p-10 rounded-xl shadow-xl w-full">
        <!-- 헤더 -->
        <div class="flex justify-between items-center mb-8">
          <button
            @click="prevMonth"
            :disabled="currentMonth.isSame(dayjs().startOf('month'), 'month')"
            class="text-2xl font-bold px-2 disabled:opacity-30"
          >
            ◀
          </button>

          <div class="text-center w-full">
            <h1 class="text-4xl font-extrabold">{{ spotName }}의 일출·일몰 정보</h1>
            <div class="text-xl mt-2 font-semibold text-gray-700">
              {{ currentMonth.format('YYYY년 M월') }}
            </div>
          </div>

          <button
            @click="nextMonth"
            :disabled="currentMonth.add(1, 'month').isAfter(dayjs().add(2, 'month'), 'month')"
            class="text-2xl font-bold px-2 disabled:opacity-30"
          >
            ▶
          </button>
        </div>

        <!-- 요일 헤더 -->
        <div class="grid grid-cols-7 text-center font-bold border-b pb-4 mb-4 text-lg">
          <div v-for="day in ['일', '월', '화', '수', '목', '금', '토']" :key="day">
            {{ day }}
          </div>
        </div>

        <!-- 날짜 셀 -->
        <div class="grid grid-cols-7 text-center gap-px">
          <!-- 공백 -->
          <div v-for="n in startBlank" :key="'blank' + n" class="border h-44 bg-gray-50"></div>

          <!-- 날짜 -->
          <div
            v-for="item in daysInMonth"
            :key="item.date"
            class="border h-44 p-2 flex flex-col justify-start items-center text-sm leading-snug"
          >
            <div class="text-base font-semibold">{{ dayjs(item.date).date() }}</div>
            <div v-if="item.sunriseTime">🌅 {{ item.sunriseTime }}</div>
            <div v-if="item.sunsetTime">🌇 {{ item.sunsetTime }}</div>
            <div v-if="item.weather2023" class="mt-1 text-gray-700">
              2023: {{ item.weather2023.temperature }}℃ / {{ item.weather2023.description }}
            </div>
            <div v-if="item.weather2024" class="text-gray-700">
              2024: {{ item.weather2024.temperature }}℃ / {{ item.weather2024.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchCalendarWeather } from '@/api/calendar'
import dayjs from 'dayjs'

const route = useRoute()
const spotId = route.params.spotId
const spotName = route.query.name || '알 수 없는 장소'
const calendarData = ref([])

const currentMonth = ref(dayjs())

onMounted(async () => {
  const res = await fetchCalendarWeather(spotId)
  calendarData.value = res.data
})

const startBlank = computed(() => {
  const firstDay = currentMonth.value.startOf('month').day()
  return Array.from({ length: firstDay }, (_, i) => i)
})

const daysInMonth = computed(() => {
  const days = []
  const start = currentMonth.value.startOf('month')
  const end = currentMonth.value.endOf('month')
  for (let d = start; d.isBefore(end) || d.isSame(end, 'day'); d = d.add(1, 'day')) {
    const found = calendarData.value.find((item) => dayjs(item.date).isSame(d, 'day'))
    days.push({
      date: d.format('YYYY-MM-DD'),
      sunriseTime: found?.sunriseTime || '',
      sunsetTime: found?.sunsetTime || '',
      weather2023: found?.weather2023 || null,
      weather2024: found?.weather2024 || null,
    })
  }
  return days
})

function prevMonth() {
  const today = dayjs().startOf('month')
  const prev = currentMonth.value.subtract(1, 'month')
  if (prev.isBefore(today)) return
  currentMonth.value = prev
}

function nextMonth() {
  const maxMonth = dayjs().add(2, 'month')
  const next = currentMonth.value.add(1, 'month')
  if (next.isAfter(maxMonth, 'month')) return
  currentMonth.value = next
}
</script>
