<template>
  <div class="p-6 max-w-3xl mx-auto text-white">
    <!-- 제목 + 버튼 -->
    <div class="flex justify-between items-start mb-2">
      <div class="flex items-center gap-2">
        <img
          src="@/assets/logo.png"
          alt="로고"
          class="w-5 h-5 object-contain"
        />
        <h2 class="text-2xl font-bold text-orange-400">{{ post.title }}</h2>
      </div>

      <div v-if="post.username === username" class="space-x-2 text-sm">
        <button @click="editPost" class="text-blue-400 hover:underline">수정</button>
        <button @click="deletePost" class="text-red-400 hover:underline">삭제</button>
      </div>
    </div>

    <!-- 작성자 및 날씨 -->
    <p class="text-sm text-gray-300 mb-1">작성자: {{ post.nickname }}</p>
    <p class="text-sm text-gray-400 mb-4">장소: {{ post.weatherName }}</p>

    <!-- 이미지 -->
    <img
      v-if="post.picture"
      :src="`http://localhost:8080${post.picture}`"
      alt="썸네일"
      class="w-full max-w-xl h-auto rounded-lg shadow mb-6 object-contain border"
    />

    <!-- 내용 -->
    <p class="mb-6 whitespace-pre-wrap leading-relaxed text-gray-200">{{ post.content }}</p>

    <!-- 댓글 작성 -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-100 mb-2">댓글 작성</h3>
      <textarea
        v-model="newComment"
        class="w-full border p-2 rounded text-gray-900"
        rows="3"
        placeholder="댓글을 입력하세요"
      ></textarea>
      <button
        @click="submitComment"
        class="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
      >
        작성
      </button>
    </div>

    <!-- 댓글 리스트 -->
    <h3 class="text-lg font-semibold text-gray-100 mb-3">댓글</h3>
    <div v-if="post.comments.length === 0" class="text-gray-400">댓글이 없습니다.</div>
    <ul class="space-y-2">
      <li
        v-for="comment in post.comments"
        :key="comment.id"
        class=" p-3 rounded bg-[#202020]"
      >
        <div class="flex justify-between items-center">
          <span class="text-sm font-semibold text-orange-300">{{ comment.username }}</span>
          <div
            v-if="comment.username === username"
            class="text-xs space-x-2 text-blue-400"
          >
            <button @click="openEditModal(comment)">수정</button>
            <button @click="deleteComment(comment.id)" class="text-red-400">삭제</button>
          </div>
        </div>
        <p class="mt-2 text-sm text-gray-200">{{ comment.content }}</p>
      </li>
    </ul>

    <!-- 댓글 수정 모달 -->
    <div
  v-if="showEditModal"
  class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
>
  <div
    class="w-full max-w-md rounded-xl p-6 relative"
    :style="{ backgroundColor: 'hsla(0, 0%, 17%, 0.95)', color: '#f5f5f5' }"
  >
    <!-- 헤더 -->
    <h3 class="text-lg font-semibold text-gray-200 mb-4">✏️ 댓글 수정</h3>

    <!-- 입력 필드 -->
    <textarea
      v-model="editContent"
      rows="4"
      class="w-full p-2 rounded border text-gray-800"
      placeholder="댓글을 수정하세요"
    ></textarea>

    <!-- 버튼 -->
    <div class="mt-4 flex justify-end gap-2">
      <button
        @click="showEditModal = false"
        class="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
      >
        취소
      </button>
      <button
        @click="confirmEdit"
        class="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white"
      >
        저장
      </button>
    </div>
  </div>
</div>

  </div>
</template>


<script setup>
import { ref,computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostDetail, createComment, removeComment, updateComment } from '@/api/post'
import { useUserStore } from '@/stores/user'
import { deletePostById } from '@/api/post'


const router = useRouter()
const userStore = useUserStore()

const route = useRoute()
const post = ref({ comments: [] })
const newComment = ref('')
const editContent = ref('')
const editingId = ref(null)
const username = computed(() => userStore.username)
const showEditModal = ref(false)
const editingCommentId = ref(null)


const fetchPost = async () => {
  try {
    const res = await getPostDetail(route.params.id)
    post.value = res.data.data
  } catch (err) {
    alert('게시글을 불러오는 중 오류가 발생했습니다.')
  }
}

const editPost = () => {
  router.push(`/board/edit/${post.value.id}`)
}

const deletePost = async () => {
  if (!confirm('정말 게시글을 삭제하시겠습니까?')) return
  try {
    await deletePostById(post.value.id)
    alert('게시글이 삭제되었습니다.')
    router.push('/board')
  } catch (err) {
    console.error(err)
    alert('게시글 삭제에 실패했습니다.')
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

const openEditModal = (comment) => {
  editingCommentId.value = comment.id
  editContent.value = comment.content
  showEditModal.value = true
}
const confirmEdit = async () => {
  try {
    await updateComment(editingCommentId.value, editContent.value)
    showEditModal.value = false
    editContent.value = ''
    editingCommentId.value = null
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

.custom {
  background-color: hsla(0, 0%, 2%, 0.536);
}

.custom-edit {
  background-color: hsla(0, 0%, 2%,100);
}
</style>
