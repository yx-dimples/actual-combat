import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {SongSheet} from '../../../servers/data-types/common.types';
@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less'],
})
export class SingleSheetComponent implements OnInit {
  @Input() sheet: SongSheet;
  @Output() onPlay = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  playSheet(evt: MouseEvent, id: number) {
    evt.stopPropagation();
    this.onPlay.emit(id);
  }

  get coverImg(): string {
    return this.sheet.picUrl || this.sheet.coverImgUrl;
  }
}
