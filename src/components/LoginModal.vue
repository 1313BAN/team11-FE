<template>
    <div class="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div class="bg-black p-6 rounded shadow-md w-96 relative">
        <button @click="$emit('close')" class="absolute top-2 right-2">X</button>
        <h2 class="text-lg font-semibold mb-4">로그인</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="username" class="block mb-1">아이디</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="bg-black w-full border p-2"
              required
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block mb-1">비밀번호</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="bg-black w-full border p-2"
              required
            />
          </div>
          <button type="submit" class="w-full py-2 border">로그인</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { login } from '@/api/auth'
  import { fetchUserInfo } from '@/api/user'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()

  const emit = defineEmits(['close'])
  
  const username = ref('')
  const password = ref('')
  
  const handleLogin = async () => {
    try {
      const payload = {
        username: username.value,
        password: password.value,
      }
      const response = await login(payload)

      const accessToken = response.data.data.accessToken

      userStore.login(accessToken)
       
       
      emit('close')
    } catch (error) {
      alert('로그인 실패: ' + error.response?.data?.message || error.message)
    }
    const userInfo = await fetchUserInfo()
    userStore.setUserInfo(userInfo.data.data.nickname)
  }
  </script>
  
  