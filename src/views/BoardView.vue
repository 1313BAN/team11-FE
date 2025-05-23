<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">게시판</h2>
      <button
        @click="goToCreate"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        글 작성
      </button>
    </div>

    <ul v-if="posts.length > 0" class="grid gap-4">
      <li
        v-for="post in posts"
        :key="post.id"
        @click="goToDetail(post.id)"
        class="flex border rounded-lg overflow-hidden hover:shadow cursor-pointer transition"
      >
        <!-- 썸네일 -->
        <img
          v-if="post.picture"
          :src="post.picture"
          alt="썸네일"
          class="w-32 h-32 object-cover"
        />
        <div class="p-4 flex-1">
          <h3 class="text-lg font-semibold mb-1 truncate">{{ post.title }}</h3>
          <p class="text-sm text-gray-600 mb-1">작성자: {{ post.username }}</p>
          <p class="text-sm text-gray-700 line-clamp-2">{{ post.content }}</p>
        </div>
      </li>
    </ul>
    <p v-else class="text-gray-500">게시글이 없습니다.</p>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPostList } from '@/api/post'

const posts = ref([])
const router = useRouter()

onMounted(async () => {
  const res = await getPostList()
  posts.value = res.data.data.posts
})

const goToDetail = (id) => {
  console.log(id)
  router.push(`/board/${id}`)
}
const goToCreate = () => {
  router.push('/board/create') // 작성 페이지 경로로 이동
}

</script>
