import { Component, OnInit } from '@angular/core';
import {Song} from '../../servers/data-types/common.types';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/internal/operators';
import {BaseLyricLine, WyLyric} from '../../share/wy-ui/wy-player/wy-player-panel/wy-lyric';
import {SongService} from '../../servers/song.service';
import {BathActionService} from '../../store/bath-action.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.less']
})
export class SongInfoComponent implements OnInit {

  songInfo: Song;
  lyric: BaseLyricLine[];

  controlLyric = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  };

  currentSong: Song;

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private batchActionService: BathActionService,
    private messageService: NzMessageService
  ) {
    this.route.data.pipe(
      map(res => res.songInfo)).subscribe(([song, lyric]) => {
      this.songInfo = song;
      this.lyric = new WyLyric(lyric).lines;
    });
  }

  ngOnInit() {
  }

  // 播放
  onAddSong(song: Song, isPlay = false) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songService.getSongList(song).subscribe(list => {
        console.log('list:', list);
        if (list.length) {
          this.batchActionService.insertSong(list[0], isPlay);
        } else {
          this.alertMessage('warning', '无url！');
        }
      });
    }
  }

  // 收藏
  onLikeSong(s: string) {

  }

  // 分享
  onShareSong(songInfo: Song) {

  }

  toggleLyric() {
    this.controlLyric.isExpand = !this.controlLyric.isExpand;
    if (this.controlLyric.isExpand) {
      this.controlLyric.label = '收起';
      this.controlLyric.iconCls = 'up';
    } else {
      this.controlLyric.label = '展开';
      this.controlLyric.iconCls = 'down';
    }
  }

  private alertMessage(type: string, msg: string) {
    this.messageService.create(type, msg);
  }
}
