export const UPDATE_LOGIN  = 'UPDATE_LOGIN'
export const SAVE_USERINFO = 'SAVE_USERINFO'
export const SAVE_USERPLAYLIST = 'SAVE_USERPLAYLIST'
export const SAVE_LIKESONGIDS = 'SAVE_LIKESONGIDS'
export const SAVE_SONGDETAIL = 'SAVE_SONGDETAIL'
export const ADD_PLAYLIST = 'ADD_PLAYLIST'
export const CHANGE_PLAYSTATE = 'CHANGE_PLAYSTATE'
export const ADD_ALLSONG = 'ADD_ALLSONG'
export const SET_PLAYMODE = 'SET_PLAYMODE'
export const CLEAR_PLAYLIST = 'CLEAR_PLAYLIST'
export const CLEAR_HISTORY = 'CLEAR_HISTORY'
export const SET_CURRENTTIME = 'SET_CURRENTTIME'

// 更新登录状态
export function updateLogin (data: boolean) {
  return {
    type: UPDATE_LOGIN,
    data
  }
}

// 保存用户信息
export function saveUserInfo (profile: any) {
  return {
    type: SAVE_USERINFO,
    profile
  }
}

// 保存用户歌单
export function saveUserPlaylist (playlist: any) {
  return {
    type: SAVE_USERPLAYLIST,
    playlist
  }
}

// 保存用户喜欢音乐列表
export function saveLikeSongIds (ids: any) {
  return {
    type: SAVE_LIKESONGIDS,
    ids
  }
}
export function saveSongDetail (song: any) {
  return {
    type: SAVE_SONGDETAIL,
    song
  }
}

export function addPlayinglist (song: any) {
  return {
    type: ADD_PLAYLIST,
    song
  }
}

// 更新播放状态
export function changePlayState (state: any) {
  return {
    type: CHANGE_PLAYSTATE,
    state
  }
}

// 播放全部
export function addAllSong (song: any) {
  return {
    type: ADD_ALLSONG,
    song
  }
}

// 设置播放模式
export function setPlayMode (mode: string) {
  return {
    type: SET_PLAYMODE,
    mode
  }
}

// 清空播放列表
export function clearPlaylist () {
  return {
    type: CLEAR_PLAYLIST
  }
}
// 清空播放历史
export function clearHistory () {
  return {
    type: CLEAR_HISTORY
  }
}
// 设置当前播放时间
export function setCurrentTime (time: any) {
  return {
    type: SET_CURRENTTIME,
    time
  }
}
