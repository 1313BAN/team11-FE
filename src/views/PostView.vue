<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-2">{{ post.title }}</h2>
    <p class="text-gray-600 mb-1">작성자: {{ post.username }}</p>
    <p class="mb-6 whitespace-pre-wrap">{{ post.content }}</p>

    <!-- 댓글 작성 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">댓글 작성</h3>
      <textarea v-model="newComment" class="w-full border p-2 rounded" rows="3" placeholder="댓글을 입력하세요"></textarea>
      <button @click="submitComment" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">작성</button>
    </div>

    <!-- 댓글 리스트 -->
    <h3 class="text-lg font-semibold mt-8 mb-3">댓글</h3>
    <div v-if="post.comments.length === 0" class="text-gray-500">댓글이 없습니다.</div>
    <ul class="space-y-2">
      <li v-for="comment in post.comments" :key="comment.id" class="border p-3 rounded">
        <div class="flex justify-between items-center">
          <span class="text-sm font-semibold">{{ comment.username }}</span>
          <div v-if="comment.username === myUsername" class="text-xs space-x-2 text-blue-500">
            <button @click="editComment(comment)">수정</button>
            <button @click="deleteComment(comment.id)" class="text-red-500">삭제</button>
          </div>
        </div>
        <div v-if="editingId === comment.id">
          <textarea v-model="editContent" class="w-full mt-2 border p-2 rounded"></textarea>
          <div class="mt-2 space-x-2">
            <button @click="confirmEdit(comment.id)" class="bg-green-500 text-white px-2 py-1 rounded">저장</button>
            <button @click="cancelEdit" class="bg-gray-300 px-2 py-1 rounded">취소</button>
          </div>
        </div>
        <p v-else class="mt-1 text-sm">{{ comment.content }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPostDetail, createComment, removeComment, updateComment } from '@/api/post'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const post = ref({ comments: [] })
const newComment = ref('')
const editContent = ref('')
const editingId = ref(null)
const myUsername = useUserStore().username

const fetchPost = async () => {
  try {
    const res = await getPostDetail(route.params.id)
    post.value = res.data.data
  } catch (err) {
    alert('게시글을 불러오는 중 오류가 발생했습니다.')
  }
}

onMounted(fetchPost)

const submitComment = async () => {
  if (!newComment.value.trim()) {
    alert('댓글을 입력해주세요.')
    return
  }
  try {
    await createComment(route.params.id, newComment.value)
    newComment.value = ''
    await fetchPost()
  } catch (err) {
    alert('댓글 작성에 실패했습니다.')
  }
}

const deleteComment = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await removeComment(id)
    await fetchPost()
  } catch (err) {
    alert('댓글 삭제에 실패했습니다.')
  }
}

const editComment = (comment) => {
  editingId.value = comment.id
  editContent.value = comment.content
}

const confirmEdit = async (id) => {
  try {
    await updateComment(id, editContent.value)
    editingId.value = null
    editContent.value = ''
    await fetchPost()
  } catch (err) {
    alert('댓글 수정에 실패했습니다.')
  }
}

const cancelEdit = () => {
  editingId.value = null
  editContent.value = ''
}
</script>

<style scoped>
textarea {
  resize: vertical;
}
</style>
