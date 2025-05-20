<template>
    <div class="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div class="bg-black p-6 rounded shadow-md w-96 relative">
        <button @click="$emit('close')" class="absolute top-2 right-2">X</button>
        <h2 class="text-lg font-semibold mb-4">회원가입</h2>
        <form @submit.prevent="handleSignup">
          <div class="mb-3">
            <label for="username" class="block mb-1">아이디</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="w-full border p-2"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="block mb-1">비밀번호</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="w-full border p-2"
              required
            />
          </div>
          <div class="mb-4">
            <label for="confirm" class="block mb-1">비밀번호 확인</label>
            <input
              id="confirm"
              v-model="confirm"
              type="password"
              class="w-full border p-2"
              required
            />
          </div>
          <button type="submit" class="w-full py-2 border">회원가입</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const emit = defineEmits(['close'])
  
  const username = ref('')
  const password = ref('')
  const confirm = ref('')
  
  const handleSignup = () => {
    if (password.value !== confirm.value) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
    console.log('회원가입 시도:', username.value, password.value)
    // 실제 회원가입 API 연동은 여기서 처리
    emit('close')
  }
  </script>
  