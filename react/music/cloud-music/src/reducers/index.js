import {
  SAVE_USERINFO, SAVE_SONGURL, SAVE_SONGDETAIL, ADD_PLAYTINGLIST, CHANGE_PLAYSTATE, SET_PLAYMODE,
  SAVE_SONGIDS
} from '../actions'
import { playModeMap } from '../utils'

const initState = {
  userInfo: {},
  isPlaying: false,
  newSongDetail: {},
  songUrl: '',
  isPlaylistShow: false,
  playingList: [],
  playMode: playModeMap.loop.code,
  likeSongIds: []
}

export default function rootReducer(state = initState, action) {
  switch (action.type) {
    case SAVE_USERINFO:
      // const userInfo = action.userInfo
      state.userInfo = { ...action.userInfo }
      return {
        ...state
      }
    case SAVE_SONGURL:
      state.songUrl = action.url
      return {
        ...state
      }
    case SAVE_SONGDETAIL:
      state.newSongDetail = { ...action.songs }
      return {
        ...state
      }
    case ADD_PLAYTINGLIST:
      let newState = JSON.parse(JSON.stringify(state)) //实现深拷贝state
      const index = state.playingList.findIndex(item => {
        return item.id === action.playingList.id
      })
      if (index === -1) {
        newState.playingList.unshift(action.playingList)
      }
      return {
        ...newState
      }
    case CHANGE_PLAYSTATE:
      state.isPlaying = action.state
      return {
        ...state
      }
    case SET_PLAYMODE:
      state.playMode = action.code
      return {
        ...state
      }
    case SAVE_SONGIDS:
      state.likeSongIds = [...action.ids]
      return {
        ...state
      }
    default:
      return state
  }
}