import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { DefaultComponent } from '../default.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from '../../../../auth/guard/auth.guard';
import { ContentPreferenceComponent } from './components/content-preference/content-preference.component';
import { MyUploadsComponent } from './components/my-uploads/my-uploads.component';
import { VideoUploadFormComponent } from './components/video-upload-form/video-upload-form.component';
import { MyWatchlistComponent } from './components/my-watchlist/my-watchlist.component';
import { VideoQualityComponent } from './components/video-quality/video-quality.component';
import { MembershipAndPlansComponent } from './components/membership-and-plans/membership-and-plans.component';
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FollowedSeriesComponent } from './components/followed-series/followed-series.component';
import { FollowedCreatorsComponent } from './components/followed-creators/followed-creators.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SubscriptionDetailComponent } from './components/subscription-detail/subscription-detail.component';
import { UserDetilsComponent } from './components/user-detils/user-detils.component';
import { PaymentStatusComponent } from './components/payment-status/payment-status.component';
import { CancelMembershipComponent } from './components/cancel-membership/cancel-membership.component';
import { RechargeDetailComponent } from './components/recharge-detail/recharge-detail.component';
import { SelectedOfferInfoModalComponent } from './components/selected-offer-info-modal/selected-offer-info-modal.component';
import { RechargeStatusComponent } from './components/recharge-status/recharge-status.component';
import { PaytmPaymentStatusComponent } from './components/paytm-payment-status/paytm-payment-status.component';
const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    "canActivate": [AuthGuard],
    children: [
      {
        path: "settings",
        component: SettingsComponent,
      },
      {
        path: "settings/your-devices",
        component: SettingsComponent,
        pathMatch: 'full'
      },
      {
        path: "settings/your-devices-limit-exceeded",
        component: SettingsComponent,
        pathMatch: 'full',
        data: {
          deviceLimitExceeded: true
        }
      },
      {
        path: "followed-series",
        component: FollowedSeriesComponent
      },
      {
        path: "followed-creators",
        component: FollowedCreatorsComponent
      },
      {
        path: "contentpreference",
        component: ContentPreferenceComponent
      },
      {
        path: "myuploads",
        component: MyUploadsComponent
      },
      {
        path: "videouploadform",
        component: VideoUploadFormComponent
      },
      {
        path: "mywatchlist",
        component: MyWatchlistComponent
      },
      {
        path: "videoquality",
        component: VideoQualityComponent
      },
      {
        path: "membershipandplans",
        component: MembershipAndPlansComponent
      },
      {
        path: "notificationsettings",
        component: NotificationSettingsComponent
      },
      {
        path: "subscriptiondetail",
        component: SubscriptionDetailComponent
      },
      {
        path: "details",
        component: UserDetilsComponent
      },
      {
        path: "paymentstatus",
        component: PaymentStatusComponent
      },
      {
        path: "rechargedetail",
        component: RechargeDetailComponent
      },
      {
        path: "rechargestatus",
        component: RechargeStatusComponent
      },
      {
        path: "subscriptionstatus",
        component: PaytmPaymentStatusComponent
      }
    ]
  }

]

@NgModule({
  imports: [
    FormsModule,
    NgbModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbDatepickerModule,
    ImageCropperModule,
    InfiniteScrollModule
  ],
  declarations: [
    SettingsComponent,
    // ContentPreferenceComponent,
    MyUploadsComponent,
    VideoUploadFormComponent,
    MyWatchlistComponent,
    VideoQualityComponent,
    MembershipAndPlansComponent,
    NotificationSettingsComponent,
    FollowedSeriesComponent,
    FollowedCreatorsComponent,
    SubscriptionDetailComponent,
    UserDetilsComponent,
    PaymentStatusComponent,
    CancelMembershipComponent,
    RechargeDetailComponent,
    SelectedOfferInfoModalComponent,
    RechargeStatusComponent,
    PaytmPaymentStatusComponent,
  ], exports: [
    ContentPreferenceComponent
  ],
  entryComponents: [
    CancelMembershipComponent,
    SelectedOfferInfoModalComponent
  ]
})
export class UserManagementModule { }
