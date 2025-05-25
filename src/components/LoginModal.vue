<template>
  <Dialog
    modal
    :visible="true"
    :closable="false"
    :dismissableMask="true"
    :style="{ width: '400px', position: 'relative', borderRadius: '12px', backgroundColor: 'hsla(0, 0%, 17%, 0.95)', color: '#f5f5f5'}"
    class="rounded-xl"
  >
    <!-- 👇 커스텀 헤더 (로고 + 텍스트) -->
    <template #header>
      <div class="flex items-center gap-3">
        <img src="@/assets/logo.png" alt="로고" class="h-6 w-6" />
        <span class="text-lg font-semibold text-gray-200">로그인</span>
      </div>
    </template>
    <!-- 수동 닫기 버튼 -->
    <button
      @click="$emit('close')"
      class="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold"
      aria-label="닫기"
    >
      ×
    </button>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-3 mt-4">
      <!-- 아이디 입력 -->
      <div>
        <label for="username" class="block text-xs font-bold mb-1 text-gray-800 dark:text-gray-200">아이디</label>
        <InputText id="username" v-model="username" class="w-full p-1 border rounded text-gray-800 font-bold" />
        <p class="text-red-500 text-xs mt-1 h-1">
  <span v-if="username && !isUsernameValid">8~20자의 소문자/숫자 조합이어야 합니다.</span>
</p>
      </div>

      <!-- 비밀번호 입력 -->
      <div>
        <label for="password" class="block text-xs font-bold mb-1 text-gray-800 dark:text-gray-200">비밀번호</label>
        <Password
          id="password"
          v-model="password"
          toggleMask
          class="w-full"
          inputClass="w-full p-1 border rounded text-gray-800"
          :feedback="false"
        />
        <p class="text-red-500 text-xs mt-1 h-4">
  <span v-if="password && !isPasswordValid">영문자와 숫자를 포함한 8~20자여야 합니다.</span>
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
        class="w-full bg-orange-500 border-orange-600 hover:bg-orange-600 text-white mt-4"
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
    userStore.setUserInfo(userInfo.data.data.nickname, userInfo.data.data.username)

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
