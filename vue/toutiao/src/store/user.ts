import { defineStore } from 'pinia'

import { LocalStorageService } from '../utils/storage'

const TOKEN_KEY = 'TOUTIAO_USER'

export const userStore = defineStore('user', {
  state: () => {
    return {
      user: LocalStorageService.get(TOKEN_KEY)
    }
  },
  getters: {},
  actions: {
    setUser (data: any) {
      this.user = data
      LocalStorageService.set(TOKEN_KEY, this.user)
    }
  }
})
