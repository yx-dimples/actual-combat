import {Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, OnChanges, SimpleChanges, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

export interface LoginParams {
  phone: string;
  password: string;
  remember: boolean;
}

@Component({
  selector: 'app-wy-layer-login',
  templateUrl: './wy-layer-login.component.html',
  styleUrls: ['./wy-layer-login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLoginComponent implements OnInit, OnChanges {

  formModel: FormGroup;

  @Input() visible = false;
  @Input() wyRememberLogin: LoginParams;

  @Output() onLogin = new EventEmitter<LoginParams>();
  @Output() onChangeModalType = new EventEmitter<string | void>();

  constructor(private fb: FormBuilder) {
    this.formModel = this.fb.group({
      phone: ['19934199340', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: ['1625..', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges): void {
    // const userLoginParams = changes.wyRememberLogin;
    // const visible = changes.visible;
    // if (userLoginParams) {
    //   let phone = '';
    //   let password = '';
    //   let remember = false;
    //   if (userLoginParams.currentValue) {
    //     const value = codeJson(userLoginParams.currentValue, 'decode');
    //     phone = value.phone;
    //     password = value.password;
    //     remember = value.remember;
    //   }
    //   this.setModel({ phone, password, remember });
    // }
    //
    // if (visible && !visible.firstChange) {
    //   this.formModel.markAllAsTouched();
    // }
  }

  private setModel({ phone, password, remember }) {
    this.formModel = this.fb.group({
      phone: [phone, [Validators.required, Validators.pattern(/^1\d{10$/)]],
      password: [password, [Validators.required, Validators.minLength(6)]],
      remember: [remember]
    });
  }

  onSubmit() {
    const model = this.formModel;
    if (model.valid) {
      this.onLogin.emit(model.value);
    }
  }
}
