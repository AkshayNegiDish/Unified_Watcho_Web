import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { PlaceholderImage, AppConstants } from '../../../../../shared/typings/common-constants';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { ViewPortService } from '../../../../../shared/services/view.port.service';
import { UserFormService } from '../../services/user-form.service';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SignInSignUpModalComponent} from '../../../../../shared/entry-component/signIn-signUp-modal.component';
import {SnackbarUtilService} from '../../../../../shared/services/snackbar-util.service';
import {CancelMembershipComponent} from '../cancel-membership/cancel-membership.component';


@Component({
  selector: 'app-membership-and-plans',
  templateUrl: './membership-and-plans.component.html',
  styleUrls: ['./membership-and-plans.component.scss']
})
export class MembershipAndPlansComponent implements OnInit {
  isBrowser: any;
  userDetails: any;
  placeholderImage: string;
  placeholderImageError: string;
  placeholderImageLoaded: boolean = false;
  registeredDate: Date;
  userSmsDetails: any;
  isDishUser: boolean;
  price: string;
  imageUrl: any = "";
  pageIndex: number;
  pageSize: number;
  OTTSubscriberID: number;
  isUserLoggedIn: boolean;

  DMS: any;
  subscriptionPlanList: any;
  loading: boolean = false;

  showCancelMembershipButton: boolean;

  termsOfUse: string = AppConstants.TERMS_OF_USE;

  constructor(@Inject(PLATFORM_ID) private platformId, private appUtilService: AppUtilService, private kalturaAppService: KalturaAppService,
              private kalturaUtilService: KalturaUtilService, private viewPortService: ViewPortService,
    private userFormService: UserFormService, private router: Router, private modalService: NgbModal, private snackBar: SnackbarUtilService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.placeholderImage = PlaceholderImage.PROFILE_BACKGROUND;
    this.placeholderImageError = AppConstants.IMAGE_CLOUD_FRONT_URL + AppConstants.PLACEHOLDER_IMAGES_KEY + 'banner.png';
    this.pageIndex = 1;
    this.pageSize = 10;
    this.DMS = this.appUtilService.getDmsConfig();
    this.subscriptionPlanList = [];
    this.showCancelMembershipButton = false;
  }

  ngOnInit() {
    this.onLoad();
    //  this.todayDate = new Date(new Date().setMonth(new Date().getMonth() + 3));
    this.moEngageEvent();
  }

  onLoad() {
      this.isUserLoggedIn = this.appUtilService.isUserLoggedIn();
      this.loading = true;
      if (this.isUserLoggedIn) {
          this.loading = true;
          this.userDetails = this.appUtilService.getLoggedInUserDetails();
          this.userSmsDetails = this.appUtilService.getLoggedInUserSMSDetails();
          this.OTTSubscriberID = this.userSmsDetails.OTTSubscriberID;
          this.registeredDate = new Date(this.userSmsDetails.RegisteredOn);
          if (localStorage.getItem(AppConstants.IS_DISH_USER) === 'true') {
              this.isDishUser = true;
              this.price = '150';
              this.image();
              this.registeredDate = new Date(this.registeredDate.setMonth(this.registeredDate.getMonth() + 6))
          } else {
              this.isDishUser = false;
              this.price = '90';
              this.image();
              this.registeredDate = new Date(this.registeredDate.setMonth(this.registeredDate.getMonth() + 3))
          }
          this.gtmTagEventButtonClickViewMembershipPlan();
      }
      this.placeholderImageLoaded = false;
      this.getActiveSubscription();
  }

  placeholderImageLoadedEvent(event) {
    if (event.returnValue) {
      console.log(event)
      this.placeholderImageLoaded = true;
    }
  }

  placeholderImageErrorEvent(event) {
    this.placeholderImage = this.placeholderImageError;
  }

  image() {
    this.kalturaAppService.getAssetById(this.DMS.baseChannels.membershipPlans, this.pageIndex, this.pageSize).then(response => {
      this.imageUrl = this.kalturaUtilService.getImageByOrientation(response.objects[0].images, "MEMBERSHIP", null, null, null, this.viewPortService.isMobile())
    }, reject => {
      console.error(reject)
    });
  }

  getActiveSubscription() {
    this.userFormService.getActiveSubscriptions(this.OTTSubscriberID).subscribe((response: any) => {
      if (response.ResultCode === 0) {
        this.subscriptionPlanList = response.Result;
        this.subscriptionPlanList.forEach((ele: any, index: number) => {
           if (ele.IsSubscribed) {
               if (ele.AutoDebitMode) {
                   this.showCancelMembershipButton = true;
               }
           }
        });
      }
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    });
  }

  gotoSelectedPlan(subscriptionPlanID: number, isSubscribed: number) {
    if (this.isUserLoggedIn) {
        if (isSubscribed === 0) {
            this.userFormService.getUserDetails(this.userSmsDetails.EmailID? this.userSmsDetails.EmailID : this.userSmsDetails.MobileNo,
                this.userSmsDetails.EmailID?'Email':'Mobile').subscribe((res:any) => {
                    if (res.ResultCode === 100) {
                        if (res.Result.Address && res.Result.Address.PinCode && res.Result.Address.PinCode.length === 6) {
                            this.router.navigate(['/user/subscriptiondetail'], {
                                queryParams: {
                                    id: subscriptionPlanID
                                }
                            });
                        } else {
                            this.router.navigate(['/user/details'], {
                                queryParams: {
                                    id: subscriptionPlanID
                                }
                            });
                        }
                    } else {
                        this.snackBar.showError();
                    }
            }, (error: any) => {
                    console.error(error);
                    this.snackBar.showError();
            });
        } else {
            this.snackBar.showError('You are already subscribed for this plan')
        }
    } else {
        this.snackBar.showError('Please Sign In to proceed')
    }

  }

    signInToProceed() {
        const modalRef = this.modalService.open(SignInSignUpModalComponent);

        modalRef.result.then((data) => {
            if (data) {
                this.onLoad();
            }
        }, (reason) => {
            console.log(reason);
        });

    }

    cancelMembership() {
        const modalRef = this.modalService.open(CancelMembershipComponent, { backdrop: "static", keyboard: false });
        modalRef.result.then((data) => {
            if (data) {
                this.showCancelMembershipButton = false;
                this.onLoad();
            }
        }, (reason) => {
            console.log(reason);
        });
    }

    gtmTagEventButtonClickViewMembershipPlan() {
        let dataLayerJson: any;
        dataLayerJson = {
            'type': this.appUtilService.getUserTypeAsName(),
            'userid': Math.ceil(new Date().getTime() / 1000),
        };
        this.appUtilService.getGTMTag(dataLayerJson, 'view_membership_plan');
    }

    moEngageEvent() {
        var data = {
            user_type: this.appUtilService.getUserTypeAsName()
        }
        this.appUtilService.moEngageEventTracking('View_Membership_Page', data);
    }
}
