import {Injectable} from '@angular/core';
import {AppStoreModule} from './index';
import {Song} from '../servers/data-types/common.types';
import {SetCurrentAction, SetCurrentIndex, SetPlayList, SetSongList} from './actions/player.action';
import {findIndex, shuffle} from '../utils/array';
import {CurrentActions, PlayState} from './reducers/player.reducers';
import {select, Store} from '@ngrx/store';
import {getPlayer} from './selectors/player.selectors';
import {SetLikeId, SetModalType, SetModalVisible} from './actions/member.action';
import {MemberState, ModalTypes} from './reducers/member.reducer';
import {getMember} from './selectors/member.selectors';
import {timer} from 'rxjs';

@Injectable({
  providedIn: AppStoreModule
})
export class BathActionService {

  private playerState: PlayState;
  private memberState: MemberState;

  constructor(private store$: Store<AppStoreModule>) {
    this.store$.pipe(select(getPlayer)).subscribe(res => this.playerState = res);
    this.store$.pipe(select(getMember)).subscribe(res => this.memberState = res);
  }

  // 播放列表
  selectPlayList({ list, index }: { list: Song[], index: number }) {
    this.store$.dispatch(SetSongList({ songList: list }));
    let trueIndex = index;
    let trueList = list.slice();
    if (this.playerState.playMode.type === 'random') {
      trueList = shuffle(list || []);
      trueIndex = findIndex(trueList, list[trueIndex]);
    }
    this.store$.dispatch(SetPlayList({ playList: trueList }));
    this.store$.dispatch(SetCurrentIndex({ currentIndex: trueIndex }));
    this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Play }));
  }

  // 删除歌曲
  deleteSong(song: Song) {
    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    let currentIndex = this.playerState.currentIndex;
    const sIndex = findIndex(songList, song);
    songList.splice(sIndex, 1);
    const pIndex = findIndex(playList, song);
    songList.splice(pIndex, 1);

    if (currentIndex > pIndex || currentIndex === playList.length) {
      console.log('---');
      currentIndex--;
    }

    this.store$.dispatch(SetSongList({ songList }));
    this.store$.dispatch(SetPlayList({ playList }));
    this.store$.dispatch(SetCurrentIndex({ currentIndex }));
    this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Delete }));
  }

  // 清空歌曲
  clearSong() {
    this.store$.dispatch(SetSongList({ songList: [] }));
    this.store$.dispatch(SetPlayList({ playList: [] }));
    this.store$.dispatch(SetCurrentIndex({ currentIndex: -1 }));
    this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Clear }));
  }

  // 添加歌曲
  insertSong(song: Song, isPlay: boolean) {
    const songList = this.playerState.songList.slice();
    let playList = this.playerState.playList.slice();
    let insertIndex = this.playerState.currentIndex;
    const pIndex = findIndex(playList, song);
    if (pIndex > -1) {
      // 歌曲已经存在
      if (isPlay) {
        insertIndex = pIndex;
      }
    } else {
      songList.push(song);
      if (isPlay) {
        insertIndex = songList.length - 1;
      }
      if (this.playerState.playMode.type === 'random') {
        playList = shuffle(songList);
      } else {
        playList.push(song);
      }
      this.store$.dispatch(SetSongList({ songList }));
      this.store$.dispatch(SetPlayList({ playList }));
    }

    if (insertIndex !== this.playerState.currentIndex) {
      this.store$.dispatch(SetCurrentIndex({ currentIndex: insertIndex }));
      this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Play }));
    } else {
      this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Play }));
    }
  }

  // 添加多首歌曲
  insertSongs(songs: Song[]) {
    let songList = this.playerState.songList.slice();
    let playList = this.playerState.playList.slice();
    const validSongs = songs.filter(item => findIndex(playList, item) === -1);
    if (validSongs.length) {
      songList = songList.concat(validSongs);
      let songPlayList = validSongs.slice();
      if (this.playerState.playMode.type === 'random') {
       songPlayList = shuffle(songList);
      }
      playList = playList.concat(songPlayList);
      this.store$.dispatch(SetSongList({ songList }));
      this.store$.dispatch(SetPlayList({ playList }));
    }
    this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Add }));
  }

  // 会员弹窗显示隐藏/类型
  controlModal(modalVisible = true, modalType?: ModalTypes) {
    if (modalType) {
      this.store$.dispatch(SetModalType({ modalType }));
    }
    this.store$.dispatch(SetModalVisible({ modalVisible }));
    // if (!modalVisible) {
    //   timer(500).subscribe(() => this.store$.dispatch(SetModalType({ modalType: ModalTypes.Default })));
    // }
  }

  // 收藏歌曲
  likeSong(id: string) {
    this.store$.dispatch(SetModalType({ modalType: ModalTypes.Like }));
    this.store$.dispatch(SetLikeId({ id }));
  }
}
