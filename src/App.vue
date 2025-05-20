<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
  <div id="app">
    <Header />
    <main><router-view /></main>
  </div>
</template>

<style></style>
