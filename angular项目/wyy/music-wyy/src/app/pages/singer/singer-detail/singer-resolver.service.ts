import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { first } from 'rxjs/internal/operators';
import {Singer, SingerDetail} from '../../../servers/data-types/common.types';
import {SingerService} from '../../../servers/singer.service';

type SingerDetailDataModel = [SingerDetail, Singer[]];

@Injectable()
export class SingerResolverService implements Resolve<SingerDetailDataModel> {
  constructor(private singerServe: SingerService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<SingerDetailDataModel> {
    const id = route.paramMap.get('id');
    return forkJoin([
      this.singerServe.getSingerDetail(id),
      this.singerServe.getSimiSinger(id)
    ]).pipe(first());
  }
}
