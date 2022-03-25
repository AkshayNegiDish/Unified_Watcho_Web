import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AuthGuard } from '../../../../auth/guard/auth.guard';
import { SharedModule } from '../../../shared/shared.module';
import { DefaultComponent } from '../default.component';
import { HomeModule } from './home.module';
import { LiveTVModule } from './liveTV.module';
import { MainNavSharedModule } from './main-nav-shared.module';
import { MoreModule } from './more.module';
import { MoviesModule } from './movies.module';
import { PremiumModule } from './premium.module';
import { SpotlightModule } from './spotlight.module';
import { MorePageModule } from './more-page.module';
import { TermsOfUseModule } from './terms-of-use.module';
import { PrivacyPolicyModule } from './privacy-policy.module';
import { UgcComponent } from './components/ugc/ugc.component';

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    "canActivate": [AuthGuard],

    children: [
      {
        path: "",
        loadChildren: './home.module#HomeModule'
      },
      {
        path: "premium",
        loadChildren: './premium.module#PremiumModule'
      },
      {
        path: "movies",
        // loadChildren: './movies.module#MoviesModule'
        redirectTo: '/'
      },
      {
        path: "live-tv",
        loadChildren: './liveTV.module#LiveTVModule'
      },
      {
        path: "spotlight",
        loadChildren: './spotlight.module#SpotlightModule'
      },
      {
        path: "list/:listName/:contentId",
        loadChildren: './more.module#MoreModule'
      },
      {
        path: "more-page",
        loadChildren: './more-page.module#MorePageModule'
      },
      {
        path: "side-nav",
        loadChildren: './side-nav.module#SideNavModule'
      },
      {
        path: "termsAndConditions",
        loadChildren: './terms-of-use.module#TermsOfUseModule'
      },
      {
        path: "privacyPolicy",
        loadChildren: './privacy-policy.module#PrivacyPolicyModule'
      },
      {
        path: "ugc-videos",
        loadChildren: './ugc-videos.module#UgcVideosModule'
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
    NgbModule,
    SlickCarouselModule,
    InfiniteScrollModule,
    MainNavSharedModule,
    HomeModule,
    LiveTVModule,
    MoreModule,
    MoviesModule,
    PremiumModule,
    SpotlightModule,
    MorePageModule,
    TermsOfUseModule,
    PrivacyPolicyModule
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class IndexModule { }
