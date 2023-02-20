export default {
  // common
  isLoginDialog: state => state.common.isLoginDialog,
  isLoginDialogShow: state => state.common.isLoginDialogShow,
  playMode: state => state.common.playMode,
  songUrl: state => state.common.songUrl,
  isPlaying: state => state.common.isPlaying,
  isPlaylistShow: state => state.common.isPlaylistShow,
  isPlayerShow: state => state.common.isPlayerShow,
  // user
  userInfo: state => state.user.userInfo,
  isLogin: state => state.user.isLogin,
  userMenus: state => {
    const { userInfo, userPlayList } = state.user
    // console.log(userInfo)
    const retMenus = []
    const userCreateList = []
    const userCollectList = []

    userPlayList.forEach(playlist => {
      const { userId } = playlist
      if (userInfo.profile.userId === userId) {
        userCreateList.push(playlist)
      } else {
        userCollectList.push(playlist)
      }
    })

    const genPlaylistChildren = playlist =>
      playlist.map(({ id, name }) => ({
        path: `/playlist/${id}`,
        meta: {
          title: name,
          icon: 'playlist-item'
        }
      }))

    if (userCreateList.length) {
      retMenus.push({
        type: 'playlist',
        title: '创建的歌单',
        children: genPlaylistChildren(userCreateList)
      })
    }

    if (userCollectList.length) {
      retMenus.push({
        type: 'playlist',
        title: '收藏的歌单',
        children: genPlaylistChildren(userCollectList)
      })
    }

    return retMenus
  },
  userPlayList: state => state.user.userPlayList,
  // music
  playingList: state => state.music.playingList,
  historyPlay: state => state.music.historyPlay,
  nowSongDetail: state => state.music.nowSongDetail,
  currentSecond: state => state.music.currentSecond,
  currentTime: state => state.music.currentTime,
  likeSongIds: state => state.music.likeSongIds,
  subSingerList: state => state.music.subSingerList
}
