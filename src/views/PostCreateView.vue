<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">게시글 작성</h2>

    <form @submit.prevent="submitPost" class="space-y-4">
      <div>
        <label for="title" class="block font-semibold mb-1">제목</label>
        <input v-model="title" id="title" type="text" class="w-full border p-2 rounded" required />
      </div>

      <div>
        <label for="content" class="block font-semibold mb-1">내용</label>
        <textarea v-model="content" id="content" rows="6" class="w-full border p-2 rounded" required></textarea>
      </div>

      <div>
        <label for="picture" class="block font-semibold mb-1">사진 업로드</label>
        <input id="picture" type="file" @change="handleFileChange" accept="image/*" />
      </div>
      <div>
  <label for="spot" class="block font-semibold mb-1">장소 선택</label>
  <select v-model="selectedSpot" required>
  <option :value="null" disabled>장소를 선택하세요</option>
  <option v-for="spot in spots" :key="spot.id" :value="spot">
    {{ spot.name }}
  </option>
</select>
</div>


      <div class="flex justify-end">
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          등록
        </button>
      </div>
    </form>
    <!-- 전체 화면 로딩 오버레이 -->
<div
  v-if="isLoading"
  class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
>
  <div class="text-white text-xl font-semibold animate-pulse">
    등록 중입니다...
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createPost } from '@/api/post'
import api from '@/api/axios' 

const router = useRouter()
const title = ref('')
const content = ref('')
const pictureFile = ref(null)
const spots = ref([])
const selectedSpot = ref(null)
const isLoading = ref(false)


const handleFileChange = (e) => {
  pictureFile.value = e.target.files[0]
}

onMounted(async () => {
  try {
    const res = await api.get('/spot/sun-info-list')
    spots.value = res.data
    console.log(spots.value)
  } catch (err) {
    console.error('Spot 목록 불러오기 실패', err)
  }
})

const submitPost = async () => {
  isLoading.value = true
  try {
    const formData = new FormData()
    const postDto = {
      title: title.value,
      content: content.value,
      weatherId: selectedSpot.value.id,
    }
    const jsonBlob = new Blob([JSON.stringify(postDto)], {
      type: 'application/json',
    })

    formData.append('post', jsonBlob)
    if (pictureFile.value) {
      formData.append('picture', pictureFile.value)
    }

    await createPost(formData)
    alert('게시글이 등록되었습니다.')
    router.push('/board')
  } catch (err) {
    console.error(err)
    alert('게시글 등록에 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}



</script>
