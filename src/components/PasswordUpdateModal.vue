<template>
  <div class="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
    <div
      class="w-[400px] rounded-xl p-6 relative"
      :style="{ backgroundColor: 'hsla(0, 0%, 17%, 0.95)', color: '#f5f5f5' }"
    >
      <!-- 닫기 버튼 -->
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
        aria-label="닫기"
      >
        ×
      </button>

      <h2 class="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
        🔐 비밀번호 변경
      </h2>

      <!-- 현재 비밀번호 -->
<div>
  <label for="current" class="block text-xs font-bold mb-1 text-gray-300">현재 비밀번호</label>
  <Password
    id="current"
    v-model="currentPassword"
    toggleMask
    class="w-full"
    inputClass="w-full p-1 border rounded text-gray-800"
    :feedback="false"
  />
  <p class="text-transparent text-xs mt-1 min-h-[1rem]">_</p>
</div>

<!-- 새 비밀번호 -->
<div>
  <label for="new" class="block text-xs font-bold mb-1 text-gray-300">새 비밀번호</label>
  <Password
    id="new"
    v-model="newPassword"
    toggleMask
    class="w-full"
    inputClass="w-full p-1 border rounded text-gray-800"
    :feedback="false"
  />
  <p class="text-red-500 text-xs mt-1 min-h-[1rem]">
    <span v-if="newPassword && !isPasswordValid">영문자와 숫자를 포함한 8~20자여야 합니다.</span>
    <span v-else-if="newPassword && currentPassword === newPassword">기존 비밀번호와 다르게 입력해주세요.</span>
  </p>
</div>

<button
  @click="handleChange"
  :disabled="!isFormValid"
  class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
>
  변경하기
</button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { changePassword } from '@/api/user'

const emit = defineEmits(['close'])

const currentPassword = ref('')
const newPassword = ref('')

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/
const isPasswordValid = computed(() => PASSWORD_REGEX.test(newPassword.value))
const isDifferentFromCurrent = computed(() =>
  currentPassword.value && newPassword.value && currentPassword.value !== newPassword.value
)

const isFormValid = computed(() =>
  currentPassword.value.trim().length > 0 &&
  isPasswordValid.value &&
  isDifferentFromCurrent.value
)

const handleChange = async () => {
  if (!isFormValid.value) return

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
