import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from '../../../shared/shared.module';
import { MainNavSharedModule } from './main-nav-shared.module';
import { SideNavComponent } from './components/side-nav/side-nav.component';

const routes: Routes = [
  {
    path: "",
    component: SideNavComponent
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
  declarations: [SideNavComponent],
  exports: [
    RouterModule
  ]
})
export class SideNavModule { }
