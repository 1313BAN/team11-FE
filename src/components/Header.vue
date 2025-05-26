  <template>
  <header class="custom-header flex items-center justify-between px-6 fixed top-0 z-50 shadow h-20 w-full">
      <!-- 왼쪽: 로고 + 페이지 이동 메뉴 -->
      <div class="flex items-center gap-6">
        
        <router-link to="/" class="font-bold flex text-5xl">
          <!-- 이미지 마커 -->

Goldentime
<img
  src="@/assets/logo.png"
  alt="마커"
  class="w-6 h-6 object-contain cursor-pointer"
/>
</router-link>
        <router-link to="/map" class="font-bold text-4xl">지도</router-link>
        <button @click="goToBoard" class="font-bold text-4xl">게시판</button>
      </div>

      <!-- 오른쪽: 로그인/회원가입 또는 사용자 정보 -->
      <div class="flex items-center gap-4">
        <template v-if="!isLogin">
          <button @click="showLogin = true" class="font-bold text-3xl">로그인</button>
          <button @click="showSignup = true" class="font-bold text-3xl">회원가입</button>
        </template>
        <template v-else>
          <router-link to="/mypage" class="font-bold text-4xl">{{ nickname }}님</router-link>
          <button @click="handleLogout" class="font-bold text-3xl">로그아웃</button>
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
  import { useToast } from 'primevue/usetoast'

  import LoginModal from './LoginModal.vue'
  import SignupModal from './SignupModal.vue'
  import { useUserStore } from '@/stores/user'

  const router = useRouter()
  const toast = useToast()
  const userStore = useUserStore()

  const isLogin = computed(() => userStore.isLogin)
  const nickname = computed(() => userStore.nickname)

  const showLogin = ref(false)
  const showSignup = ref(false)

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      userStore.logout()
      toast.add({
        severity: 'info',
        summary: '로그아웃',
        detail: '성공적으로 로그아웃되었습니다.',
        life: 2000,
      })
      router.push('/')
    }
  }
  const goToBoard = () => {
  if (!isLogin.value) {
    showLogin.value = true // 로그인 모달 띄우기
    alert('로그인한 사용자만 사용할 수 있는 기능입니다.')
  } else {
    router.push('/board')
  }
}

  </script>


<style scoped>
.custom-header {
  background-color: hsla(0, 0%, 2%, 0.536);
}
</style>
