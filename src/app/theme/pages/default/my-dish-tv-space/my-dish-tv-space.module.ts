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

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    "canActivate": [AuthGuard,AuthGuard1],
  },
  {
    path: "channels",
    component: ChannelFinderComponent,
    "canActivate": [AuthGuard,AuthGuard1]
  },
  {
    path : 'manage-account',
    component : ManageAccountComponent,
    "canActivate": [AuthGuard,AuthGuard1]
  },
  {
    path: "channel-guide",
    component: ChannelGuideComponent,
    "canActivate": [AuthGuard,AuthGuard1]
  },
  {
    path: "contact-us",
    component: ContactUsComponent,
    "canActivate": [AuthGuard,AuthGuard1]
  },
  {
    path: "channel-guide/program-details",
    component: ProgramDetailComponent,
    "canActivate": [AuthGuard,AuthGuard1]
  },
  {
    path: "change-pack",
    component : ChangePackComponent,
    "canActivate": [AuthGuard,AuthGuard1]
  },
  {
    path : "manage-account/nextrecharge-detail",
    component : NextRechargeComponent,
    "canActivate": [AuthGuard,AuthGuard1]
  }

]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    InfiniteScrollModule
  ],
  declarations: [ChannelFinderComponent, HomeComponent, ManageAccountComponent, ChannelGuideComponent, ContactUsComponent, ProgramDetailComponent, ChangePackComponent, NextRechargeComponent],
  providers: [
    AuthGuard1
  ]
})
export class MyDishTvSpaceModule { }
