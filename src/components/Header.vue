<template>
  <header
    class="w-full h-14 bg-gray-800 text-white flex justify-between items-center px-6 fixed top-0 z-50"
  >
    <div class="font-bold text-xl">
      <router-link to="/">Goldentime</router-link>
    </div>
    <nav class="space-x-4 whitespace-nowrap">
      <router-link to="/">Home</router-link>
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
