<template>
  <div class="p-6 max-w-2xl mx-auto text-white">
    <h2 class="text-2xl font-bold mb-6 text-orange-400">✏️ 게시글 수정</h2>

    <form @submit.prevent="submitEdit" class="space-y-4">
      <!-- 제목 -->
      <div>
        <label class="block text-sm font-semibold mb-1 text-gray-300">제목</label>
        <input
          v-model="title"
          type="text"
          class="w-full p-2 rounded border text-gray-800"
          required
        />
      </div>

      <!-- 내용 -->
      <div>
        <label class="block text-sm font-semibold mb-1 text-gray-300">내용</label>
        <textarea
          v-model="content"
          rows="6"
          class="w-full p-2 rounded border text-gray-800"
          required
        ></textarea>
      </div>

      <!-- 기존 이미지 -->
      <div v-if="pictureUrl">
        <label class="block text-sm font-semibold mb-1 text-gray-300">기존 이미지</label>
        <img
          :src="pictureUrl"
          alt="기존 이미지"
          class="w-32 h-32 object-cover rounded border"
        />
      </div>

      <!-- 사진 수정 -->
      <div>
        <label class="block text-sm font-semibold mb-1 text-gray-300">사진 수정 (선택)</label>
        <input
          type="file"
          @change="handleFileChange"
          accept="image/*"
          class="text-sm"
        />
      </div>

      <!-- 장소 선택 -->
      <div>
        <label class="block text-sm font-semibold mb-1 text-gray-300">장소 선택</label>
        <select
          v-model="selectedSpot"
          class="w-full p-2 rounded border text-gray-800"
          required
        >
          <option :value="null" disabled>장소를 선택하세요</option>
          <option v-for="spot in spots" :key="spot.id" :value="spot">
            {{ spot.name }}
          </option>
        </select>
      </div>

      <!-- 수정 버튼 -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          수정 완료
        </button>
      </div>
    </form>

    <!-- 로딩 오버레이 -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="text-white text-xl font-semibold animate-pulse">
        수정 중입니다...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'

const route = useRoute()
const router = useRouter()

const id = route.params.id
const title = ref('')
const content = ref('')
const pictureFile = ref(null)
const pictureUrl = ref('')
const spots = ref([])
const selectedSpot = ref(null)
const isLoading = ref(false)

const handleFileChange = (e) => {
  pictureFile.value = e.target.files[0]
}

onMounted(async () => {
  try {
    const spotRes = await api.get('/spot/sun-info-list')
    spots.value = spotRes.data

    const postRes = await api.get(`/post/${id}`)
    const post = postRes.data.data

    title.value = post.title
    content.value = post.content
    pictureUrl.value = post.picture ? `http://localhost:8080${post.picture}` : ''
    selectedSpot.value = spots.value.find(s => s.weatherId === post.weatherId) || null
  } catch (err) {
    alert('게시글 정보를 불러오는 데 실패했습니다.')
    console.error(err)
  }
})

const submitEdit = async () => {
  isLoading.value = true
  try {
    const postDto = {
      title: title.value,
      content: content.value,
      weatherId: selectedSpot.value.id,
    }

    const formData = new FormData()
    formData.append(
      'post',
      new Blob([JSON.stringify(postDto)], {
        type: 'application/json'
      })
    )
    if (pictureFile.value) {
      formData.append('picture', pictureFile.value)
    }

    await api.patch(`/post/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    alert('게시글이 수정되었습니다.')
    router.push(`/board/${id}`)
  } catch (err) {
    console.error(err)
    alert('게시글 수정에 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}
</script>
