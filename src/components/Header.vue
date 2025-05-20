<template>
  <header
    class="w-full h-14 bg-gray-800 text-white flex justify-between items-center px-6 fixed top-0 z-50"
  >
    <div class="flex items-center gap-2">
      <button>로고</button>
      <template v-if="!isLogin">
        <button @click="showLogin = true">로그인</button>
        <button @click="showSignup = true">회원가입</button>
      </template>
      <template v-else>
        <span class="text-sm">{{ username }}님 안녕하세요</span>
        <button>로그아웃</button>
      </template>
    </div>
    <nav class="space-x-4 whitespace-nowrap">
      <router-link to="/home">Home</router-link>
      <router-link to="/map">Map</router-link>
      <router-link to="/board">Board</router-link>
      <router-link to="/mypage">My Page</router-link>
    </nav>

    <!-- 로그인 모달 -->
    <LoginModal v-if="showLogin" @close="showLogin = false" />

    <!-- 회원가입 모달 -->
    <SignupModal v-if="showSignup" @close="showSignup = false" />
  </header>
</template>

<script setup>
import { ref } from 'vue'
import LoginModal from './LoginModal.vue'
import SignupModal from './SignupModal.vue'

const isLogin = ref(false)
const username = ref('임세현')

const showLogin = ref(false)
const showSignup = ref(false)
</script>

<style scoped></style>
