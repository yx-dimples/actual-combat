import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import {ShareModule} from '../../share/share.module';
import { HomeComponent } from './home.component';
import { ComponentsComponent } from './components/components.component';
import { WyCarouselComponent } from './components/wy-carousel/wy-carousel.component';
import { MemberCardComponent } from './components/member-card/member-card.component';


@NgModule({
  declarations: [HomeComponent, ComponentsComponent, WyCarouselComponent, MemberCardComponent],
  imports: [
    ShareModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
