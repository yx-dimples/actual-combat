import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {SongSheet} from '../../servers/data-types/common.types';
import {SheetService} from '../../servers/sheet.service';
import {Observable} from 'rxjs';

@Injectable()
export class SheetInfoResolverService implements Resolve<SongSheet> {
  constructor(private sheetServe: SheetService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<SongSheet> {
    return this.sheetServe.getSongSheetDetail(Number(route.paramMap.get('id')));
  }
}
