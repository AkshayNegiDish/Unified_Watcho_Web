import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from '../../../shared/shared.module';
import { BookDTHComponent } from './components/book-dth/book-dth.component';
import { MainNavSharedModule } from './main-nav-shared.module';

const routes: Routes = [
  {
    path: "",
    component: BookDTHComponent
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
  declarations: [BookDTHComponent],
  exports: [
    RouterModule
  ]
})
export class BookDTHModule { }
