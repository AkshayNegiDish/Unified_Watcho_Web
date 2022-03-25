import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../../../auth/guard/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ChannelFinderComponent } from './components/channel-finder/channel-finder.component';
import { SharedModule } from '../../../shared/shared.module';
import { ManageAccountComponent } from './components/manage-account/manage-account.component';
import { ChannelGuideComponent } from './components/channel-guide/channel-guide.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ProgramDetailComponent } from './components/channel-guide/program-detail/program-detail.component';
import { ChangePackComponent } from './components/change-pack/change-pack.component';
import { NextRechargeComponent } from './components/manage-account/next-recharge/next-recharge.component';
import { AuthGuard1 } from './auth/guard/auth.guard';
import { GetSecondConnectionsComponent } from './components/get-second-connections/get-second-connections.component';
import { SelfHelpComponent } from './components/self-help/self-help.component';
import { PaylaterReferEarnComponent } from './components/paylater-refer-earn/paylater-refer-earn.component';
import { UpgradeBoxComponent } from './components/upgrade-box/upgrade-box.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    "canActivate": [AuthGuard, AuthGuard1],
  },
  {
    path: "channels",
    component: ChannelFinderComponent,
    "canActivate": [AuthGuard, AuthGuard1]
  },
  {
    path: 'manage-account',
    component: ManageAccountComponent,
    "canActivate": [AuthGuard, AuthGuard1]
  },
  {
    path: "channel-guide",
    component: ChannelGuideComponent,
    "canActivate": [AuthGuard, AuthGuard1]
  },
  {
    path: "contact-us",
    component: ContactUsComponent,
    "canActivate": [AuthGuard, AuthGuard1]
  },
  {
    path: "channel-guide/program-details",
    component: ProgramDetailComponent,
    "canActivate": [AuthGuard, AuthGuard1]
  },
  {
    path: "change-pack",
    component: ChangePackComponent,
    "canActivate": [AuthGuard, AuthGuard1]
  },
  {
    path: "manage-account/nextrecharge-detail",
    component: NextRechargeComponent,
    "canActivate": [AuthGuard, AuthGuard1]
  },
  {
    path: "get-second-connections",
    component: GetSecondConnectionsComponent,
    "canActivate": [AuthGuard, AuthGuard1]
  },
  {
    path: "self-help",
    component: SelfHelpComponent,
    "canActivate": [AuthGuard, AuthGuard1]
  },
  {
    path: "upgrade-box",
    component: UpgradeBoxComponent,
    "canActivate": [AuthGuard, AuthGuard1]
  },
  {
    path: "mySpace/:tabs",
    component: PaylaterReferEarnComponent,
    "canActivate": [AuthGuard, AuthGuard1]
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    InfiniteScrollModule,
    ReactiveFormsModule
  ],
  declarations: [ChannelFinderComponent,SelfHelpComponent, HomeComponent, ManageAccountComponent, ChannelGuideComponent, ContactUsComponent, ProgramDetailComponent, ChangePackComponent, NextRechargeComponent, GetSecondConnectionsComponent,PaylaterReferEarnComponent,UpgradeBoxComponent],
  providers: [
    AuthGuard1
  ]
})
export class MyDishTvSpaceModule { }
