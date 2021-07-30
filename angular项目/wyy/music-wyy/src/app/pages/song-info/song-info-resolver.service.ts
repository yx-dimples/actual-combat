import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Lyric, Song, SongSheet} from '../../servers/data-types/common.types';
import {SheetService} from '../../servers/sheet.service';
import {forkJoin, Observable} from 'rxjs';
import {SongService} from '../../servers/song.service';
import {first} from 'rxjs/operators';

type SongDataModel = [Song, Lyric];

@Injectable()
export class SongInfoResolverService implements Resolve<SongDataModel> {
  constructor(private songService: SongService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SongDataModel> | Promise<SongDataModel> | SongDataModel {
    const id = route.paramMap.get('id');
    return forkJoin([
      this.songService.getSongDetail(id),
      this.songService.getLyric(Number(id))
    ]).pipe(first());
  }
}
