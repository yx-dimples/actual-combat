import {Component, OnInit, ViewChild} from '@angular/core';
import {Banner, SongSheet, HotTag, Singer} from '../../servers/data-types/common.types';
import {NzCarouselComponent} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {SheetService} from '../../servers/sheet.service';
import {BathActionService} from '../../store/bath-action.service';
import {ModalTypes} from '../../store/reducers/member.reducer';
import {User} from '../../servers/data-types/member.type';
import {select, Store} from '@ngrx/store';
import {AppStoreModule} from '../../store';
import {getMember, getUserId} from '../../store/selectors/member.selectors';
import {MemberService} from '../../servers/member.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];
  hotTag: HotTag[];
  songSheet: SongSheet[];
  singers: Singer[];
  user: User;

  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sheetServe: SheetService,
    private bathActionService: BathActionService,
    private store$: Store<AppStoreModule>,
    private memberService: MemberService
  ) {
    this.route.data.pipe(map(res => res.homeData)).subscribe(([banners, hotTag, songSheet, singer]) => {
      this.banners = banners; // 调用轮播
      this.hotTag = hotTag; // 调用热门标签
      this.songSheet = songSheet; // 调用热门标签
      this.singers = singer; // 调用入驻歌手
    });
    this.store$.pipe(select(getMember), select(getUserId)).subscribe(id => {
      if (id) {
        this.getUserDetail(id);
      }
    });
  }

  ngOnInit() {
  }

  private getUserDetail(id: string) {
    this.memberService.getUserDetail(id).subscribe(user => this.user = user);
  }
  // 轮播图中的小点
  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }
  // 轮播图中的左右图标
  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }

  onPlaySheet(id: number) {
    this.sheetServe.playSheet(id).subscribe(list => {
      this.bathActionService.selectPlayList({ list, index: 0 });
    });
  }

  toInfo(id: number) {
    this.router.navigate(['/sheetInfo', id]);
  }

  openModal() {
    this.bathActionService.controlModal(true, ModalTypes.Default);
  }
}
