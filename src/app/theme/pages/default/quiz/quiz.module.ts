import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../../../shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from '../../../../auth/guard/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { CampaignComponent } from './components/campaign/campaign.component';
import { AuthGuard1 } from './auth/guard/auth.guard';
import { QuestionComponent } from './components/question/question.component';
import { PopupComponent } from './components/popup/popup.component';
import { QuizDetailTabComponent } from './components/quizDetailTab/quizdetailtab.component';
import { LeaderBoardComponent } from './components/leaderboard/leaderboard.component';
import { PlayerHistoryComponent } from './components/playerhistory/playerhistory.component';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TermsandconditionsComponent } from './components/termsandconditions/termsandconditions.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    "canActivate": [AuthGuard,AuthGuard1],
  },
  {
    path: "home",
    component: QuizDetailTabComponent,
    "canActivate": [AuthGuard, AuthGuard1],
  },
  {
    path: "question",
    component: QuestionComponent,
    "canActivate": [AuthGuard, AuthGuard1],
  },
  {
    path: "terms",
    component: TermsandconditionsComponent,
    "canActivate": [AuthGuard, AuthGuard1],
  }

]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InfiniteScrollModule,
    NgbDropdownModule,
    SharedModule
  ],
  declarations: [HomeComponent, CampaignComponent, PlayerHistoryComponent, LeaderBoardComponent, QuestionComponent, PopupComponent, QuizDetailTabComponent, TermsandconditionsComponent],
  providers: [
    AuthGuard1
  ]
})
export class QuizModule { }
