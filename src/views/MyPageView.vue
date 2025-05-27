<template>
  <div class="flex flex-col items-center pt-12 min-h-screen bg-[hsla(0,0%,17%,0.95)] text-[#f5f5f5] px-4">
    <!-- 🔹 사용자 정보 카드 -->
    <!-- 전체 가로를 채우는 배경 박스 -->
<div class="w-full bg-[#202020] rounded-xl shadow-md p-6 mb-10">
  <!-- 중앙에 고정된 내용 컨테이너 -->
  <div class="max-w-md mx-auto">
    <h2 class="custom-text text-4xl font-bold text-center mb-8">마이페이지</h2>

    <div class="space-y-6">
      <!-- 아이디 -->
      <div>
        <label class="block text-2xl text-gray-400 mb-1">아이디</label>
        <p class="text-xl font-bold text-white">{{ username }}</p>
      </div>

      <!-- 닉네임 -->
      <div>
        <label class="block text-2xl text-gray-400 mb-1">닉네임</label>
        <div class="flex justify-between items-center">
          <p class="text-xl font-bold text-white">{{ nickname }}</p>
          <Button
            @click="showNicknameModal = true"
            label="수정"
            text
            class="text-orange-400 hover:underline text-lg"
          />
        </div>
      </div>

      <!-- 비밀번호 -->
      <div>
        <label class="block text-2xl text-gray-400 mb-1">비밀번호</label>
        <div class="flex justify-between items-center">
          <p class="text-lg font-bold text-white">••••••••</p>
          <Button
            @click="showPasswordModal = true"
            label="수정"
            text
            class="text-orange-400 hover:underline text-lg"
          />
        </div>
      </div>
    </div>

    <!-- 계정 삭제 -->
    <div class="mt-10 border-t border-gray-700 pt-6 text-center">
      <Button
        label="계정 삭제하기"
        class="w-full text-white rounded hover:opacity-85 transition text-xl"
        :style="{ backgroundColor: 'hsla(20, 80%, 55%, 1)' }"
        @click="confirmDelete"
      />
    </div>
  </div>
</div>


<!-- ✅ 내가 쓴 글 그리드 뷰 -->
<div v-if="myPosts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  <div
    v-for="post in myPosts"
    :key="post.id"
    class="relative bg-[#2a2a2a] rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer group"
    @click="router.push({ name: 'detail', params: { id: post.id } })"
  >
    <!-- 썸네일 -->
    <img
      v-if="post.picture"
      :src="`http://localhost:8080${post.picture}`"
      alt="썸네일"
      class="w-full h-48 object-cover"
    />
    <div v-else class="w-full h-48 bg-gray-700 flex items-center justify-center text-white">
      No Image
    </div>

    <!-- 🔻 오버레이 텍스트 (날짜 + 장소) -->
    <div class="overlay absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white text-xs px-3 py-2 flex justify-between">
      <span class="truncate"> {{ post.weatherName }}</span>
      <span>{{ formatDate(post.createAt) }}</span>
    </div>


  </div>
</div>



    <!-- 모달들 -->
    <NicknameModal v-if="showNicknameModal" :currentNickname="nickname" @close="showNicknameModal = false" />
    <PasswordModal v-if="showPasswordModal" @close="showPasswordModal = false" />
  </div>
</template>



<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchUserInfo, deleteAccount } from '@/api/user'
import { getMyPostList } from '@/api/post'
import { useUserStore } from '@/stores/user'

import Button from 'primevue/button'
import NicknameModal from '@/components/NicknameUpdateModal.vue'
import PasswordModal from '@/components/PasswordUpdateModal.vue'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const nickname = computed(() => userStore.nickname)
const showNicknameModal = ref(false)
const showPasswordModal = ref(false)
const myPosts = ref([])

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

onMounted(async () => {
  try {
    const res = await fetchUserInfo()
    username.value = res.data.data.username
    nickname.value = res.data.data.nickname

    const postRes = await getMyPostList()
    myPosts.value = postRes.data.data.posts
  } catch (e) {
    alert('사용자 정보 또는 게시글 불러오기 실패')
  }
})

const confirmDelete = async () => {
  if (confirm('정말로 계정을 삭제하시겠습니까?')) {
    try {
      await deleteAccount()
      userStore.logout()
      router.push('/')
    } catch (e) {
      alert('계정 삭제 실패')
    }
  }
}

</script>
<style scoped>
.custom-text {
  color: hsla(20, 80%, 55%, 1);
}
.group:hover .overlay {
  @apply bg-opacity-80;
}

</style>
