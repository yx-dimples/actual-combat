import { Reducer } from 'redux';
import { 
  UPDATE_LOGIN, SAVE_USERINFO, SAVE_USERPLAYLIST, SAVE_LIKESONGIDS, SAVE_SONGDETAIL, ADD_PLAYLIST,
  CHANGE_PLAYSTATE, ADD_ALLSONG, SET_PLAYMODE, CLEAR_PLAYLIST, CLEAR_HISTORY, SET_CURRENTTIME
} from "../action"
import { playModeMap } from '../utils'

interface State {
  isLogin: boolean,
  userInfo: any,
  userPlayingList: any,
  likeSongIds: any
  nowSongDetail: any
  playingList: any
  historyPlay: any
  isPlaying: boolean
  playMode: string
  currentTime: number
}

interface IAction<T> {
  type: string;
  data: T
  profile: T,
  playlist: T,
  ids: T
  url: T
  song: T
  state: T
  mode: T
  time: T
}


const defaultState: State = {
  isLogin: false,
  userInfo: {},
  userPlayingList: [],
  likeSongIds: [],
  nowSongDetail: {},
  playingList: [], // 正在播放列表
  historyPlay: [],
  isPlaying: false,
  playMode: playModeMap.sequence.code, // 播放模式
  currentTime: 0
};

const userReducer: Reducer<State, IAction<any>> = (
  state = defaultState,
  action: IAction<any>,
) => {
  let newState = JSON.parse(JSON.stringify(state)) // 实现深拷贝state
  switch (action.type) {
    // 更新登录状态
    case UPDATE_LOGIN:
      state.isLogin = action.data
      return {
        ...state,
      };
    // 保存用户信息
    case SAVE_USERINFO:
      state.userInfo = { ...action.profile }
      return {
        ...state
      };
    // 保存用户歌单
    case SAVE_USERPLAYLIST:
      state.userPlayingList = [...action.playlist]    
      return {
        ...state
      }
    // 保存用户喜欢音乐列表
    case SAVE_LIKESONGIDS:
      state.likeSongIds = [...action.ids]    
      return {
        ...state
      }
    // 保存当前播放歌曲详情,并且添加当前播放歌曲到播放历史记录
    case SAVE_SONGDETAIL:
      newState.nowSongDetail = {...action.song}
      const currentIndex = state.historyPlay.findIndex((item: any) => {
        return item.id === action.song.id
      })

      if (currentIndex === -1) {
        newState.historyPlay.unshift(action.song)
      }

      return {
        ...newState
      }
    // 添加单曲到当前播放列表
    case ADD_PLAYLIST:
      const index = state.playingList.findIndex((item: any) => {
        return item.id === action.song.id
      })

      if (index === -1) {
        newState.playingList.unshift(action.song)
      }
      
      return {
        ...newState
      }
    // 改变播放状态
    case CHANGE_PLAYSTATE: {
      state.isPlaying = action.state
      return  {
        ...state
      }
    }
    // 点击播放全部，添加当前歌单所有歌曲到播放列表
    case ADD_ALLSONG: {
      newState.playingList = [...action.song]
      return {
        ...newState
      }
    }
    // 改变播放模式
    case SET_PLAYMODE: {
      state.playMode = action.mode
      return {
        ...state
      }
    }
    // 清空播放列表
    case CLEAR_PLAYLIST: {
      newState.playingList = []
      newState.songUrl = ''
      newState.nowSongDetail = {}
      newState.isPlaying = false
      return {
        ...newState
      }
    }
    // 清空历史数据
    case CLEAR_HISTORY: {
      newState.historyPlay = []
      return {
        ...newState
      }
    }
    case SET_CURRENTTIME: {
      state.currentTime = action.time
      return {
        ...state
      }
    }
    default:
      return state;
  }
};



const rootReducer: any = userReducer

export default rootReducer
