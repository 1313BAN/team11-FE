<template>
  <div class="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-md w-96 relative">
      <button @click="$emit('close')" class="text-black absolute top-2 right-2">X</button>
      <h2 class="text-black text-lg font-semibold mb-4">닉네임 수정</h2>

      <input
        v-model="newNickname"
        type="text"
        class="text-black border w-full p-2 mb-4"
        placeholder="새 닉네임을 입력하세요"
      />

      <button
        @click="handleUpdate"
        class="w-full bg-blue-500 text-white py-2 rounded"
      >
        저장
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { updateNickname } from '@/api/user'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  currentNickname: String,
})
const emit = defineEmits(['close'])

const newNickname = ref(props.currentNickname)
const userStore = useUserStore()

const handleUpdate = async () => {
  if (newNickname.value === props.currentNickname) {
    alert('변경된 내용이 없습니다.')
    return
  }

  try {
    await updateNickname(newNickname.value)
    userStore.setUserInfo(newNickname.value)
    alert('닉네임이 수정되었습니다.')
    emit('close')
  } catch (e) {
    alert('닉네임 수정 실패')
  }
}
</script>
