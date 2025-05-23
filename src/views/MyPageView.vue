<template>
  <div class="max-w-2xl mx-auto mt-20 px-4">
    <Card class="rounded shadow p-6">
      <template #content>
        <h2 class="text-2xl font-bold mb-6 text-center">마이페이지</h2>

        <!-- 사용자 정보 -->
        <div class="space-y-4 mb-8">
          <div class="flex justify-between items-center">
            <span><strong>아이디:</strong> {{ username }}</span>
          </div>

          <div class="flex justify-between items-center">
            <span><strong>닉네임:</strong> {{ nickname }}</span>
            <Button
              @click="showNicknameModal = true"
              label="수정"
              text
              class="text-blue-600 hover:underline text-sm"
            />
          </div>

          <div class="flex justify-between items-center">
            <span><strong>비밀번호:</strong> ••••••••</span>
            <Button
              @click="showPasswordModal = true"
              label="수정"
              text
              class="text-blue-600 hover:underline text-sm"
            />
          </div>
        </div>

        <!-- 계정 삭제 -->
        <div class="border-t pt-6 mt-6">
          <Button
            label="계정 삭제하기"
            class="bg-red-500 text-white px-4 py-2 rounded"
            @click="confirmDelete"
          />
        </div>
      </template>
    </Card>

    <!-- 닉네임 수정 모달 -->
    <NicknameModal
      v-if="showNicknameModal"
      :currentNickname="nickname"
      @close="showNicknameModal = false"
    />

    <!-- 비밀번호 변경 모달 -->
    <PasswordModal v-if="showPasswordModal" @close="showPasswordModal = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchUserInfo, deleteAccount } from '@/api/user'
import { useUserStore } from '@/stores/user'

import Card from 'primevue/card'
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
