import {Component, OnInit} from '@angular/core';
import {SheetParams, SheetService} from '../../servers/sheet.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SheetList} from '../../servers/data-types/common.types';
import {BathActionService} from '../../store/bath-action.service';

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.less']
})
export class SheetListComponent implements OnInit {
  listParams: SheetParams = {
    cat: '全部',
    order: 'hot',
    offset: 1,
    limit: 35
  };
  sheets: SheetList;
  orderValue = 'hot';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sheetServe: SheetService,
    private batchActionsServe: BathActionService
  ) {
    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
    this.getList();
  }

  ngOnInit() {
  }

  onOrderChange(order: 'new' | 'hot') {
    this.listParams.order = order;
    this.listParams.offset = 1;
    this.getList();
  }

  onPageChange(page: number) {
    this.listParams.offset = page;
    this.getList();
  }

  private getList() {
    this.sheetServe.getSheets(this.listParams).subscribe(sheets => this.sheets = sheets);
  }

  onPlaySheet(id: number) {
    this.sheetServe.playSheet(id).subscribe(list => {
      this.batchActionsServe.selectPlayList({ list, index: 0});
    });
  }

  toInfo(id: number) {
    this.router.navigate(['/sheetInfo', id]);
  }

}
