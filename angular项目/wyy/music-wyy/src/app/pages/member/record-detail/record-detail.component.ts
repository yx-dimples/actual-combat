import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {RecordVal, User} from '../../../servers/data-types/member.type';
import {MemberService, RecordType} from '../../../servers/member.service';
import {Singer, Song, SongSheet} from '../../../servers/data-types/common.types';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, takeUntil} from 'rxjs/internal/operators';
import {select, Store} from '@ngrx/store';
import {AppStoreModule} from '../../../store';
import {GetCurrentSong, getPlayer} from '../../../store/selectors/player.selectors';
import {findIndex} from '../../../utils/array';
import {SetShareInfo} from '../../../store/actions/member.action';
import {BathActionService} from '../../../store/bath-action.service';
import {SheetService} from '../../../servers/sheet.service';
import {SongService} from '../../../servers/song.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styles: [`.record-detail .page-wrap { padding: 40px }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordDetailComponent implements OnInit, OnDestroy {

  records: RecordVal[];
  recordType = RecordType.weekData;
  user: User;
  currentIndex = -1;

  private currentSong: Song;
  private destory$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private cdr: ChangeDetectorRef,
    private sheetService: SheetService,
    private bathActionService: BathActionService,
    private memberService: MemberService,
    private songService: SongService,
    private messageService: NzMessageService
  ) {
    this.route.data.pipe(map(res => res.user)).subscribe(([user, userRecord]) => {
      this.user = user;
      this.records = userRecord;
      this.listenCurrentSong();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  private listenCurrentSong() {
    this.store$.pipe(
      select(getPlayer), select(GetCurrentSong), takeUntil(this.destory$)).subscribe(song => {
        this.currentSong = song;
        if (song) {
          const songs = this.records.map(item => item.song);
          this.currentIndex = findIndex(songs, song);
        } else {
          this.currentIndex = -1;
        }
        this.cdr.markForCheck();
    });
  }

  onChangeType(type: RecordType) {
    if (this.recordType !== type) {
      this.recordType = type;
      this.memberService.getUerRecord(this.user.profile.userId.toString(), type)
        .subscribe(records => {
          this.records = records;
          this.cdr.markForCheck();
        });
    }
  }

  onAddSong([song, isPlay]) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songService.getSongList(song).subscribe(list => {
        if (list.length) {
          this.bathActionService.insertSong(list[0], isPlay);
        } else {
          this.alertMessage('warning', '无url！');
        }
      });
    }
  }


  // 收藏歌曲
  onLikeSong(id: string) {
    this.bathActionService.likeSong(id);
  }

  // 分享
  onShareSong(resource: Song, type = 'song') {
    const txt = this.makeTxt('歌单', resource.name, resource.ar);
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
