import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from '../../../shared/shared.module';
import { MainNavSharedModule } from '../index/main-nav-shared.module';
import { ChannelSchedulePageComponent } from './components/channel-schedule-page/channel-schedule-page.component';
import { DetailPagesSharedModule } from './detail-pages-shared.module';
import { LiveSchedulePageComponent } from './components/live-schedule-page/live-schedule-page.component';


const routes: Routes = [
  {
    path: "",
    component: LiveSchedulePageComponent
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgbModule,
    SlickCarouselModule,
    InfiniteScrollModule,
    MainNavSharedModule,
    DetailPagesSharedModule
  ],
  declarations: [ChannelSchedulePageComponent, LiveSchedulePageComponent],
  exports: [
    RouterModule
  ]
})
export class ChannelSchedulePageModule { }
