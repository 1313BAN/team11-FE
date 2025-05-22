<template>
  <Dialog
    modal
    :visible="true"
    :closable="false"
    :dismissableMask="true"
    :style="{ width: '400px', position: 'relative' }"
    header="회원가입"
  >
    <!-- 닫기 버튼 -->
    <button
      @click="$emit('close')"
      class="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold"
      aria-label="닫기"
    >
      ×
    </button>

    <form @submit.prevent="handleSignup" class="flex flex-col gap-4 mt-4">
      <!-- 아이디 -->
      <div>
        <label for="username" class="block text-sm mb-1 text-gray-700 dark:text-gray-200">아이디</label>
        <InputText id="username" v-model="username" class="w-full" />
        <p v-if="username && !isUsernameValid" class="text-red-500 text-xs mt-1">
          8~20자 영문 소문자 및 숫자 조합이어야 합니다.
        </p>
      </div>

      <!-- 비밀번호 -->
      <div>
        <label for="password" class="block text-sm mb-1 text-gray-700 dark:text-gray-200">비밀번호</label>
        <Password
          id="password"
          v-model="password"
          toggleMask
          class="w-full"
          inputClass="w-full"
          :feedback="false"
        />
        <p v-if="password && !isPasswordValid" class="text-red-500 text-xs mt-1">
          영문자와 숫자를 포함한 8~20자여야 합니다.
        </p>
      </div>

      <!-- 비밀번호 확인 -->
      <div>
        <label for="confirm" class="block text-sm mb-1 text-gray-700 dark:text-gray-200">비밀번호 확인</label>
        <Password
          id="confirm"
          v-model="confirm"
          toggleMask
          class="w-full"
          inputClass="w-full"
          :feedback="false"
        />
        <p v-if="confirm && password !== confirm" class="text-red-500 text-xs mt-1">
          비밀번호가 일치하지 않습니다.
        </p>
      </div>

      <!-- 닉네임 -->
      <div>
        <label for="nickname" class="block text-sm mb-1 text-gray-700 dark:text-gray-200">닉네임</label>
        <InputText id="nickname" v-model="nickname" class="w-full" />
      </div>

      <!-- 에러 메시지 -->
      <div v-if="signupFailMessage" class="text-red-500 text-sm text-center">
        {{ signupFailMessage }}
      </div>

      <!-- 회원가입 버튼 -->
      <Button
        :label="isLoading ? '회원가입 중...' : '회원가입'"
        :disabled="!isFormValid || isLoading"
        class="w-full"
        type="submit"
      />
    </form>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { signup } from '@/api/user'

const emit = defineEmits(['close'])

const username = ref('')
const password = ref('')
const confirm = ref('')
const nickname = ref('')
const isLoading = ref(false)
const signupFailMessage = ref('')

const USERNAME_REGEX = /^[a-z0-9]{8,20}$/
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/
const isUsernameValid = computed(() => USERNAME_REGEX.test(username.value))
const isPasswordValid = computed(() => PASSWORD_REGEX.test(password.value))
const isPasswordMatch = computed(() => password.value === confirm.value)
const isFormValid = computed(() =>
  isUsernameValid.value &&
  isPasswordValid.value &&
  isPasswordMatch.value &&
  nickname.value.trim().length > 0
)

const toast = useToast()

const handleSignup = async () => {
  signupFailMessage.value = ''
  if (!isFormValid.value) return

  isLoading.value = true

  try {
    const payload = {
      username: username.value,
      password: password.value,
      nickname: nickname.value,
    }

    await signup(payload)

    toast.add({
      severity: 'success',
      summary: '회원가입 성공',
      detail: `${nickname.value}님 환영합니다!`,
      life: 3000,
    })

    emit('close')
  } catch (e) {
    signupFailMessage.value = '회원가입 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>
