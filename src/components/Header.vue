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
        <span class="text-sm">{{ nickname }}님 안녕하세요</span>
        <button @click="handleLogout">로그아웃</button>
      </template>
    </div>
    <nav class="space-x-4 whitespace-nowrap">
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
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
const userStore = useUserStore()
const isLogin = computed(() => userStore.isLogin)
const nickname = computed(() => userStore.nickname)

const showLogin = ref(false)
const showSignup = ref(false)
const handleLogout = () => {
  userStore.logout()
}

</script>

<style scoped></style>
