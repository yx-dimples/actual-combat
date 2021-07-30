import {Component, Inject} from '@angular/core';
import {ModalTypes, ShareInfo} from './store/reducers/member.reducer';
import {SetModalType, SetModalVisible, SetUserId} from './store/actions/member.action';
import {select, Store} from '@ngrx/store';
import {BathActionService} from './store/bath-action.service';
import {LoginParams} from './share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import {LikeSongParams, MemberService, ShareParams} from './servers/member.service';
import {User} from './servers/data-types/member.type';
import {NzMessageService} from 'ng-zorro-antd';
import {StorageService} from './servers/storage.service';
import {SearchResult, SongSheet} from './servers/data-types/common.types';
import {getLikeId, getMember, getModalType, getModalVisible, getShareInfo} from './store/selectors/member.selectors';
import {codeJson} from './utils/base64';
import {SearchService} from './servers/search.service';
import {isEmptyObject} from './utils/tools';
import {ActivatedRoute, NavigationEnd, NavigationStart, Route, Router} from '@angular/router';
import {filter, mergeMap, takeUntil} from 'rxjs/internal/operators';
import {interval, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Title} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'music-wyy';

  menu = [
    {
      label: '发现',
      path: '/home'
    },
    {
      label: '歌单',
      path: '/sheet'
    }
  ];

  // 弹窗显示
  visible = false;

  // 弹窗loading
  showSpin = false;

  // 弹窗类型
  modeType = ModalTypes.Default;

  wyRememberLogin: LoginParams;

  routeTitle = '';

  user: User;
  mySheets: SongSheet[];

  // 被收藏歌曲的id
  likeId: string;

  // 分享信息
  shareInfo: ShareInfo;

  searchResult: SearchResult;

  private navEnd: Observable<NavigationEnd>;

  loadPercent = 0;

  constructor(
    private store$: Store<AppComponent>,
    private bathActionService: BathActionService,
    private memberService: MemberService,
    private messageServe: NzMessageService,
    private storageServe: StorageService,
    private searchService: SearchService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    @Inject(DOCUMENT) private doc: Document
  ) {
    const userId = this.storageServe.getStorage('wyUserId');
    if (userId) {
      this.store$.dispatch(SetUserId({id: userId}));
      this.memberService.getUserDetail(userId).subscribe(user => this.user = user);
    }

    const wyRememberLogin = this.storageServe.getStorage('wyRememberLogin');
    if (wyRememberLogin) {
      this.wyRememberLogin = JSON.parse(wyRememberLogin);
    }

    this.listenStates();

    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(() => {
      this.loadPercent = 0;
      this.setTitle();
    });

    this.navEnd = this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)) as Observable<NavigationEnd>;
    this.setLoadingBar();
  }

  private setTitle() {
    this.navEnd.pipe(
      map(() => this.activatedRoute),
      map((route: ActivatedRoute) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.routeTitle = data.title;
      this.titleService.setTitle(this.routeTitle);
    });
  }

  private setLoadingBar() {
    interval(100).pipe(takeUntil(this.navEnd)).subscribe(() => {
      this.loadPercent = Math.max(95, ++this.loadPercent);
    });
    this.navEnd.subscribe(() => {
      this.loadPercent = 100;
    });
  }

  private listenStates() {
    const appStore$ = this.store$.pipe(select(getMember));
    appStore$.pipe(select(getModalVisible)).subscribe(visi => this.watchModalVisi(visi));
    appStore$.pipe(select(getModalType)).subscribe(type => this.watchModalType(type));
    appStore$.pipe(select(getLikeId)).subscribe(id => this.watchLikeId(id));
    appStore$.pipe(select(getShareInfo)).subscribe(info => this.watchShareInfo(info));
  }

  private watchModalVisi(visi: boolean) {
    if (this.visible !== visi) {
      this.visible = visi;
    }
  }

  private watchModalType(type: ModalTypes) {
    if (this.modeType !== type) {
      if (type === ModalTypes.Like) {
        this.onLoadMySheets();
      }
      this.modeType = type;
    }
  }

  private watchLikeId(id: string) {
    if (id) {
      this.likeId = id;
    }
  }

  private watchShareInfo(info: ShareInfo) {
    if (info) {
      if (this.user) {
        this.shareInfo = info;
        this.openModal(ModalTypes.Share);
      } else {
        this.openModal(ModalTypes.Default);
      }
    }
  }

  // 改变弹窗类型
  onChangeModalType(modalType: ModalTypes.Default) {
    this.store$.dispatch(SetModalType({ modalType }));
  }

  // 打开弹窗
  private openModal(type: ModalTypes) {
    this.bathActionService.controlModal(true, type);
  }

  openModalByMenu(type: 'loginByPhone' | 'register' ) {
    if (type === 'loginByPhone') {
      this.openModal(ModalTypes.LoginByPhone);
    } else {
      this.openModal(ModalTypes.Register);
    }
  }

  // 获取当前用户的歌单
  onLoadMySheets() {
    if (this.user) {
      this.memberService.getUerSheets(this.user.profile.userId.toString()).subscribe(userSheet => {
        this.mySheets = userSheet.self;
        this.store$.dispatch(SetModalVisible({ modalVisible: true }));
      });
    } else {
      this.openModal(ModalTypes.Default);
    }
  }

  // 登陆
  onLogin(params: LoginParams) {
    this.showSpin = true;
    this.memberService.login(params).subscribe(user => {
      this.user = user;
      this.closeModal();
      this.alertMessage('success', '登录成功');
      this.storageServe.setStorage({
        key: 'wyUserId',
        value: user.profile.userId
      });
      this.store$.dispatch(SetUserId({ id: user.profile.userId.toString() }));

      if (params.remember) {
        this.storageServe.setStorage({
          key: 'wyRememberLogin',
          value: JSON.stringify(codeJson(params))
        });
      } else {
        this.storageServe.removeStorage('wyRememberLogin');
      }
      this.showSpin = false;
    }, error => {
      this.showSpin = false;
      this.alertMessage('error', error.message || '登录失败');
    });

  }

  // 退出
  onLogout() {
    this.memberService.logout().subscribe(() => {
      this.user = null;
      this.storageServe.removeStorage('wyUserId');
      this.store$.dispatch(SetUserId({ id: '' }));
      this.alertMessage('success', '已退出');
    }, error => {
      this.alertMessage('error', error.message || '');
    });
  }

  public closeModal() {
    this.bathActionService.controlModal(false);

  }

  // 新建歌单
  onCreateSheet(sheetName: string) {
    this.memberService.createSheet(sheetName).subscribe(pid => {
      this.onLikeSong({ pid, tracks: this.likeId });
    }, error => {
      this.alertMessage('error', error.msg || '新建失败');
    });
  }

  // 收藏歌曲
  onLikeSong(args: LikeSongParams) {
    this.memberService.likeSong(args).subscribe(() => {
      this.closeModal();
      this.alertMessage('success', '收藏成功');
    }, error => {
      this.alertMessage('error', error.msg || '收藏失败');
    });
  }

  // 分享歌曲
  onShare(arg: ShareParams) {
    this.memberService.shareResource(arg).subscribe(() => {
      this.alertMessage('success', '分享成功');
    }, error => {
      this.alertMessage('error', error.msg || '分享失败');
    });
  }

  private alertMessage(type: string, msg: string) {
    this.messageServe.create(type, msg);
  }
  // 注册
  onRegister(phone: string) {
    this.alertMessage('success', phone + '注册成功');
  }

  onSearch(keywords: string) {
    if (keywords) {
      this.searchService.search(keywords).subscribe(res => {
        this.searchResult = this.highlightKeyWords(keywords, res);
      });
    } else {
      this.searchResult = {};
    }
  }

  private highlightKeyWords(keywords: string, res: SearchResult): SearchResult {
    if (!isEmptyObject(res)) {
      const reg = new RegExp(keywords, 'ig');
      ['artists', 'playlist', 'songs'].forEach(type => {
        if (res[type]) {
          res[type].forEach(item => {
            item.name = item.name.replace(reg, '<span class="highlight">$&</span>');
          });
        }
      });
    }
    return res;
  }
}
