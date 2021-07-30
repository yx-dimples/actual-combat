import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Inject, Input,
  OnChanges,
  OnInit, Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppStoreModule} from '../../../../store';
import {getMember, getModalType, getModalVisible} from '../../../../store/selectors/member.selectors';
import {ModalTypes} from '../../../../store/reducers/member.reducer';
import {BlockScrollStrategy, Overlay, OverlayKeyboardDispatcher, OverlayRef} from '@angular/cdk/overlay';
import {BathActionService} from '../../../../store/bath-action.service';
import {ESCAPE} from '@angular/cdk/keycodes';
import {DOCUMENT} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('showHide', [
    state('show', style({ transform: 'scale(1)', opacity: 1 })),
    state('hide', style({ transform: 'scale(0)', opacity: 0 })),
    transition('show<=>hide', animate('0.1s'))
  ])]
})
export class WyLayerModalComponent implements OnInit, AfterViewInit, OnChanges {

  modalTitle = {
    register: '注册',
    loginByPhone: '手机登录',
    share: '分享',
    like: '收藏',
    default: ''
  };

  showModal = 'hide';
  @Input() visible = false;
  @Input() showSpin = false;
  @Input() modalType = ModalTypes.Default;

  @Output() onLoadMySheets = new EventEmitter<void>();

  private modalVisi = false;
  private overlayRef: OverlayRef;
  private scrollStrategy: BlockScrollStrategy;
  private resizeHandler: () => void;
  private overlayContainerEl: HTMLElement;

  @ViewChild('modalContainer', { static: false }) private modalRef: ElementRef;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private store$: Store<AppStoreModule>,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr: ChangeDetectorRef,
    private bathActionService: BathActionService,
    private rd: Renderer2
  ) {
    const appStore$ = this.store$.pipe(select(getMember));
    appStore$.pipe(select(getModalVisible)).subscribe(modalVisi => this.watchModalVisible(modalVisi));
    appStore$.pipe(select(getModalType)).subscribe(modalType => this.watchModalType(modalType));
    this.scrollStrategy = this.overlay.scrollStrategies.block();
  }

  ngOnInit() {
    this.createOverlay();
  }

  ngAfterViewInit(): void {
    this.listenResizeToCenter();
  }

  private listenResizeToCenter() {
    const modal = this.modalRef.nativeElement;
    const modalSize = this.getHideDomSize(modal);
    this.keepCenter(modal, modalSize);
    this.resizeHandler = this.rd.listen('window', 'resize', () => this.keepCenter(modal, modalSize));
  }

  private getHideDomSize(dom: HTMLElement) {
    return {
      w: dom.offsetWidth,
      h: dom.offsetHeight
    };
  }

  private keepCenter(modal: HTMLElement, size: { w: number, h: number }) {
    const left = (this.getWindowSize().w - size.w) / 2;
    const top = (this.getWindowSize().h - size.h) / 2;
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';
  }

  private getWindowSize() {
    return {
      w: window.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
      h: window.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  private watchModalVisible(modalVisi: boolean) {
    if (this.modalVisi !== modalVisi) {
      this.modalVisi = modalVisi;
      this.handleVisibleChange(modalVisi);
    }
  }

  private watchModalType(type: ModalTypes) {

    if (this.modalType !== type) {
      if (type === ModalTypes.Like) {
        this.onLoadMySheets.emit();
      }
      this.modalType = type;
      this.cdr.markForCheck();
    }
  }

  private handleVisibleChange(visi: boolean) {
    if (visi) {
      this.showModal = 'show';
      this.scrollStrategy.enable();
      this.overlayKeyboardDispatcher.add(this.overlayRef);
      this.listenResizeToCenter();
      this.changePointerEvents('auto');
    } else {
      this.showModal = 'hide';
      this.scrollStrategy.disable();
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      this.resizeHandler();
    }
    this.cdr.markForCheck();
    this.changePointerEvents('none');
  }

  private changePointerEvents(type: 'auto' | 'none') {
    if (this.overlayContainerEl) {
      this.overlayContainerEl.style.pointerEvents = type;
    }
  }

  private createOverlay() {
    this.overlayRef = this.overlay.create();
    this.overlayRef.overlayElement.appendChild(this.elementRef.nativeElement);
    this.overlayRef.keydownEvents().subscribe(e => this.keydownListener(e));
  }

  private keydownListener(e: KeyboardEvent) {
    if (e.keyCode === ESCAPE) {
      this.hide();
    }
  }

  hide() {
    this.bathActionService.controlModal(false);
  }
}
