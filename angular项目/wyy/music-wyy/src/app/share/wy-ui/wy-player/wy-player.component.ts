import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppStoreModule} from '../../../store';
import {
  GetCurrentAction,
  GetCurrentIndex,
  GetCurrentSong,
  getPlayer,
  GetPlayList,
  GetPlayMode,
  GetSongList
} from '../../../store/selectors/player.selectors';
import {Singer, Song} from '../../../servers/data-types/common.types';
import {PlayMode} from './player-type';
import {SetCurrentAction, SetCurrentIndex, SetPlayList, SetPlayMode} from '../../../store/actions/player.action';
import {DOCUMENT} from '@angular/common';
import {findIndex, shuffle} from '../../../utils/array';
import {WyPlayerPanelComponent} from './wy-player-panel/wy-player-panel.component';
import {NzModalService} from 'ng-zorro-antd';
import {BathActionService} from '../../../store/bath-action.service';
import {animate, state, style, transition, trigger, AnimationEvent} from '@angular/animations';
import {Router} from '@angular/router';
import {CurrentActions} from '../../../store/reducers/player.reducers';
import {timer} from 'rxjs';
import {SetShareInfo} from '../../../store/actions/member.action';

const modeTypes: PlayMode[] = [{
  type: 'loop',
  label: '循环'
}, {
  type: 'random',
  label: '随机'
}, {
  type: 'singleLoop',
  label: '单曲循环'
}];

enum TipTitles {
  Add = '已添加到列表',
  Play = '已开始播放'
}

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
  animations: [trigger('showHide', [
    state('show', style({ bottom: 0 })),
    state('hide', style({ bottom: -71 })),
    transition('show=>hide', [animate('0.3s')]),
    transition('hide=>show', [animate('0.1s')])
  ])]
})

export class WyPlayerComponent implements OnInit {

  showPlayer = 'hide';
  isLocked = false;

  controlTooltip = {
    title: '',
    show: false
  };

  // 是否正在动画
  animating = false;

  percent = 0;
  bufferPercent = 0;

  songList: Song[];
  playList: Song[];
  currentSong: Song;
  currentIndex: number;

  duration: number;
  currentTime: number;

  // 播放状态
  playing = false;

  // 是否可以播放
  songReady = false;

  // 音量
  volume: 60;

  // 是否显示音量面板
  showVolumePanel = false;

  // 当前模式
  currentMode: PlayMode;
  modeCount = 0;

  // 是否显示列表面板
  showListPanel: false;

  // 是否绑定document click 事件
  bindFlag = false;

  @ViewChild('audio', { static: true }) private audio: ElementRef;
  @ViewChild(WyPlayerPanelComponent, { static: true }) private playerPanel: WyPlayerPanelComponent;
  private audioEl: HTMLAudioElement;

  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document,
    private nzModalServe: NzModalService,
    private bathActionService: BathActionService,
    private router: Router
  ) {
    const appStore$ = this.store$.pipe(select(getPlayer));
    appStore$.pipe(select(GetSongList)).subscribe(list => this.watchList(list, 'songList'));
    appStore$.pipe(select(GetPlayList)).subscribe(list => this.watchList(list, 'playList'));
    appStore$.pipe(select(GetCurrentIndex)).subscribe(index => this.watchCurrentIndex(index));
    appStore$.pipe(select(GetPlayMode)).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select(GetCurrentSong)).subscribe(song => this.watchCurrentSong(song));
    appStore$.pipe(select(GetCurrentAction)).subscribe(action => this.watchCurrentAction(action));
  }

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
  }

  private watchList(list: Song[], type: string) {
    // console.log('list+type', list, type);
    this[type] = list;
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  private watchCurrentSong(song: Song) {
    this.currentSong = song;
    this.bufferPercent = 0;
    if (song) {
      this.duration = song.dt / 1000;
    }
  }

  private watchPlayMode(mode: PlayMode) {
    this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(this.songList);
      }
      this.updateCurrentIndex(list, this.currentSong);
      this.store$.dispatch(SetPlayList({ playList: list }));
    }
  }

  private watchCurrentAction(action: CurrentActions) {
    const title = TipTitles[CurrentActions[action]];
    if (title) {
      this.controlTooltip.title = title;
      if (this.showPlayer === 'hide') {
        this.togglePlayer('show');
      } else {
        this.showToolTip();
      }
    }
    this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Other}));
  }

  onAnimateDone(event: AnimationEvent) {
    this.animating = false;
    if (event.toState === 'show' && this.controlTooltip.title) {
      this.showToolTip();
    }
  }

  private showToolTip() {
    this.controlTooltip.show = true;
    timer(1500).subscribe(() => {
      this.controlTooltip = {
        title: '',
        show: false
      };
    });
  }

  public togglePlayer(type: string) {
    if (!this.isLocked && !this.animating) {
      this.showPlayer = type;
    }
  }





  onCanPlay() {
    this.songReady = true;
    this.play();
  }

  onTimeUpdate(e: Event) {
    this.currentTime = (e.target as HTMLAudioElement).currentTime;
    this.percent = (this.currentTime / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    if (buffered.length && this.bufferPercent < 100) {
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }
  }

  // 播放 / 暂停
  onToggle() {
    if (!this.currentSong) {
      if (this.playList.length) {
        this.updateIndex(0);
      }
    } else {
      if (this.songReady) {
        this.playing = !this.playing;
        if (this.playing) {
          this.audioEl.play();
        } else {
          this.audioEl.pause();
        }
      }
    }
  }

  // 上一曲
  onPrev(index: number) {
    if (!this.songReady) {
      return;
    }
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index < 0 ? this.playList.length - 1 : index;
      this.updateIndex(newIndex);
    }
  }

  // 下一曲
  onNext(index: number) {
    if (!this.songReady) {
      return;
    }
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index >= this.playList.length ? 0 : index;
      this.updateIndex(newIndex);
    }
  }

  // 控制音量
  onVolumeChange(per: number) {
    this.audioEl.volume = per / 100;
  }

  // 控制音量面板
  toggleVolPanel() {
    this.togglePanel(`showVolumePanel`);
  }

  // 控制列表面板
  toggleListPanel() {
    if (this.songList.length) {
      this.togglePanel(`showListPanel`);
    }
  }

  togglePanel(type: string) {
    this[type] = !this[type];
    this.bindFlag = (this.showVolumePanel || this.showListPanel);
  }

  onClickOutSide(target: HTMLElement) {
    if (target.dataset.act !== 'delete') {
      this.showVolumePanel = false;
      this.showListPanel = false;
      this.bindFlag = false;
    }
  }

  onPercentChange(per: number) {
    if (this.currentSong) {
      const currentTime = this.duration * (per / 100);
      this.audioEl.currentTime = currentTime;
      if (this.playerPanel) {
        this.playerPanel.seekLyric(currentTime * 1000);
      }
    }
  }

  // 改变模式
  changeMode() {
    const temp = modeTypes[++this.modeCount % 3];
    this.store$.dispatch(SetPlayMode(
      { playMode: temp }
      ));
  }

  // 播放结束
  onEnded() {
    this.playing = false;
    if (this.currentMode.type === 'singleLoop') {
      this.loop();
    } else {
      this.onNext(this.currentIndex + 1);
    }
  }

  // 播放错误
  onError() {
    this.playing = false;
    this.bufferPercent = 0;
  }

  // 单曲循环
  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
    if (this.playerPanel) {
      this.playerPanel.seekLyric(0);
    }
  }

  private play() {
    this.audioEl.play();
    this.playing = true;
  }

  get picUrl(): string {
    const baseUrl = '//s4.music.126.net/style/web2/img/default/default_album.jpg';
    return  this.currentSong ? this.currentSong.al.picUrl : baseUrl;
  }

  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
    this.songReady = false;
  }

  private updateCurrentIndex(list: Song[], song: Song) {
    const newIndex = findIndex(list, song);
    this.store$.dispatch(SetCurrentIndex({currentIndex: newIndex}));
  }

  onCanplay() {
    this.songReady = true;
    this.play();
  }

  // 改变歌曲
  onChangeSong(song: Song) {
    this.updateCurrentIndex(this.playList, song);
  }

  // 删除
  onDeleteSong(song: Song) {
    this.bathActionService.deleteSong(song);
  }

  // 清空
  onClearSong() {
    this.nzModalServe.confirm({
      nzTitle: '确认清空列表',
      nzOnOk: () => {
        this.bathActionService.clearSong();
      }
    });
  }

  // 跳转
  toInfo(path: [string, number]) {
    console.log('11');
    if (path[1]) {
      this.showVolumePanel = false;
      this.showListPanel = false;
      this.router.navigate(path);
    }
  }

  // 收藏歌曲
  onLikeSong(id: string) {
    this.bathActionService.likeSong(id);
  }

  // 分享
  onShareSong(resource: Song, type = 'song') {
    const txt = this.makeTxt('歌曲', resource.name, resource.ar);
    this.store$.dispatch(SetShareInfo({ info: { id: resource.id.toString(), type, txt } }));
  }

  private makeTxt(type: string, name: string, makeBy: Singer[]): string {
    const makeByStr = makeBy.map(item => item.name).join('/');
    return `${type}: ${name} -- ${makeByStr}`;
  }
}
