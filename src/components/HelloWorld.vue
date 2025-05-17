<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="text-center mt-10">
    <h1 class="text-4xl font-bold text-blue-600">Tailwind가 잘 작동합니다! 🎉</h1>
    <p class="mt-4 text-gray-500">이 텍스트는 Tailwind 유틸리티 클래스로 스타일되었습니다.</p>
    <button class="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
      확인 버튼
    </button>
  </div>
</template>


<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
