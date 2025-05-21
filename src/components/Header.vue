<template>
  <header class="w-full h-14 bg-black text-green-500 flex items-center justify-between px-6 fixed top-0 z-50 shadow">
    <!-- 왼쪽: 로고 + 페이지 이동 메뉴 -->
    <div class="flex items-center gap-6">
      <router-link to="/" class="font-bold text-lg">Goldentime</router-link>
      <router-link to="/map" class="text-sm">지도</router-link>
      <router-link to="/board" class="text-sm">게시판</router-link>
    </div>

    <!-- 오른쪽: 로그인/회원가입 또는 사용자 정보 -->
    <div class="flex items-center gap-4">
      <template v-if="!isLogin">
        <button @click="showLogin = true" class="text-sm">로그인</button>
        <button @click="showSignup = true" class="text-sm">회원가입</button>
      </template>
      <template v-else>
        <router-link to="/mypage" class="text-sm">{{ nickname }}님</router-link>
        <button @click="handleLogout" class="text-sm">로그아웃</button>
      </template>
    </div>

    <!-- 로그인 모달 -->
    <LoginModal v-if="showLogin" @close="showLogin = false" />

    <!-- 회원가입 모달 -->
    <SignupModal v-if="showSignup" @close="showSignup = false" />
  </header>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import LoginModal from './LoginModal.vue'
import SignupModal from './SignupModal.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

const isLogin = computed(() => userStore.isLogin)
const nickname = computed(() => userStore.nickname)

const showLogin = ref(false)
const showSignup = ref(false)

const handleLogout = () => {
  userStore.logout()
  router.push('/') 
}
</script>


<style scoped></style>
