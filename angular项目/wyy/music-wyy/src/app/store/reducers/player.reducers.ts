
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-type';
import { createReducer, on, Action } from '@ngrx/store';
import {Song} from '../../servers/data-types/common.types';
import {SetCurrentAction, SetCurrentIndex, SetPlaying, SetPlayList, SetPlayMode, SetSongList} from '../actions/player.action';

export enum CurrentActions {
  Add,
  Play,
  Delete,
  Clear,
  Other
}

// 播放
export interface PlayState {
  // 播放状态
  playing: boolean;

  // 播放模式
  playMode: PlayMode;

  // 歌曲列表
  songList: Song[];

  // 播放列表
  playList: Song[];

  // 当前正在播放的索引
  currentIndex: number;

  // 当前操作
  currentAction: CurrentActions;
}

// 初始
export const initialState: PlayState = {
  playing: false,
  playMode: { type: 'loop', label: '循环'},
  songList: [],
  playList: [],
  currentIndex: -1,
  currentAction: CurrentActions.Other
};

const reducer = createReducer(
  initialState,
  on(SetPlaying, (state, { playing }) => ({ ...state, playing })),
  on(SetPlayMode, (state, { playMode }) => ({ ...state, playMode })),
  on(SetSongList, (state, { songList }) => ({ ...state, songList })),
  on(SetPlayList, (state, { playList }) => ({ ...state, playList })),
  on(SetCurrentIndex, (state, { currentIndex }) => ({ ...state, currentIndex })),
  on(SetCurrentAction, (state, { currentAction }) => ({ ...state, currentAction }))
);

export function playerReducer(state: PlayState, action: Action) {
  return reducer(state, action);
}
