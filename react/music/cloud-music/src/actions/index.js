export const SAVE_USERINFO = 'SAVE_USERINFO'
export const SAVE_SONGURL = 'SAVE_SONGURL'
export const SAVE_SONGDETAIL = 'SAVE_SONGDETAIL'
export const ADD_PLAYTINGLIST = 'ADD_PLAYTINGLIST'
export const CHANGE_PLAYSTATE = 'CHANGE_PLAYSTATE'
export const SET_PLAYMODE = 'SET_PLAYMODE'
export const UPDATE_DOEMLOADMUSICINFO = 'UPDATE_DOEMLOADMUSICINFO'
export const SAVE_SONGIDS = 'SAVE_SONGIDS'

export function saveUserInfo(userInfo) {
  return {
    type: SAVE_USERINFO,
    userInfo
  }
}
// 音乐url
export function saveSongUrl(url) {
  return {
    type: SAVE_SONGURL,
    url
  }
}
// 歌曲详情
export function saveSongDetail(songs) {
  return {
    type: SAVE_SONGDETAIL,
    songs
  }
}
// 添加单曲到当前播放列表
export function addPlayingList(playingList) {
  return {
    type: ADD_PLAYTINGLIST,
    playingList
  }
}
// 改变播放状态
export function changePlayState(state) {
  return {
    type: CHANGE_PLAYSTATE,
    state
  }
}
// 设置播放模式
export function setPlayMode(code) {
  return {
    type: SET_PLAYMODE,
    code
  }
}

// 喜欢的歌曲id
export function saveSongIds (ids) {
  return {
    type: SAVE_SONGIDS,
    ids
  }
}