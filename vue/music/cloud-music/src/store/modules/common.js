import { playModeMap } from '../../utils'
// import { SET_CHANGE_LOGIN_DIALOG } from '../mutations-type'

export default {
  namespaced: true,
  state: {
    // 显示/隐藏  登录框
    isLoginDialog: false,
    // 0 == 初始界面  1 == 注册账号  2 == 二维码登录  3 == 手机号登录  4 == 验证码登录
    isLoginDialogShow: 0,
    // 播放模式
    playMode: playModeMap.loop.code,
    // 歌曲url
    songUrl: '',
    // 音乐播放状态
    isPlaying: false,
    isPlaylistShow: false,
    isPlayerShow: false
  },
  mutations: {
    SET_CHANGE_LOGIN_DIALOG (state) {
      state.isLoginDialog = !state.isLoginDialog
    },
    SET_CHANGE_LOGIN_DIALOG_SHOW (state, data) {
      state.isLoginDialogShow = data
    },
    SAVE_SONG_URL (state, data) {
      state.songUrl = data
    },
    CHANGE_PLAY_STATE (state, data) {
      state.isPlaying = data
    },
    SET_PLAY_MODE (state, data) {
      // console.log(state.playMode)
      state.playMode = data
    },
    SET_PLAYLIST_SHOW (state, data) {
      state.isPlaylistShow = data
    },
    SET_PLAYER_SHOW (state, data) {
      state.isPlayerShow = data
    }
  },
  actions: {
    SET_CHANGE_LOGIN_DIALOG ({ commit }) {
      commit('SET_CHANGE_LOGIN_DIALOG')
    },
    SET_CHANGE_LOGIN_DIALOG_SHOW ({ commit }, data) {
      commit('SET_CHANGE_LOGIN_DIALOG_SHOW', data)
    },
    // 保存歌曲url
    SAVE_SONG_URL ({ commit }, data) {
      commit('SAVE_SONG_URL', data)
    },
    // 改变播放状态
    CHANGE_PLAY_STATE ({ commit }, data) {
      commit('CHANGE_PLAY_STATE', data)
    },
    SET_PLAY_MODE ({ commit }, data) {
      commit('SET_PLAY_MODE', data)
    },
    SET_PLAYLIST_SHOW ({ commit }, data) {
      commit('SET_PLAYLIST_SHOW', data)
    },
    SET_PLAYER_SHOW ({ commit }, data) {
      commit('SET_PLAYER_SHOW', data)
    }
  }
}
