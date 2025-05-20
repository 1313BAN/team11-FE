<template>
  <header
    class="w-full h-14 bg-gray-800 text-white flex justify-between items-center px-6 fixed top-0 z-50"
  >
  <div class="flex items-center gap-2">
      <button>로고</button>
      <template v-if="!isLogin">
        <button>로그인</button>
        <button>회원가입</button>
      </template>
      <template v-else>
        <span class="text-sm">{{ username }}님 안녕하세요</span>
        <button>로그아웃</button>
      </template>
    </div>
    <nav class="space-x-4 whitespace-nowrap">
      <router-link to="/map">Map</router-link>
      <router-link to="/board">Board</router-link>
      <router-link to="/mypage">My Page</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
}
</script>

<style scoped></style>
