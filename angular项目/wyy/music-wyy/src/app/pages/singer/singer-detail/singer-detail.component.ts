import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {map, takeUntil} from 'rxjs/internal/operators';
import {Singer, SingerDetail, Song, SongSheet} from '../../../servers/data-types/common.types';
import {select, Store} from '@ngrx/store';
import {AppStoreModule} from '../../../store';
import {GetCurrentSong, getPlayer} from '../../../store/selectors/player.selectors';
import {Subject} from 'rxjs';
import {findIndex} from '../../../utils/array';
import {SetShareInfo} from '../../../store/actions/member.action';
import {BathActionService} from '../../../store/bath-action.service';
import {SongService} from '../../../servers/song.service';
import {MemberService} from '../../../servers/member.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit, OnDestroy {

  singerDetail: SingerDetail;
  simiSingers: Singer[];
  currentSong: Song;
  currentIndex = -1;
  hasLiked = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songService: SongService,
    private bathActionService: BathActionService,
    private memberService: MemberService,
    private messageService: NzMessageService
  ) {
    this.route.data.pipe(map(res => res.singerDetail)).subscribe(([detail, simiSingers]) => {
      this.singerDetail = detail;
      this.simiSingers = simiSingers;
      this.listenCurrent();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  private listenCurrent() {
    this.store$.pipe(
      select(getPlayer),
      select(GetCurrentSong),
      takeUntil(this.destroy$))
      .subscribe(song => {
        this.currentSong = song;
        if (song) {
          this.currentIndex = findIndex(this.singerDetail.hotSongs, song);
        } else {
          this.currentIndex = -1;
        }
      });
  }

  // ?????? ????????????????????????
  onAddSong(song: Song, isPlay = false) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songService.getSongList(song).subscribe(list => {
        if (list.length) {
          this.bathActionService.insertSong(list[0], isPlay);
        } else {
          this.alertMessage('warning', '???url???');
        }
      });
    }
  }
  // ?????? ????????????????????????
  onAddSongs(songs: Song[], isPlay = false) {
    this.songService.getSongList(songs).subscribe(list => {
      if (list.length) {
        if (isPlay) {
          this.bathActionService.selectPlayList({ list, index: 0 });
        } else {
          this.bathActionService.insertSongs(list);
        }
      }
    });
  }

  // ????????????
  onLikeSinger(id: string) {
    let typeInfo = {
      type: 1,
      msg: '??????'
    };
    if (this.hasLiked) {
      typeInfo = {
        type: 2,
        msg: '????????????'
      };
    }
    this.memberService.likeSinger(id, typeInfo.type).subscribe(() => {
      this.hasLiked = !this.hasLiked;
      this.messageService.create('success', typeInfo.msg + '??????');
    }, error => {
      this.messageService.create('error', error.msg || typeInfo.msg + '??????');
    });
  }

  // ????????????
  onLikeSongs(songs: Song[]) {
    const ids = songs.map(item => item.id).join(',');
    this.onLikeSong(ids);
  }

  // ????????????
  onLikeSong(id: string) {
    this.bathActionService.likeSong(id);
  }


  // ??????
  onShareSong(resource: Song, type = 'song') {
    const txt = this.makeTxt('??????', resource.name, resource.ar);
    this.store$.dispatch(SetShareInfo({ info: { id: resource.id.toString(), type, txt } }));
  }

  private makeTxt(type: string, name: string, makeBy: Singer[]): string {
    const makeByStr = makeBy.map(item => item.name).join('/');
    return `${type}: ${name} -- ${makeByStr}`;
  }

  private alertMessage(type: string, msg: string) {
    this.messageService.create(type, msg);
  }


}
