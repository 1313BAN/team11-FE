<template>
  <div class="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
    <div
      class="w-[400px] rounded-xl p-6 relative"
      :style="{ backgroundColor: 'hsla(0, 0%, 17%, 0.95)', color: '#f5f5f5' }"
    >
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
        aria-label="닫기"
      >
        ×
      </button>

      <h2 class="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
        ✏️ 닉네임 수정
      </h2>

      <input
        v-model="newNickname"
        type="text"
        placeholder="새 닉네임을 입력하세요"
        class="w-full p-1 rounded border text-gray-800 mb-4"
      />

      <button
        @click="handleUpdate"
        class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
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

const props = defineProps({ currentNickname: String })
const emit = defineEmits(['close'])
const userStore = useUserStore()

const newNickname = ref(props.currentNickname)

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
