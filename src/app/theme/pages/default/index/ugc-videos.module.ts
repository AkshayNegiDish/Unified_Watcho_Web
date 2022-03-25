import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from '../../../shared/shared.module';
import { MainNavSharedModule } from './main-nav-shared.module';
import { UgcComponent } from './components/ugc/ugc.component';

const routes: Routes = [
  {
    path: "",
    component: UgcComponent
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
  declarations: [UgcComponent],
  exports: [
    RouterModule
  ]
})
export class UgcVideosModule { }
