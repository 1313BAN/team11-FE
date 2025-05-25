<template>
  <div class="flex justify-center items-start pt-20 min-h-screen bg-[hsla(0,0%,17%,0.95)] text-[#f5f5f5]">
    <div class="w-full max-w-md bg-[#202020] rounded-xl shadow-md p-6">
      <h2 class="custom-text text-2xl font-bold text-center mb-8 ">마이페이지</h2>

      <!-- 사용자 정보 -->
      <div class="space-y-6">
        <!-- 아이디 -->
        <div>
          <label class="block text-lg text-gray-400 mb-1">아이디</label>
          <p class="text-sm font-bold text-white">{{ username }}</p>
        </div>

        <!-- 닉네임 -->
        <div>
          <label class="block text-lg text-gray-400 mb-1">닉네임</label>
          <div class="flex justify-between items-center">
            <p class="text-sm font-bold text-white">{{ nickname }}</p>
            <Button
              @click="showNicknameModal = true"
              label="수정"
              text
              class="text-orange-400 hover:underline text-sm"
            />
          </div>
        </div>

        <!-- 비밀번호 -->
        <div>
          <label class="block text-lg text-gray-400 mb-1">비밀번호</label>
          <div class="flex justify-between items-center">
            <p class="text-sm font-bold text-white">••••••••</p>
            <Button
              @click="showPasswordModal = true"
              label="수정"
              text
              class="text-orange-400 hover:underline text-sm"
            />
          </div>
        </div>
      </div>

      <!-- 계정 삭제 -->
      <div class="mt-10 border-t border-gray-700 pt-6 text-center">
        <Button
  label="계정 삭제하기"
  class="w-full text-white rounded hover:opacity-85 transition"
  :style="{ backgroundColor: 'hsla(20, 80%, 55%, 1)' }"
  @click="confirmDelete"
/>
      </div>
    </div>

    <!-- 모달들 -->
    <NicknameModal
      v-if="showNicknameModal"
      :currentNickname="nickname"
      @close="showNicknameModal = false"
    />
    <PasswordModal v-if="showPasswordModal" @close="showPasswordModal = false" />
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchUserInfo, deleteAccount } from '@/api/user'
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

onMounted(async () => {
  try {
    const res = await fetchUserInfo()
    username.value = res.data.data.username
    nickname.value = res.data.data.nickname
  } catch (e) {
    alert('사용자 정보를 불러올 수 없습니다.')
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
</style>
