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

      <div class="flex justify-end">
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          등록
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createPost } from '@/api/post'

const router = useRouter()
const title = ref('')
const content = ref('')
const pictureFile = ref(null)

const handleFileChange = (e) => {
  pictureFile.value = e.target.files[0]
}
const goToCreate = () => {
  router.push('/board/create') // 작성 페이지 경로로 이동
}


const submitPost = async () => {
  try {
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('content', content.value)
    if (pictureFile.value) {
      formData.append('picture', pictureFile.value)
    }

    await createPost(formData)
    alert('게시글이 등록되었습니다.')
    router.push('/board')
  } catch (err) {
    console.error(err)
    alert('게시글 등록에 실패했습니다.')
  }
}
</script>
