import {Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, Output, EventEmitter, SimpleChanges} from '@angular/core';
import {SongSheet} from '../../../../servers/data-types/common.types';
import {LikeSongParams} from '../../../../servers/member.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit, OnChanges {

  @Input() mySheets: SongSheet[];
  @Input() likeId: string;
  @Input() visible: boolean;

  @Output() onLikeSong = new EventEmitter<LikeSongParams>();
  @Output() onCreateSheet = new EventEmitter<string>();

  creating = false;
  fromModel: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {

    this.fromModel = this.fb.group({
      sheetName: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible) {
      if (!this.visible) {
        this.fromModel.get('sheetName').reset();
        this.creating = false;
      }
    }
  }

  onLike(pid: string) {
    this.onLikeSong.emit({ pid, tracks: this.likeId  });
  }

  onSubmit() {
    this.onCreateSheet.emit(this.fromModel.get('sheetName').value);
  }


}
