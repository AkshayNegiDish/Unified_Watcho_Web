import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: "",
    component: TermsOfUseComponent
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    TermsOfUseComponent

  ],
  exports: [
    RouterModule
  ]
})
export class TermsOfUseModule { }
