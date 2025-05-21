// src/store/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: false,
    token: null,
    nickname: '', 
  }),

  actions: {
    login(token) {
      this.isLogin = true
      this.token = token
      localStorage.setItem('accessToken', token)
    },

    logout() {
      this.isLogin = false
      this.token = null
      this.nickname = ''
      localStorage.removeItem('accessToken')
    },

    initialize() {
      const token = localStorage.getItem('accessToken')
      if (token) {
        this.isLogin = true
        this.token = token
      }
    },
    setUserInfo(nickname) {
      this.nickname = nickname
    },
  },
  persist: true, // ✅ 자동으로 저장
})
