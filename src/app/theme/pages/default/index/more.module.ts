import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from '../../../shared/shared.module';
import { MoreComponent } from './components/more/more.component';
import { MainNavSharedModule } from './main-nav-shared.module';

const routes: Routes = [
  {
    path: "",
    component: MoreComponent
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
    MainNavSharedModule
  ],
  declarations: [MoreComponent],
  exports: [
    RouterModule
  ]
})
export class MoreModule { }
