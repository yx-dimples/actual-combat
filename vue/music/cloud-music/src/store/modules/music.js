import common from './common'

export default {
  namespaced: true,
  state: {
    // 播放列表数据
    playingList: [],
    // 历史播放列表
    historyPlay: [],
    // 当前歌曲详情
    nowSongDetail: {},
    // 当前歌曲播放的实时秒数
    currentSecond: 0,
    // 当前播放歌曲歌词
    currentLyric: [],
    // 用户喜欢的音乐id列表
    likeSongIds: [],
    // 已收藏的歌手
    subSingerList: null
  },
  mutations: {
    // 当前歌曲详情
    SAVE_SONG_DETAIL (state, data) {
      state.nowSongDetail = data
      // 添加当前播放歌曲到播放历史记录
      const index = state.historyPlay.findIndex(item => {
        return item.id === data.id
      })
      if (index === -1) {
        state.historyPlay.unshift(data)
      }
    },
    // 添加单曲到当前播放列表
    ADD_PLATING_LIST (state, data) {
      const index = state.playingList.findIndex(item => {
        return item.id === data.id
      })
      if (index === -1) {
        state.playingList.unshift(data)
      }
    },
    SAVE_CURRENT_SECOND (state, data) {
      state.currentSecond = data
    },
    // 删除播放列表单曲
    DELETE_SONG (state, data) {
      const index = state.playingList.findIndex(item => {
        return data === item.id
      })
      state.playingList.splice(index, 1)
    },
    DELETE_All (state) {
      state.playingList = []
      common.state.songUrl = ''
      state.nowSongDetail = []
      common.state.isPlaying = false
      const info = JSON.parse(localStorage.getItem('vuex'))
      delete info.music
      localStorage.setItem('vuex', JSON.stringify(info))
      localStorage.removeItem('currentTime')
      localStorage.removeItem('volume')
      localStorage.removeItem('totalTime')
      localStorage.removeItem('curren')
      localStorage.removeItem('totalSecond')
    },
    DELETE_HISTORY (state, data) {
      const index = state.historyPlay.findIndex(item => {
        return data === item.id
      })
      state.historyPlay.splice(index, 1)
    },
    DELETE_All_HISTORY (state) {
      state.historyPlay = []
    },
    SAVE_CURRENT_LYRIC (state, data) {
      state.currentLyric = data
    },
    Add_ALL_SONG (state, data) {
      state.playingList = data
    },
    UPDATE_SUB_SINGERLIST (state, data) {
      state.subSingerList = data
    }
  },
  actions: {
    SAVE_SONG_DETAIL ({ commit }, data) {
      commit('SAVE_SONG_DETAIL', data)
    },
    ADD_PLATING_LIST ({ commit }, data) {
      commit('ADD_PLATING_LIST', data)
    },
    SAVE_CURRENT_SECOND ({ commit }, data) {
      commit('SAVE_CURRENT_SECOND', data)
    },
    DELETE_SONG ({ commit }, data) {
      commit('DELETE_SONG', data)
    },
    DELETE_All ({ commit }) {
      commit('DELETE_All')
    },
    DELETE_HISTORY ({ commit }, data) {
      commit('DELETE_HISTORY', data)
    },
    DELETE_All_HISTORY ({ commit }) {
      commit('DELETE_All_HISTORY')
    },
    SAVE_CURRENT_LYRIC ({ commit }, data) {
      commit('SAVE_CURRENT_LYRIC', data)
    },
    Add_ALL_SONG ({ commit }, data) {
      commit('Add_ALL_SONG', data)
    },
    UPDATE_SUB_SINGERLIST ({ commit }, data) {
      commit('UPDATE_SUB_SINGERLIST', data)
    }
  }
}
