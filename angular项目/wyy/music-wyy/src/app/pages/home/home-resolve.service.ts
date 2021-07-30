import { Injectable } from '@angular/core';
import {Resolve} from '@angular/router';
import {HomeService} from '../../servers/home.service';
import {SingerService} from '../../servers/singer.service';
import {Banner, HotTag, SongSheet, Singer} from '../../servers/data-types/common.types';
import {forkJoin, Observable} from 'rxjs';
import {first} from 'rxjs/operators';
import {MemberService} from '../../servers/member.service';
import {StorageService} from '../../servers/storage.service';

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];

@Injectable()
export class HomeResolveService implements Resolve<HomeDataType> {

  constructor(
    private homeServer: HomeService,
    private singServer: SingerService,
    private memberServer: MemberService,
    private storageService: StorageService
  ) { }

  resolve(): Observable<HomeDataType> {
    return forkJoin([
      this.homeServer.getBanner(),
      this.homeServer.getPlaylistHot(),
      this.homeServer.getPersonalized(),
      this.singServer.getEnterSinger(),
      // detail$
    ]).pipe(first());
  }
}
