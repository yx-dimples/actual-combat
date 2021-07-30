import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServersModule} from './servers.module';
import { Observable } from 'rxjs';
import {Banner, SongSheet, HotTag} from './data-types/common.types';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: ServersModule
})
export class HomeService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  // 获取轮播图数据
  getBanner(): Observable<Banner[]> {
    return this.http.get(this.uri + 'banner')
      .pipe(map((res: { banners: Banner[] }) => res.banners));
  }

  // 获取热门标签
  getPlaylistHot(): Observable<HotTag[]> {
    return this.http.get(this.uri + 'playlist/hot')
    .pipe(map((res: { tags: HotTag[] }) => {
      return res.tags.sort((x: HotTag, y: HotTag) => {
        return x.position - y.position;
      }).slice(0, 5);
    }));
  }

  // 获取热门歌单
  getPersonalized(): Observable<SongSheet[]> {
    return this.http.get(this.uri + 'personalized')
      .pipe(map((res: { result: SongSheet[] }) => res.result.slice(0, 16)));
  }
}
