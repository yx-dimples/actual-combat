import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import common from './modules/common'
import music from './modules/music'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules: {
    user,
    common,
    music
  },
  plugins: [createPersistedState({
    storage: window.localStorage,
    reducer (val) {
      return {
        user: val.user,
        music: val.music
      }
    }
  })]
})
