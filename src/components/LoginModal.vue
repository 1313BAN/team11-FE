<template>
  <Dialog
    modal
    :visible="true"
    :closable="false"
    :dismissableMask="true"
    :style="{ width: '400px', position: 'relative' }"
    header="로그인"
  >
    <!-- 수동 닫기 버튼 -->
    <button
      @click="$emit('close')"
      class="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold"
      aria-label="닫기"
    >
      ×
    </button>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-4 mt-4">
      <!-- 아이디 입력 -->
      <div>
        <label for="username" class="block text-sm mb-1 text-gray-700 dark:text-gray-200">아이디</label>
        <InputText id="username" v-model="username" class="w-full" />
        <p v-if="username && !isUsernameValid" class="text-red-500 text-xs mt-1">
          올바른 아이디 형식을 입력해주세요.
        </p>
      </div>

      <!-- 비밀번호 입력 -->
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
          영문자와 숫자를 포함한 8~20자 비밀번호여야 합니다.
        </p>
      </div>

      <!-- 로그인 실패 메시지 -->
      <div v-if="loginFailMessage" class="text-red-500 text-sm text-center">
        {{ loginFailMessage }}
      </div>

      <!-- 로그인 버튼 -->
      <Button
        :label="isLoading ? '로그인 중...' : '로그인'"
        :disabled="isLoading"
        icon="pi pi-sign-in"
        class="w-full"
        type="submit"
      />
    </form>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import { fetchUserInfo } from '@/api/user'
import { useUserStore } from '@/stores/user'

const emit = defineEmits(['close'])

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const loginFailMessage = ref('')

const USERNAME_REGEX = /^[a-z0-9]{8,20}$/
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/
const isUsernameValid = computed(() => USERNAME_REGEX.test(username.value))
const isPasswordValid = computed(() => PASSWORD_REGEX.test(password.value))

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  loginFailMessage.value = ''

  if (!isUsernameValid.value || !isPasswordValid.value) {
    toast.add({
      severity: 'warn',
      summary: '입력 오류',
      detail: '아이디와 비밀번호 형식을 확인해주세요.',
      life: 3000,
    })
    return
  }

  isLoading.value = true

  try {
    const payload = {
      username: username.value,
      password: password.value,
    }

    const response = await login(payload)
    const accessToken = response.data.data.accessToken
    userStore.login(accessToken)

    const userInfo = await fetchUserInfo()
    userStore.setUserInfo(userInfo.data.data.nickname)

    toast.add({
      severity: 'success',
      summary: '로그인 성공',
      detail: `${userInfo.data.data.nickname}님 환영합니다.`,
      life: 3000,
    })

    emit('close')
    router.push('/')
  } catch (error) {
    loginFailMessage.value = '아이디 또는 비밀번호가 올바르지 않습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>
