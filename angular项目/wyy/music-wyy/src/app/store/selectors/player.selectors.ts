import {PlayState} from '../reducers/player.reducers';
import {createFeatureSelector, createSelector} from '@ngrx/store';

const selectPlayerStates = (state: PlayState) => state;

export const getPlayer = createFeatureSelector<PlayState>('player');
export const GetPlaying = createSelector(selectPlayerStates, (state: PlayState) => state.playing);
export const GetPlayMode = createSelector(selectPlayerStates, (state: PlayState) => state.playMode);
export const GetSongList = createSelector(selectPlayerStates, (state: PlayState) => state.songList);
export const GetPlayList = createSelector(selectPlayerStates, (state: PlayState) => state.playList);
export const GetCurrentIndex = createSelector(selectPlayerStates, (state: PlayState) => state.currentIndex);
export const GetCurrentSong = createSelector(selectPlayerStates, ({ playList, currentIndex }: PlayState) => playList[currentIndex]);
export const GetCurrentAction = createSelector(selectPlayerStates, ( state: PlayState) => state.currentAction);
