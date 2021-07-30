import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RecordVal} from '../../../../servers/data-types/member.type';
import {RecordType} from '../../../../servers/member.service';
import {Song} from '../../../../servers/data-types/common.types';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.less']
})
export class RecordsComponent implements OnInit {

  @Input() records: RecordVal[];
  @Input() recordType: RecordType.weekData;
  @Input() listenSong = 0;
  @Input() currentIndex = -1;

  @Output() onChangeType = new EventEmitter<RecordType>();
  @Output() onAddSong = new EventEmitter<[Song, boolean]>();
  @Output() onLikeSong = new EventEmitter<string>();
  @Output() onShareSong = new EventEmitter<Song>();

  constructor() { }

  ngOnInit() {
  }

}
