import { Component, OnInit } from '@angular/core';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { SignInSignUpModalComponent } from '../../../../../shared/entry-component/signIn-signUp-modal.component';
import { LoginMessageService } from '../../../../../shared/services/auth';
import { AppConstants } from '../../../../../shared/typings/common-constants';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
declare var $: any


@Component({
  selector: 'app-more-page',
  templateUrl: './more-page.component.html',
  styleUrls: ['./more-page.component.scss']
})
export class MorePageComponent implements OnInit {
  _opened: boolean;
  height: string;
  followToogleFlag: any;
  attribute: { status: string; };
  userImage: any;
  showUserName: boolean;
  userName: any;
  dms: any;
  showContest: boolean = false;

  constructor(private appUtilService: AppUtilService, private modalService: NgbModal, private router: Router, private loginMessageService: LoginMessageService, private platformIdentifierService: PlatformIdentifierService) { }

  ngOnInit() {
    if (this.appUtilService.isUserLoggedIn()) {
      let user = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
      if (user) {
        this.userName = user.Name;
      }
      this.showUserName = true;
    } else {
      this.showUserName = false;
    }
    this.loginMessageService.currentMessage$.subscribe((message) => {
      if (message !== null) {
        if (message) {
          this.showUserName = true;
          let user = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
          if (user) {
            this.userImage = user.ProfileImagePath;
            this.userName = user.Name;
          }
          this.loginMessageService.imageChangedMessage(true);
        } else {
          this.showUserName = false;
          this.userImage = "https://d1f8xt8ufwfd45.cloudfront.net/web/placeholder-images/user.png";
        }
      }
    });

    this.loginMessageService.imageChanged$.subscribe((message) => {
      if (message) {
        let userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
        try {
          if (userDetails.ProfileImagePath) {
            this.userImage = userDetails.ProfileImagePath;
          } else {
            this.userImage = "https://d1f8xt8ufwfd45.cloudfront.net/web/placeholder-images/user.png";
          }
        } catch (e) {

        }

      }
    })
    this.showContest = this.appUtilService.getShowContestStatus();

  }

  toogleFollowList() {
    if (this.followToogleFlag) {
      this.followToogleFlag = false;
    } else {
      this.followToogleFlag = true;
    }
    $('.follow-submenu').slideToggle()
  }

  openCreatorFollowingPage() {
    if (this.appUtilService.isUserLoggedIn()) {
      this.router.navigateByUrl("/user/followed-creators");
      this.clickCreatorsMoEngageEvent();
    } else {
      this.openLoginModal();
    }
  }

  openFollowedSeries() {
    if (this.appUtilService.isUserLoggedIn()) {
      this.router.navigateByUrl("/user/followed-series");
      this.clickSeriesMoEngageEvent()
    } else {
      this.openLoginModal();
    }
  }

  openMyWatchlist() {
    if (this.appUtilService.isUserLoggedIn()) {
      this.router.navigateByUrl("/user/mywatchlist");
      this.myWatchlistMoEngageClick();
      this.gtmTagEventButtonClickMyWatchlist();
    } else {
      this.openLoginModal();
    }
  }

  openMyUploads() {
    if (this.appUtilService.isUserLoggedIn()) {
      this.router.navigateByUrl("/ugc/ugc-my-uploads");
      this.clickMyUploadsMoEngageEvent();
      this.gtmTagEventButtonClickMyUpload();
    } else {
      this.openLoginModal();
    }
  }

  openSettings() {
    if (this.appUtilService.isUserLoggedIn()) {
      this.router.navigateByUrl("/user/settings");
      this.clickSettingsPageMoEngage();
      this.gtmTagEventButtonClickAccountAndSetting();
    } else {
      this.openLoginModal();
    }
  }

  openLoginModal() {
    const modalRef = this.modalService.open(SignInSignUpModalComponent);
    this.appUtilService.pausePlayer();
    modalRef.result.then((data) => {
      this.appUtilService.playPlayer();
    }, (reason) => {
      this.appUtilService.playPlayer();
    });
  }








  clickSettingsPageMoEngage() {
    this.appUtilService.moEngageEventTrackingWithNoAttribute("visit_settings_page");
  }

  clickFollowingMoEngageEvent() {
    this.attribute = {
      status: "page_load_successful"
    }
    this.appUtilService.moEngageEventTracking("visit_following_page", this.attribute);
    this.gtmTagOnFollowing();
  }

  clickCreatorsMoEngageEvent() {
    this.attribute = {
      status: "redirection_successful"
    }
    this.appUtilService.moEngageEventTracking("click_followed_creator", this.attribute);
    this.gtmTagOnCreators();
  }

  clickSeriesMoEngageEvent() {
    this.attribute = {
      status: "redirection_successful"
    }
    this.appUtilService.moEngageEventTracking("click_followed_series", this.attribute);
    this.gtmTagOnSeries();
  }

  clickMyUploadsMoEngageEvent() {
    this.attribute = {
      status: "page_load_successful"
    }
    this.appUtilService.moEngageEventTracking("visit_uploads_page", this.attribute);
  }


  myWatchlistMoEngageClick() {
    this.attribute = {
      status: "page_load_successful"
    }
    this.appUtilService.moEngageEventTracking("visit_watchlist_page", this.attribute);

  }

  gtmTagEventButtonClickSignIn() {
    let dataLayerJson: any;
    dataLayerJson = {
      'Button_ID': 'sign_in',
      'Button_Name': 'Sign_In',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'Button_Location': 'Sign_In_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'Sign_in');
  }
  gtmTagEventButtonClickMyWatchlist() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'watchlist',
      'Button_Name': 'Watchlist',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'Drop_down'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'Watchlist');
  }

  gtmTagEventButtonClickMyUpload() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'my_uploads',
      'Button_Name': 'My Uploads',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'Drop_down'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'My_Uploads');
  }

  gtmTagEventButtonClickMembershipAndPlan() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'membership_&_plans',
      'Button_Name': 'Membership & Plans',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'Drop_down'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'Membership_&_Plans');
  }

  gtmTagEventButtonClickAccountAndSetting() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'account_&_settings',
      'Button_Name': 'Account & Settings',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'Drop_down'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'Account_&_Settings');
  }

  gtmTagOnUploadIcon() {
    let dataLayerJson = {
      'Button_ID': 'Video_Upload_ICON',
      'Button_Name': 'Video Upload ICON',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'Button_Location': 'All_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'Video_Upload_ICON');
  }

  gtmTagOnProfileIcon() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'profile_icon',
      'Button_Name': 'Profile Icon',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'All_Pages'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'Profile_icon');
  }

  gtmTagOnFollowing() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'following',
      'Button_Name': 'Following',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'Drop_down'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'Following');
  }

  gtmTagOnCreators() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'creators',
      'Button_Name': 'Creators',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'Side_Drop_down'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'Creators');
  }

  gtmTagOnSeries() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'series',
      'Button_Name': 'Series',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'Side_Drop_down'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'Series');
  }

  gotoRechargeClickEvent() {
    if (this.appUtilService.isUserLoggedIn()) {
      if (this.platformIdentifierService.isBrowser()) {
        const user_category = Number(localStorage.getItem(AppConstants.USER_CATEGORY));
        if (user_category === 3) {
          this.router.navigateByUrl('/user/membershipandplans');
        } else {
          this.router.navigateByUrl('/user/rechargedetail');
        }
      }
    } else {
      this.router.navigateByUrl('/user/membershipandplans');
    }
  }
}
