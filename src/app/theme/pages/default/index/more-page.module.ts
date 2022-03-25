import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MorePageComponent } from './components/more-page/more-page.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainNavSharedModule } from './main-nav-shared.module';

const routes: Routes = [
  {
    path: "",
    component: MorePageComponent
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgbModule,
    MainNavSharedModule
  ],
  declarations: [MorePageComponent],
  exports: [
    RouterModule
  ]
})
export class MorePageModule { }
