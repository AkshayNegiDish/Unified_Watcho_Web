
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './components/search/search.component';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../default.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../../../../auth/guard/auth.guard';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MoreSearchComponent } from './components/more-search/more-search.component';
import { SearchChildComponent } from './components/search-child/search-child.component';

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    canActivate: [AuthGuard],

    children: [
      {
        path: "",
        component: SearchComponent
      },
      {
        path: ":mediaType/:mediaTypeId/:searchQuery",
        component: MoreSearchComponent
      }
    ],
    runGuardsAndResolvers: 'always'
  }

]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule

  ],
  declarations: [SearchComponent, MoreSearchComponent, SearchChildComponent]
})
export class SearchModule { }
