import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyUploadComponent } from './components/my-upload/my-upload.component';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../default.component';
import { AuthGuard } from '../../../../auth/guard/auth.guard';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { FileDropModule } from 'ngx-file-drop';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ProgressBarModule } from 'angular-progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UgcMyUploadComponent } from './components/ugc-my-upload/ugc-my-upload.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyContestComponent } from './components/my-contest/my-contest.component';
import { LiveContestComponent } from './components/live-contest/live-contest.component';
import { UpcomingContestComponent } from './components/upcoming-contest/upcoming-contest.component'

import { from } from 'rxjs';
import { LeaderboardCurrentComponent } from './components/leaderboard-current/leaderboard-current.component';
import { CompletedContestComponent } from './components/completed-contest/completed-contest.component';
import { CompletedLeaderboardComponent } from './components/completed-leaderboard/completed-leaderboard.component'


const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    "canActivate": [AuthGuard],
    children: [
      {
        path: "my-uploads",
        component: MyUploadComponent
      },
      {
        path: "my-uploads/ifp",
        component: MyUploadComponent,
        data: {
          isIFP: true
        }
      },
      {
        path: "ugc-my-uploads",
        component: UgcMyUploadComponent
      },
      {
        path: "my-contest",
        component: MyContestComponent
      },
      {
        path: "live-contest",
        component: LiveContestComponent
      },
      {
        path: "upcoming-contest",
        component: UpcomingContestComponent
      },
      {
        path: "leaderboard-current",
        component: LeaderboardCurrentComponent
      },
      {
        path: "completed-contest",
        component: CompletedContestComponent
      },
      {
        path: "full-leaderboard",
        component: CompletedLeaderboardComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    FileDropModule,
    FormsModule,
    ImageCropperModule,
    RouterModule.forChild(routes),
    SharedModule,
    ProgressBarModule,
    InfiniteScrollModule

  ],
  declarations: [MyUploadComponent, UgcMyUploadComponent, MyContestComponent, LiveContestComponent, UpcomingContestComponent, LeaderboardCurrentComponent, CompletedContestComponent, CompletedLeaderboardComponent]
})
export class UgcModule { }
