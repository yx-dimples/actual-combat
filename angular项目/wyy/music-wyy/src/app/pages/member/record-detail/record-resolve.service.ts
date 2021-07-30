import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
import {MemberService} from '../../../servers/member.service';
import {RecordVal, User} from '../../../servers/data-types/member.type';
import {first} from 'rxjs/operators';

type CenterDataType = [User, RecordVal[]];

@Injectable()
export class RecordResolveService implements Resolve<CenterDataType> {
  constructor(
    private memberService: MemberService,
    private router: Router
    ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<CenterDataType> {
    const uid = route.paramMap.get('id');
    if (uid) {
      return forkJoin([
        this.memberService.getUserDetail(uid),
        this.memberService.getUerRecord(uid)
      ]).pipe(first());
    } else {
      this.router.navigate(['/home']);
    }
  }

}
