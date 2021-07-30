import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {RecordVal, User, UserSheet} from '../../../servers/data-types/member.type';
import {forkJoin, Observable} from 'rxjs';
import {first} from 'rxjs/operators';
import {MemberService} from '../../../servers/member.service';

type CenterDataType = [User, RecordVal[], UserSheet];

@Injectable()
export class CenterResolveService implements Resolve<CenterDataType> {

  constructor(
    private memberServer: MemberService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<CenterDataType> {
   const uid = route.paramMap.get('id');
   if (uid) {
     return forkJoin([
       this.memberServer.getUserDetail(uid),
       this.memberServer.getUerRecord(uid),
       this.memberServer.getUerSheets(uid)
     ]).pipe(first());
   } else {
     this.router.navigate(['/home']);
   }
  }
}
