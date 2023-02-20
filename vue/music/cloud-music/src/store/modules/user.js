export default {
  namespaced: true,
  state: {
    // 用户信息
    userInfo: null,
    // 是否登录
    isLogin: false,
    userPlayList: []
  },
  mutations: {
    // 更新登录状态
    UPDATE_LOGIN (state, data) {
      console.log(data)
      state.isLogin = data
    },
    // 保存用户信息
    SAVE_USER_INFO (state, data) {
      console.log(data)
      state.userInfo = data
    },
    SAVE_USER_PLAYLIST (state, data) {
      state.userPlayList = data
    }
  },
  actions: {
    UPDATE_LOGIN ({ commit }, data) {
      commit('UPDATE_LOGIN', data)
    },
    SAVE_USER_INFO ({ commit }, data) {
      commit('SAVE_USER_INFO', data)
    },
    SAVE_USER_PLAYLIST ({ commit }, data) {
      commit('SAVE_USER_PLAYLIST', data)
    }
  }
}
