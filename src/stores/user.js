// src/store/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: false,
    token: null,
    nickname: '', 
    username: ''
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
      this.username = ''
      localStorage.removeItem('accessToken')
    },

    initialize() {
      const token = localStorage.getItem('accessToken')
      if (token) {
        this.isLogin = true
        this.token = token
      }
    },
    setUserInfo(nickname, username) {
      this.nickname = nickname
      this.username = username
    },
  },
  persist: true, // ✅ 자동으로 저장
})
