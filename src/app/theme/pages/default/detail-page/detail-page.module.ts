import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AuthGuard } from '../../../../auth/guard/auth.guard';
import { SharedModule } from '../../../shared/shared.module';
import { DefaultComponent } from '../default.component';
import { MainNavSharedModule } from '../index/main-nav-shared.module';
import { ChannelSchedulePageModule } from './channel-schedule-page.module';
import { AssetDetailComponent } from './common-components/asset-detail/asset-detail.component';
import { FollowSeriesComponent } from './common-components/follow-series/follow-series.component';
import { ShowTrailerComponent } from './common-components/show-trailer/show-trailer.component';
import { WatchlistComponent } from './common-components/watchlist/watchlist.component';
import { CatchupDetailPageComponent } from './components/catchup-detail-page/catchup-detail-page.component';
import { ChannelSchedulePageComponent } from './components/channel-schedule-page/channel-schedule-page.component';
import { ClipDetailComponent } from './components/clip-detail/clip-detail.component';
import { CreatorProfileComponent } from './components/creator-profile/creator-profile.component';
import { DetailPageComponent } from './components/detail-page/detail-page.component';
import { MovieDetailPageComponent } from './components/movie-detail-page/movie-detail-page.component';
import { ShortFilmDetailPageComponent } from './components/short-film-detail-page/short-film-detail-page.component';
import { SpotlightEpisodeDetailPageComponent } from './components/spotlight-episode-detail-page/spotlight-episode-detail-page.component';
import { SpotlightSeriesDetailPageComponent } from './components/spotlight-series-detail-page/spotlight-series-detail-page.component';
import { UgcVideosDetailPageComponent } from './components/ugc-videos-detail-page/ugc-videos-detail-page.component';
import { VideoDetailPageComponent } from './components/video-detail-page/video-detail-page.component';
import { WebEpisodeDetailPageComponent } from './components/web-episode-detail-page/web-episode-detail-page.component';
import { WebSeriesDetailPageComponent } from './components/web-series-detail-page/web-series-detail-page.component';
import { DetailPagesSharedModule } from './detail-pages-shared.module';
import { StartoverComponent } from './common-components/startover/startover.component';
import { RatingComponent } from './common-components/rating/rating.component';
import { LiveSchedulePageComponent } from './components/live-schedule-page/live-schedule-page.component';


const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    "canActivate": [AuthGuard],
    children: [
      // {
      //   path: ":mediaType/:mediaTypeId/:mediaName/:assetId",
      //   component: VideoDetailPageComponent
      // },
      // {
      //   path: ":mediaTypeById/:mediaName/:assetId",
      //   component: VideoDetailPageComponent
      // },
      {
        path: "channel/schedule",
        loadChildren: './channel-schedule-page.module#ChannelSchedulePageModule'
      },
      {
        path: "channel/:mediaName/:channelId",
        component: LiveSchedulePageComponent
      },
      {
        path: "creator/profile",
        component: CreatorProfileComponent
      },
      {
        path: "movie/details/:mediaName/:assetId",
        component: MovieDetailPageComponent,
      },
      {
        path: "movie/details/:mediaName/:assetId/play",
        component: MovieDetailPageComponent,
        data: {
          play: true
        }
      },
      {
        path: "ugcVideo/details/:mediaName/:assetId",
        component: UgcVideosDetailPageComponent
      }, {
        path: "ugcVideo/details/:mediaName/:assetId/play",
        component: UgcVideosDetailPageComponent,
        data: {
          play: true
        }
      },
      {
        path: "webSeries/details/:mediaName/:assetId",
        component: WebSeriesDetailPageComponent
      },
      {
        path: "webEpisode/details/:mediaName/:assetId",
        component: WebEpisodeDetailPageComponent
      },
      {
        path: "webEpisode/details/:mediaName/:assetId/play",
        component: WebEpisodeDetailPageComponent,
        data: {
          play: true
        }
      },
      {
        path: "spotlightEpisode/details/:mediaName/:assetId",
        component: SpotlightEpisodeDetailPageComponent
      }, {
        path: "spotlightEpisode/details/:mediaName/:assetId/play",
        component: SpotlightEpisodeDetailPageComponent,
        data: {
          play: true
        }
      },
      {
        path: "spotlightSeries/details/:mediaName/:assetId",
        component: SpotlightSeriesDetailPageComponent
      },
      {
        path: "spotlightSeries/details/:mediaName/:assetId/play",
        component: SpotlightSeriesDetailPageComponent,
        data: {
          play: true
        }
      },
      {
        path: "short-films/:mediaName/:assetId",
        component: ShortFilmDetailPageComponent
      },
      {
        path: "short-films/:mediaName/:assetId/play",
        component: ShortFilmDetailPageComponent,
        data: {
          play: true
        }
      },
      {
        path: "catchup/details/:mediaName/:assetId",
        component: CatchupDetailPageComponent
      },
      {
        path: "creator/profile/:assetId",
        component: CreatorProfileComponent
      },
      {
        path: "clip/details/:mediaName/:assetId",
        component: ClipDetailComponent
      }, {
        path: "clip/details/:mediaName/:assetId/play",
        component: ClipDetailComponent,
        data: {
          play: true
        }
      }
    ],
    runGuardsAndResolvers: 'always'
  }

]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    SlickCarouselModule,
    NgbModule,
    InfiniteScrollModule,
    MainNavSharedModule,
    ChannelSchedulePageModule,
    DetailPagesSharedModule
  ],
  declarations: [
    DetailPageComponent,
    VideoDetailPageComponent,
    CreatorProfileComponent,
    MovieDetailPageComponent,
    ShortFilmDetailPageComponent,
    SpotlightSeriesDetailPageComponent,
    SpotlightEpisodeDetailPageComponent,
    WebEpisodeDetailPageComponent,
    WebSeriesDetailPageComponent,
    CatchupDetailPageComponent,
    UgcVideosDetailPageComponent,
    WatchlistComponent,
    AssetDetailComponent,
    ClipDetailComponent,
    FollowSeriesComponent,
    ShowTrailerComponent,
    StartoverComponent,
    RatingComponent,]
  ,
  exports: [
    WatchlistComponent,
    AssetDetailComponent
  ]
})
export class DetailPageModule { }
