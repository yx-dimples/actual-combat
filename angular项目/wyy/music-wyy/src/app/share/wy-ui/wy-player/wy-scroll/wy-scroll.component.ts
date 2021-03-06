import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges, SimpleChanges, Output, EventEmitter
} from '@angular/core';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';
import {timer} from 'rxjs';
BScroll.use(ScrollBar);
BScroll.use(MouseWheel);

@Component({
  selector: 'app-wy-scroll',
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`.wy-scroll{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }`],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() data: any[];
  @Input() refreshDelay = 50;

  private bs: BScroll;

  @Output() private onScrollEnd = new EventEmitter<number>();

  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;

  constructor(
    readonly el: ElementRef
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // console.log('offsetHeight', this.wrapRef.nativeElement.offsetHeight);
    this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollbar: {
        interactive: true
      },
      mouseWheel: {}
    });
    this.bs.on('scrollEnd', ({ y }) => this.onScrollEnd.emit(y));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.refreshScroll();
    }
  }

  scrollToElement(...args) {
    this.bs.scrollToElement.apply(this.bs, args);
  }
  scrollTo(...args) {
    this.bs.scrollTo.apply(this.bs, args);
  }
  private refresh() {
    this.bs.refresh();
  }

  refreshScroll() {
    // setTimeout(() => {
    //   this.refresh();
    // }, this.refreshDelay);
    timer(this.refreshDelay).subscribe(() => {
      this.refresh();
    });
  }

}
