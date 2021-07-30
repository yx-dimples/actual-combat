import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzIconModule, NzInputModule} from 'ng-zorro-antd';
import { OverlayModule } from '@angular/cdk/overlay';
import {WySearchComponent} from './wy-search.component';
import {JumpService} from './jump.service';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';

@NgModule({
  declarations: [WySearchComponent, WySearchPanelComponent],
  entryComponents: [WySearchPanelComponent],
  providers: [JumpService],
  exports: [
    WySearchComponent
  ],
  imports: [
    CommonModule,
    NzIconModule,
    NzInputModule,
    OverlayModule
  ]
})
export class WySearchModule { }
