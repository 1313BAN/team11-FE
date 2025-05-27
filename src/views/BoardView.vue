<template>
  <div class="min-h-screen p-6 max-w-5xl mx-auto">
    <!-- 상단 헤더 -->
    <div class="flex justify-between items-center mb-6 mt-8">
      <h2 class="text-2xl font-bold text-white">📌 게시판</h2>
      <button
        @click="goToCreate"
        class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded shadow"
      >
        글 작성
      </button>
    </div>

    <!-- Spot 필터 -->
    <select v-model="selectedSpotId" class="bg-[#202020] text-white p-2 rounded mb-4 w-full">
      <option value="">전체 보기</option>
      <option v-for="spot in spots" :key="spot.spotId" :value="spot.spotId">🌅 {{ spot.name }}</option>
    </select>

    <!-- 요약 및 평점 -->
    <div v-if="summary" class="bg-[#202020] text-white p-4 rounded mb-6">
      <p class="text-sm mb-1">📝 요약: {{ summary }}</p>
      <p class="text-sm">⭐ AI 평점: {{ averageScore }}점</p>
    </div>

    <!-- 게시글 리스트 -->
    <ul v-if="posts.length > 0" class="grid gap-4">
      <li
        v-for="post in posts"
        :key="post.id"
        class="flex bg-[#202020] rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
        @click="goToDetail(post.id)"
      >
        <!-- 내용 -->
        <div class="p-4 flex-1 text-white">
          <div class="flex items-center gap-2 mb-1">
            <img src="@/assets/logo.png" alt="마커" class="w-5 h-5 object-contain cursor-pointer" />
            <h3 class="text-lg text-orange-500 font-semibold truncate">{{ post.title }}</h3>
          </div>

          <p class="text-sm text-gray-300 mb-1">작성자: {{ post.nickname }}</p>
          <p class="text-sm text-gray-400 line-clamp-2">{{ post.content }}</p>
          <p class="text-sm text-gray-400 mt-1">🌤 {{ post.weatherName }}</p>

          <!-- 본인 글만 수정/삭제 -->
          <div v-if="post.username === username" class="mt-2 space-x-3">
            <button @click.stop="editPost(post.id)" class="text-blue-400 hover:underline">
              수정
            </button>
            <button @click.stop="deletePost(post.id)" class="text-red-400 hover:underline">
              삭제
            </button>
          </div>
        </div>
        <!-- 썸네일 -->
        <img
          v-if="post.picture"
          :src="`http://localhost:8080${post.picture}`"
          alt="썸네일"
          class="w-32 h-32 object-cover rounded-lg"
        />
      </li>
    </ul>

    <!-- 게시글 없음 -->
    <p v-else class="text-gray-400 text-center mt-8">게시글이 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'
import { getPostList, deletePostById } from '@/api/post'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const username = computed(() => userStore.nickname)

const posts = ref([])
const spots = ref([])
const selectedSpotId = ref('')
const summary = ref('')
const averageScore = ref(0)

const goToDetail = (id) => {
  router.push(`/board/${id}`)
}
const goToCreate = () => {
  router.push('/board/create')
}
const editPost = (id) => {
  router.push(`/board/edit/${id}`)
}
const deletePost = async (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await deletePostById(id)
      posts.value = posts.value.filter((p) => p.id !== id)
      alert('삭제 완료')
    } catch (err) {
      console.error(err)
      alert('삭제 실패')
    }
  }
}

// Spot 목록
const fetchSpots = async () => {
  try {
    const res = await api.get('/spot/sun-info-list')
    spots.value = res.data
  } catch (err) {
    console.error('Spot 목록 조회 실패', err)
  }
}

// 게시글 + 요약
const fetchPostsAndSummary = async () => {
  try {
    const res = selectedSpotId.value
      ? await api.get(`/post?spotId=${selectedSpotId.value}`)
      : await getPostList()
    posts.value = res.data.data.posts

    if (selectedSpotId.value) {
      const summaryRes = await api.get(`/summary/${selectedSpotId.value}`)
      summary.value = summaryRes.data.data.summary
      averageScore.value = summaryRes.data.data.averageScore
    } else {
      summary.value = ''
      averageScore.value = 0
    }
  } catch (err) {
    console.error('게시글 또는 요약 조회 실패', err)
  }
}

onMounted(async () => {
  await fetchSpots()
  await fetchPostsAndSummary()
})

watch(selectedSpotId, fetchPostsAndSummary)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
