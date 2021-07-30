import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../../servers/data-types/member.type';
import {MemberService} from '../../../../servers/member.service';
import {timer} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {

  showPoint = false;
  tipTitle = '';
  @Input() user: User;
  @Output() openModal = new EventEmitter<void>();



  constructor(
    private memberService: MemberService,
    private messageServe: NzMessageService,
  ) { }

  ngOnInit() {
  }

  // 签到
  onSignin() {
    this.memberService.signin().subscribe(res => {
      this.alertMessage('success', '签到成功');
      this.tipTitle = '积分+' + res.point;
      this.showPoint = true;
      timer(1500).subscribe(() => {
        this.showPoint = false;
        this.tipTitle = '';
      });
    }, error => {
      this.alertMessage('error', error.message || '签到失败');
    });
  }

  private alertMessage(type: string, msg: string) {
    this.messageServe.create(type, msg);
  }
}
