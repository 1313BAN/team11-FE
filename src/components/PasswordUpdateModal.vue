<template>
  <div class="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-md w-96 relative">
      <button @click="$emit('close')" class="absolute top-2 right-2">X</button>
      <h2 class="text-lg font-semibold mb-4">비밀번호 변경</h2>

      <input
        v-model="currentPassword"
        type="password"
        class="border w-full p-2 mb-2"
        placeholder="현재 비밀번호"
      />
      <input
        v-model="newPassword"
        type="password"
        class="border w-full p-2 mb-4"
        placeholder="새 비밀번호"
      />

      <button
        @click="handleChange"
        class="w-full bg-blue-500 text-white py-2 rounded"
      >
        비밀번호 변경
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { changePassword } from '@/api/user' // 백엔드에 API가 있어야 합니다

const emit = defineEmits(['close'])

const currentPassword = ref('')
const newPassword = ref('')

const handleChange = async () => {
  if (!currentPassword.value || !newPassword.value) {
    alert('모든 입력을 완료해주세요.')
    return
  }

  try {
    await changePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    })
    alert('비밀번호가 변경되었습니다.')
    emit('close')
  } catch (e) {
    alert('비밀번호 변경 실패')
  }
}
</script>
