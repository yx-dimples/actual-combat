import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RecordVal, User, UserSheet} from '../../../servers/data-types/member.type';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/internal/operators';
import {MemberService, RecordType} from '../../../servers/member.service';
import {SheetService} from '../../../servers/sheet.service';
import {BathActionService} from '../../../store/bath-action.service';
import {Singer, Song} from '../../../servers/data-types/common.types';
import {SongService} from '../../../servers/song.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Store} from '@ngrx/store';
import {AppStoreModule} from '../../../store';
import {SetShareInfo} from '../../../store/actions/member.action';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less']
})
export class CenterComponent implements OnInit {

  user: User;
  records: RecordVal[];
  userSheet: UserSheet;
  recordType = RecordType.weekData;
  currentIndex = -1;
  currentSong: Song;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private bathActionService: BathActionService,
    private songService: SongService,
    private messageService: NzMessageService,
    private memberService: MemberService,
    private cdr: ChangeDetectorRef,
    private store$: Store<AppStoreModule>,
  ) {
    this.route.data.pipe(map(res => res.user)).subscribe(([user, userRecord, userSheet]) => {
     this.user = user;
     this.records = userRecord.slice(0, 10);
     this.userSheet = userSheet;
    });
  }

  ngOnInit() {
  }

  onPlaySheet(id: number) {
    this.sheetService.playSheet(id).subscribe(list => {
      this.bathActionService.selectPlayList({ list, index: 0 });
    });
  }

  onChangeType(type: RecordType) {
    if (this.recordType !== type) {
      this.recordType = type;
      this.memberService.getUerRecord(this.user.profile.userId.toString(), type)
        .subscribe(records => {
          this.records = records.slice(0, 10);
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
    // this.batchActionService.controlModal(true, ModalTypes.Like);
    this.bathActionService.likeSong(id);
  }

  onShareSong(resource: Song, type = 'song') {
    const txt = this.makeTxt('歌曲', resource.name, resource.ar);
    this.store$.dispatch(SetShareInfo({ info: { id: resource.id.toString(), type, txt } }));
  }

  private alertMessage(type: string, msg: string) {
    this.messageService.create(type, msg);
  }

  private makeTxt(type: string, name: string, makeBy: Singer[]): string {
    const makeByStr = makeBy.map(item => item.name).join('/');
    return `${type}: ${name} -- ${makeByStr}`;
  }
}
