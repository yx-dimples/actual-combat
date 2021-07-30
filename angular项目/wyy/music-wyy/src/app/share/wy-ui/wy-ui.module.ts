import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import {PlayCountPipe} from '../pipes/play-count.pipe';
import {WyPlayerModule} from './wy-player/wy-player.module';
import {WyLayerModule} from './wy-layer/wy-layer.module';
import {ImgDefaultDirective} from '../directives/img-default.directive';
import {WySearchModule} from './wy-search/wy-search.module';

@NgModule({
  declarations: [
    SingleSheetComponent,
    PlayCountPipe,
    ImgDefaultDirective
  ],
  imports: [
    WyPlayerModule,
    WyLayerModule,
    WySearchModule
  ],
  exports: [
    SingleSheetComponent,
    PlayCountPipe,
    WyPlayerModule,
    WyLayerModule,
    WySearchModule,
    ImgDefaultDirective,
  ]
})
export class WyUiModule { }
