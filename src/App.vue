<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
// App.vue or main Layout 컴포넌트에서
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
userStore.initialize()

</script>

<template>
  <div id="app">
    <Header />
    <main class="pt-14">
      <router-view />
    </main>
  </div>
</template>

<style>
#app {
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>

