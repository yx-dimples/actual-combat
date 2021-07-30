import {Component, OnInit} from '@angular/core';
import {Singer, Song, SongSheet} from '../../servers/data-types/common.types';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/internal/operators';
import {SongService} from '../../servers/song.service';
import {BathActionService} from '../../store/bath-action.service';
import {NzMessageService} from 'ng-zorro-antd';
import {MemberService} from '../../servers/member.service';
import {Store} from '@ngrx/store';
import {AppStoreModule} from '../../store';
import {SetShareInfo} from '../../store/actions/member.action';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit {

  sheetInfo: SongSheet;

  description = {
    short: '',
    long: ''
  };

  controlDesc = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  };

  currentIndex = -1;
  currentSong: Song;

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private batchActionService: BathActionService,
    private messageService: NzMessageService,
    private store$: Store<AppStoreModule>,
    private memberService: MemberService
  ) {
    this.route.data.pipe(
      map(res => res.sheetInfo)).subscribe(res => {
      this.sheetInfo = res;
      if (res.description) {
        this.changeDesc(res.description);
      }
    });
  }

  ngOnInit() {
  }

  // 播放 （添加一首歌曲）
  onAddSong(song: Song, isPlay = false) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songService.getSongList(song).subscribe(list => {
        if (list.length) {
          this.batchActionService.insertSong(list[0], isPlay);
        } else {
          this.alertMessage('warning', '无url！');
        }
      });
    }
  }
  // 播放 （添加多首歌曲）
  onAddSongs(songs: Song[], isPlay = false) {
    this.songService.getSongList(songs).subscribe(list => {
      if (list.length) {
        if (isPlay) {
          this.batchActionService.selectPlayList({ list, index: 0 });
        } else {
          this.batchActionService.insertSongs(list);
        }
      }
    });
  }

  private changeDesc(desc: string) {
    if (desc.length < 99) {
      this.description = {
        short: this.replaceBr('<b>介绍：</b>' + desc),
        long: ''
      };
    } else {
      this.description = {
        short: this.replaceBr('<b>介绍：</b>' + desc.slice(0, 99)),
        long: this.replaceBr('<b>介绍：</b>' + desc)
      };
    }
  }

  private replaceBr(str: string): string {
    return str.replace(/\n/g, '<br />');
  }

  toggleDesc() {
    this.controlDesc.isExpand = !this.controlDesc.isExpand;
    if (this.controlDesc.isExpand) {
      this.controlDesc.label = '收起';
      this.controlDesc.iconCls = 'up';
    } else {
      this.controlDesc.label = '展开';
      this.controlDesc.iconCls = 'down';
    }

  }

  // 分享
  shareResource(resource: Song | SongSheet, type = 'song') {
    let txt = '';
    if (type === 'playlist') {
      txt = this.makeTxt('歌单', resource.name, (resource as SongSheet).creator.nickname);
    } else {
      txt = this.makeTxt('歌曲', resource.name, (resource as Song).ar);
    }
    this.store$.dispatch(SetShareInfo({ info: { id: resource.id.toString(), type, txt } }));
  }

  private makeTxt(type: string, name: string, makeBy: string | Singer[]): string {
    let makeByStr = '';
    if (Array.isArray(makeBy)) {
      makeByStr = makeBy.map(item => item.name).join('/');
    } else {
      makeByStr = makeBy;
    }
    return `${type}: ${name} -- ${makeByStr}`;
  }

  // 收藏歌曲
  onLikeSong(id: string) {
    // this.batchActionService.controlModal(true, ModalTypes.Like);
    this.batchActionService.likeSong(id);
  }

  // 收藏歌单
  onLikeSheet(arg: string) {
    this.memberService.likeSheet(arg).subscribe(() => {
      this.alertMessage('success', '收藏成功');
    }, error => {
      this.alertMessage('error', error.msg || '收藏失败');
    });
  }

  private alertMessage(type: string, msg: string) {
    this.messageService.create(type, msg);
  }


}
