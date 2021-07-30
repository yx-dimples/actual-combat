import {Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-wy-layer-default',
  template: `
    <div class="cnzt">
      <div class="select-log">
        <div class="mid-wrap">
          <div class="pic">
            <img src="../../../../../assets/images/platform.png" alt="">
          </div>
          <div class="methods">
            <button nz-button nzType="primary" nzSize="large" nzBlock (click)="onChangeModelType.emit('loginByPhone')">手机号登陆</button>
            <button nz-button nzSize="large" (click)="onChangeModelType.emit('register')">注册</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./wy-layer-default.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerDefaultComponent implements OnInit {
  @Output() onChangeModelType = new EventEmitter<string | void>();
  constructor() { }

  ngOnInit() {
  }

}
