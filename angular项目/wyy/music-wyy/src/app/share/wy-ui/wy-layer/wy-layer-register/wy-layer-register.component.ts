import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MemberService} from '../../../../servers/member.service';
import {interval} from 'rxjs';
import {take} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd';
import {ModalTypes} from '../../../../store/reducers/member.reducer';

enum Exist {
  '存在' = 1,
  '不存在' = -1,
}

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less']
})
export class WyLayerRegisterComponent implements OnInit, OnChanges {

  @Input() visible = false;

  @Output() onChangeModalType = new EventEmitter<string>();
  @Output() onRegister = new EventEmitter<string>();

  formModel: FormGroup;
  showCode = false;
  timing: number;
  codePass: string | boolean = '';

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService
  ) {
    this.formModel = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible && !changes.visible.firstChange) {
      this.formModel.markAsTouched();
      if (this.visible) {
        this.showCode = false;
      }
    }
  }

  onSubmit() {
    // console.log('object:', this.formModel);
    if (this.formModel.valid) {
      this.sendCode();
    }
  }

   sendCode() {
    this.memberService.sendCode(this.formModel.get('phone').value).subscribe(() => {
      this.timing = 60;
      if (!this.showCode) {
        this.showCode = true;
      }
      this.cdr.markForCheck();
      interval(1000).pipe(take(60)).subscribe(() => {
        this.timing--;
        // console.log('this.timing--：', this.timing--);
        this.cdr.markForCheck();
      });
    }, error => this.messageService.error(error.message));
  }

  onCheckCode(code: string) {
    this.memberService.checkCode(this.formModel.get('phone').value, Number(code))
      .subscribe(
        () => this.codePass = true,
        () => this.codePass = false,
        () => this.cdr.markForCheck()
      );
  }

  onCheckExist() {
    const phone = this.formModel.get('phone').value;
    this.memberService.checkExist(Number(phone)).subscribe( res => {
      if (Exist[res] === '存在') {
        this.messageService.error('账号已存在，可直接登陆');
        this.changeType(ModalTypes.LoginByPhone);
      } else {
        this.onRegister.emit(phone);
      }
    });
  }

  changeType(type = ModalTypes.Default) {
    this.onChangeModalType.emit(type);
    this.showCode = false;
    this.formModel.reset();
  }
}
