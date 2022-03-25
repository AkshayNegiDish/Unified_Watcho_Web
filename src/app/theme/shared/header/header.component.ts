import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { SignInSignUpModalComponent } from '../entry-component/signIn-signUp-modal.component';
import { AppUtilService } from '../services/app-util.service';
import { LoginMessageService } from '../services/auth';
import { CommonMessageService } from '../services/common-message.service';
import { PlatformIdentifierService } from '../services/platform-identifier.service';
import { SmsFormService } from '../services/sms-form.service';
import { AppConstants, Branch, PlaceholderImage } from '../typings/common-constants';
import { profilepicconst } from '../typings/image-constants';
import { MessageServiceConstants, SearchQueryCommand } from '../typings/shared-typing';
import { startWith, delay, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MyDishTvSpaceService } from '../../pages/default/my-dish-tv-space/services/mydishtvspace.service';


declare var $: any;
declare var branch: any;


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  isBrowser;
  isUserLogin: boolean;
  loginName: any;
  attribute: any;
  isMobileTabletView: boolean;
  searchQuery = new SearchQueryCommand();
  authToken: string;
  removeAllSession: boolean;

  getLatest: boolean;
  installCard: boolean = true;

  message: boolean;
  // subscription: Subscription;
  providers: [CommonMessageService]
  loading: boolean;
  emailSent: boolean;
  isVerified: boolean;

  // localAmplifyService: AmplifyService;

  logoutModalRef: any;
  conf: any;
  cloudfrontUrl: Subscription;
  config: any;
  imageProperties: any;
  Initdata: any;
  data: any;
  id: any;
  contentType: any;

  // handle mobile/tablet view
  private _opened: boolean = false;
  private _closeOnClickOutside: boolean = true;
  private _closeOnClickBackdrop: boolean = false;
  height: string;
  placeHolder: string;
  watchoAppLogo: string;
  followToogleFlag: boolean = false;
  userDetails: any;
  userImage: string = null;
  url: string;
  isHomeIsActive: boolean;
  isLiveTVActive: boolean;
  isspotlightActive: boolean;
  ispremiumActive: boolean;
  isMoviesActive: boolean;
  isRechargeActive: boolean;
  isHideLink: boolean = false;
  isMobileView: boolean = false;
  onNavigationPage: boolean = false;
  userCategory: string 
  isUgcActive: boolean;
  ugcPageVisited: boolean = false;
  dms: any = null;
  showContest: boolean = false;
  browserDetails: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId, 
    private modalService: NgbModal, 
    private router: Router,
    private loginMessageService: LoginMessageService, 
    private commonMessageService: CommonMessageService, 
    private mydishtvspaceservice: MyDishTvSpaceService,
    public appUtilService: AppUtilService, 
    private platformIdentifierService: PlatformIdentifierService, 
    private smsService: SmsFormService) {
    this.userCategory = this.mydishtvspaceservice.getUserCategory();
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
        this.toggleActive()
      }
    });

    this.getLatest = true;
    this.isBrowser = isPlatformBrowser(platformId);
    this.watchoAppLogo = PlaceholderImage.WATCHO_APP_LOGO;
    if (this.isBrowser) {
      if (localStorage.getItem(AppConstants.AUTH_HEADER_KEY)) {
        this.isUserLogin = true;
        this.loginMessageService.imageChangedMessage(true);
      }
      else {
        this.isUserLogin = false;
      }
      this.placeHolder = PlaceholderImage.USER;
    }

    this.commonMessageService.commonMessageObj$.subscribe((arr: any[]) => {
      if (arr && arr[0] === MessageServiceConstants.RESET_SEARCH_QUERY) {
        this.searchQuery.query = null;
      }
    });

    // this.commonMessageService.signInToggleObj$.subscribe((messageLogin: boolean) => {
    //   this.isUserLogin = !messageLogin;
    //   // console.log(this.isUserLogin)

    // }, (error) => {
    //   console.error(error);
    // });

    this.commonMessageService.searchQueryObj$.subscribe((query: string) => {
      if (query) {
        this.searchQuery.query = query;
      } else {
        this.searchQuery.query = null;
      }
    });
    this.browserDetails = this.appUtilService.getBrowserDetails();
  }


  ngOnInit() {
    if (this.isBrowser) {
      // this.userCategory = localStorage.getItem("user-category");
      $(document).ready(() => {
        branch.init(Branch.KEY, (err, data) => {
          this.Initdata = data.data;
        });
      });
      this.showContest = this.appUtilService.getShowContestStatus();
    }

    let url = this.router.url.split('?q=');
    if (url[0] === '/search') {
      if (url[1] !== undefined) {
        this.searchQuery.query = decodeURIComponent(url[1]);
      } else {
        this.searchQuery.query = null;
      }
    } else {
      this.searchQuery.query = null;
    }

    if (this.isBrowser) {
      this.toggleActive();
      $(document).ready(() => { //<<====== wont work without this
        $(window).scroll(() => {
          this.hideInstallCard()
        });
      });
      if (matchMedia('(max-width: 992px)').matches) {
        this.isMobileView = false;
        if (matchMedia('(max-width: 768px)').matches) {
          this.isMobileView = true;
        }
        this.isMobileTabletView = true;
      } else {
        this.isMobileTabletView = false;
      }
      // detect mobile and render mobile side bar
      $(window).bind("orientationchange", () => {

        // switch(window.orientation) {  
        //   case -90 || 90 || 0:
        //     alert('landscape');
        //     this.isMobileTabletView = true;
        //     break;
        //   default:
        //     alert('portrait');
        //     this.isMobileTabletView = false;
        //     break; 
        // }
        if (!this.isMobileView) {
          setTimeout(() => {
            if (matchMedia('(max-width: 768px)').matches) {
              this.isMobileView = true;
              this.isMobileTabletView = true;
            } else {
              this.isMobileTabletView = !this.isMobileTabletView;
            }
          }, 400)
        }
      });


      if (this.isMobileTabletView !== true) {
        $(window).scroll(() => {
          if ($(window).scrollTop() >= 5) {
            $('.nav-container').addClass('nav-bar-highlighted');
          }
          else {
            $('.nav-container').removeClass('nav-bar-highlighted');
          }
        });

      } else {
        $(document).ready(() => {
          $('.nav-container').addClass('nav-bar-fixed');
        });
      }

      if (screen.width < 769) {
        $(document).ready(function () {
          var scrollTop = 0;
          $(window).scroll(function () {
            scrollTop = $(window).scrollTop();
            //  $('.counter').html(scrollTop);
            if (scrollTop >= 25) {
              $('.nav-container').addClass('scrolled-nav');

            } else if (scrollTop < 25) {
              $('.nav-container').removeClass('scrolled-nav');
              // $('.main-content').css("margin-top","60px");
            }

          });

        });
      }




      this.imageProperties = profilepicconst.filters;

      this.loginMessageService.currentMessage$.subscribe((message) => {
        this.message = message
        if (message !== null) {
          if (this.message) {
            // Sets an unique identity for the user
            branch.setIdentity(
              this.appUtilService.getLoggedInUserSMSDetails().OTTSubscriberID.toString(),
              (err, data) => {
              }
            );
            let user = this.appUtilService.getLoggedInUserDetails();
            if (user) {
              this.loginName = user.firstName;
            }
            this.loginMessageService.imageChangedMessage(true);
            this.isUserLogin = true;
          } else {

            this.isUserLogin = false;
          }
        }

        this.getLatest = true;
      });

      this.loginMessageService.imageChanged$.subscribe((message) => {
        if (message) {
          this.userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS))
          let supportWebpCluodFrontUrl: string = this.browserDetails.browser !== "Safari" ? environment.WEBP_JPEG_CLOUDFRONT_URL + environment.WEBP_CLOUDFRONT_URL : environment.WEBP_JPEG_CLOUDFRONT_URL + environment.JPEG_CLOUDFRONT_URL;
          try {
            if (this.userDetails.ProfileImagePath) {
              this.userImage = supportWebpCluodFrontUrl + this.userDetails.ProfileImagePath;
            }
          } catch (e) {

          }

        }
      })



      // if (sessionStorage.getItem('isDeviceRemovedOnLogin')) {
      //   this.gotoDeviceManagement(true);
      // }
      if (sessionStorage.getItem('install-card-closed') === 'true') {
        this.installCard = false;
      }

      if (localStorage.getItem(AppConstants.AUTH_HEADER_KEY)) {
        this.userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS))
        this.getUserDetails(this.userDetails.UserID, this.userDetails.UserType, localStorage.getItem(AppConstants.AUTH_HEADER_KEY).toString())
      }

    }

  }

  stopBubbeling(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  toggleDropdownMenu() {
    $(".dropdown-toggle").dropdown("toggle");
  }

  openSignInModal() {
    const modalRef = this.modalService.open(SignInSignUpModalComponent);
    this.appUtilService.pausePlayer();
    this.gtmTagEventButtonClickSignIn();
    modalRef.result.then((data) => {
      this.isUserLogin = this.appUtilService.isUserLoggedIn();
      this.appUtilService.playPlayer();
      this.userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
      this.userCategory = this.userDetails.UserCategory;
    }, (reason) => {
      this.appUtilService.playPlayer();
    });
  }
  ngAfterViewInit(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.loginMessageService.messageChanged$.pipe(startWith(null),
      delay(0), tap((ugcPageVisited) => {
        try {
          if (ugcPageVisited) {
            this.ugcPageVisited = true;
          } else {
            this.ugcPageVisited = false;
          }
        } catch (e) {
          this.ugcPageVisited = false;
        }
      })).subscribe()
  }
  searchdefault() {
    this.router.navigate(["search"], { queryParams: { q: this.searchQuery.query } })
    this.gtmTagOnSearch();

  }



  _toggleSidebar() {
    this._opened = true;
  }

  _toggleOpened(): void {
    this._opened = !this._opened;
    this.height = "height"
    $('.navbar-brand').addClass('navbar-brand-toggle-sidebar');
    this.showLoginName();
  }

  _onClosed() {
    this.height = ""
    $('.navbar-brand').removeClass('navbar-brand-toggle-sidebar');
  }

  private _positionChanged(e) {
  }

  focus2($event) {
    event.preventDefault();
    // $('#search-input-control').focus(); 
  }

  focus() {
    // $("#search-input-control").css("width", "300px");
    if (this.searchQuery.query) {
      $('#search-input-control').focus();
      this.searchdefault();
    } else {
      $('#search-input-control').focus();
    }
  }

  hideInstallCard() {
    if (this.platformIdentifierService.isBrowser()) {
      if (sessionStorage.getItem('install-card-closed') === 'true') {
        this.installCard = false;
      } else {
        if (document.body.scrollTop > 2 || document.documentElement.scrollTop > 2) {
          this.installCard = false;
        } else {
          this.installCard = true
        }
      }
    }


  }
  closeInstallCard() {
    if (this.platformIdentifierService.isBrowser()) {
      sessionStorage.setItem('install-card-closed', 'true')
      this.installCard = false;
    }

  }

  toogleFollowList() {
    if (this.followToogleFlag) {
      this.followToogleFlag = false;
    } else {
      this.followToogleFlag = true;
    }
    $('.follow-submenu').slideToggle()
  }

  ugcUploadCheckForLoggin() {
    if (this.appUtilService.isUserLoggedIn() === false) {
      const modalRef = this.modalService.open(SignInSignUpModalComponent);
      this.appUtilService.pausePlayer();
      modalRef.result.then((data) => {
        this.appUtilService.playPlayer();
      }, (reason) => {
        this.appUtilService.playPlayer();
      });
    } else {
      this.router.navigate(["/ugc/my-uploads"])
    }
    this.gtmTagOnUploadIcon();
  }

  showLoginName() {
    if (this.isUserLogin) {
      let user = this.appUtilService.getLoggedInUserSMSDetails();
      if (user) {
        this.loginName = user.Name;
      }
    }
  }

  myWatchlistMoEngageClick() {
    this.attribute = {
      status: "page_load_successful"
    }
    this.appUtilService.moEngageEventTracking("VISIT_WATCHLIST_PAGE", this.attribute);

  }

  clickMembershipAndPlansPageMoEngage() {
    this.appUtilService.moEngageEventTrackingWithNoAttribute("VISIT_MEMBERSHIP_PAGE");
  }

  clickSettingsPageMoEngage() {
    this.appUtilService.moEngageEventTrackingWithNoAttribute("VISIT_SETTINGS_PAGE");
  }

  clickUserIconWebMoEngageEvent(event: any) {

    this.attribute = {
      nav_item_name: "user_icon_web"
    }
    this.appUtilService.moEngageEventTracking("NAVIGATION_BAR_CLICKED", this.attribute);
    this.gtmTagOnProfileIcon();
  }

  clickHomeMoEngageEvent() {
    this.attribute = {
      nav_item_name: "home_page"
    }
    this.appUtilService.moEngageEventTracking("NAVIGATION_BAR_CLICKED", this.attribute);
  }

  clickPremiumMoEngageEvent() {
    this.attribute = {
      nav_item_name: "exclusives"
    }
    this.appUtilService.moEngageEventTracking("NAVIGATION_BAR_CLICKED", this.attribute);
  }

  clickSpotlightMoEngageEvent() {
    this.attribute = {
      nav_item_name: "spotlight"
    }
    this.appUtilService.moEngageEventTracking("NAVIGATION_BAR_CLICKED", this.attribute);
  }

  clickLiveTvMoEngageEvent() {
    this.attribute = {
      nav_item_name: "live_tv"
    }
    this.appUtilService.moEngageEventTracking("NAVIGATION_BAR_CLICKED", this.attribute);
  }

  clickSearchIconMoEngageEvent() {
    this.attribute = {
      time_since_app_open: "time elapsed since session start on app/web"
    }
    this.appUtilService.moEngageEventTracking("SEARCH_BUTTON_CLICKED", this.attribute);
  }

  clickFollowingMoEngageEvent() {
    this.attribute = {
      status: "page_load_successful"
    }
    this.appUtilService.moEngageEventTracking("VISIT_FOLLOWING_PAGE", this.attribute);
    this.gtmTagOnFollowing();
  }

  clickCreatorsMoEngageEvent() {
    this.attribute = {
      status: "redirection_successful"
    }
    this.appUtilService.moEngageEventTracking("CLICK_FOLLOWED_CREATOR", this.attribute);
    this.gtmTagOnCreators();
  }

  clickSeriesMoEngageEvent() {
    this.attribute = {
      status: "redirection_successful"
    }
    this.appUtilService.moEngageEventTracking("CLICK_FOLLOWED_SERIES", this.attribute);
    this.gtmTagOnSeries();
  }

  clickMyUploadsMoEngageEvent() {
    this.attribute = {
      status: "page_load_successful"
    }
    this.appUtilService.moEngageEventTracking("VISIT_UPLOADS_PAGE", this.attribute);
  }

  clickMyDishTvSpace() {

  }

  clickMyD2hSpace() {

  }

  gtmTagEventButtonClickSignIn() {
    let dataLayerJson: any;
    dataLayerJson = {
      'button_id': 'sign_in',
      'button_name': 'Sign_In',
      'redirection_url': null,
      'button_image': null,
      'successful': 'successful',
      'button_location': 'Sign_In_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'sign_in');
  }
  gtmTagEventButtonClickMyWatchlist() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'button_id': 'watchlist',
      'button_name': 'Watchlist',
      'redirection_url': null,
      'button_image': null,
      'successful': 'successful',
      'user_id': getTimeStamp,
      'button_location': 'Drop_down'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'watchlist');
  }

  gtmTagEventButtonClickMyUpload() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'button_id': 'my_uploads',
      'button_name': 'My Uploads',
      'redirection_url': null,
      'button_image': null,
      'successful': 'successful',
      'user_id': getTimeStamp,
      'button_location': 'Drop_down'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'my_uploads');
  }

  gtmTagEventButtonClickMembershipAndPlan() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'button_id': 'membership_&_plans',
      'button_name': 'Membership & Plans',
      'redirection_url': null,
      'button_image': null,
      'successful': 'successful',
      'user_id': getTimeStamp,
      'button_location': 'Drop_down'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'membership_&_plans');
  }

  gtmTagEventButtonClickAccountAndSetting() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'button_id': 'account_&_settings',
      'button_name': 'Account & Settings',
      'redirection_url': null,
      'button_image': null,
      'successful': 'successful',
      'user_id': getTimeStamp,
      'button_location': 'Drop_down'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'account_&_settings');
  }

  gtmTagEventButtonClickMyDishTvSpace() {

  }

  gtmTagEventButtonClickMyD2hSpace() {

  }

  toggleActive() {
    this.resetControlFlags();
    if ((this.url.indexOf("premium") > 0) && (this.url.indexOf("search") < 0) && (this.url.indexOf("list") < 0) && (this.url.indexOf("details") < 0)) {
      this.onNavigationPage = true;
      this.ispremiumActive = true;
    } else if ((this.url.indexOf("spotlight") > 0) && (this.url.indexOf("details") < 0) && (this.url.indexOf("search") < 0) && (this.url.indexOf("list") < 0)) {
      this.onNavigationPage = true;
      this.isspotlightActive = true;
    } else if ((this.url.indexOf("live-tv") > 0) && (this.url.indexOf("search") < 0) && (this.url.indexOf("list") < 0) && (this.url.indexOf("details") < 0)) {
      this.onNavigationPage = true;
      $('.live-screen').css('color', '#ffffff')
      this.isLiveTVActive = true;
    } else if (this.url === '/') {
      this.isHomeIsActive = true;
      this.onNavigationPage = true;
    } else if (this.url === '/?mode=standalone') {
      this.isHomeIsActive = true;
      this.onNavigationPage = true;
    } else if ((this.url.indexOf("movies") > 0) && (this.url.indexOf("search") < 0) && (this.url.indexOf("list") < 0) && (this.url.indexOf("details") < 0)) {
      this.isMoviesActive = true;
      this.onNavigationPage = true;
    } else if ((this.url.indexOf("more-page") > 0) && (this.url.indexOf("search") < 0) && (this.url.indexOf("list") < 0) && (this.url.indexOf("details") < 0)) {
      this.onNavigationPage = true;
    } else if ((this.url.indexOf("rechargedetail") > 0) && (this.url.indexOf("user") < 0) && (this.url.indexOf("list") < 0) && (this.url.indexOf("details") < 0)) {
      this.isRechargeActive = true;
      this.onNavigationPage = true;
    } else if ((this.url.indexOf("ugc-videos") > 0)) {
      this.isUgcActive = true;
    } else {
      this.onNavigationPage = false;
    }
  }

  resetControlFlags() {
    this.isHomeIsActive = false;
    this.ispremiumActive = false;
    this.isspotlightActive = false;
    this.isLiveTVActive = false;
    this.isMoviesActive = false;
    this.isRechargeActive = false;
    this.isUgcActive = false;
  }

  getUserDetails(userName, userType, token) {
    let supportWebpCluodFrontUrl: string = this.browserDetails.browser !== "Safari" ? environment.WEBP_JPEG_CLOUDFRONT_URL + environment.WEBP_CLOUDFRONT_URL : environment.WEBP_JPEG_CLOUDFRONT_URL + environment.JPEG_CLOUDFRONT_URL;
    this.smsService.getUserDetail(userName, userType, token).subscribe((res: any) => {
      if (res.Result) {
        this.userDetails = res.Result;
        localStorage.setItem(AppConstants.USER_DETAILS_SMS, JSON.stringify(res.Result));
        if (this.userDetails.ProfileImagePath) {
          this.userImage = supportWebpCluodFrontUrl + this.userDetails.ProfileImagePath;
        }
        this.loginName = this.userDetails.Name;
        this.userCategory = this.userDetails.UserCategory;
      }
    }, (error) => {
    })
  }

  gtmTagOnSearch() {
    let datalayerJson = {
      'button_id': 'search',
      'button_name': 'Search',
      'button_location': 'Header_Section',
      'redirection_url': null,
      'button_image': null,
      'successful': 'successful',
      'search_text': this.searchQuery.query
    };
    this.appUtilService.getGTMTag(datalayerJson, 'search');
  }

  gtmTagOnLogo() {
    let dataLayerJson = {
      'button_id': 'watcho_logo_click',
      'button_name': 'Watcho_Logo_Click',
      'redirection_url': null,
      'button_image': null,
      'successful': 'successful',
      'button_location': 'All_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'watcho_logo_click');
  }

  gtmTagOnUploadIcon() {
    let dataLayerJson = {
      'button_id': 'Video_Upload_ICON',
      'button_name': 'Video Upload ICON',
      'redirection_url': null,
      'button_image': null,
      'successful': 'successful',
      'button_location': 'All_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'video_upload_icon');
  }

  gtmTagOnProfileIcon() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'button_id': 'profile_icon',
      'button_name': 'Profile Icon',
      'redirection_url': null,
      'button_image': null,
      'successful': 'successful',
      'user_id': getTimeStamp,
      'button_location': 'All_Pages'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'profile_icon');
  }

  gtmTagOnFollowing() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'button_id': 'following',
      'button_name': 'Following',
      'redirection_url': null,
      'button_image': null,
      'successful': 'successful',
      'user_id': getTimeStamp,
      'button_location': 'Drop_down'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'following');
  }

  gtmTagOnCreators() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'button_id': 'creators',
      'button_name': 'Creators',
      'redirection_url': null,
      'button_image': null,
      'successful': 'successful',
      'user_id': getTimeStamp,
      'button_location': 'Side_Drop_down'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'creators');
  }

  gtmTagOnSeries() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'button_id': 'series',
      'button_name': 'Series',
      'redirection_url': null,
      'button_image': null,
      'successful': 'successful',
      'user_id': getTimeStamp,
      'button_location': 'Side_Drop_down'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'series');
  }

  gotoRechargeClickEvent() {
    if (this.isUserLogin) {
      if (this.isBrowser) {
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
    this.toggleDropdownMenu();
  }

  gtmTagOnWatchoAurJeeto() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'watcho-aur-jeeto',
      'Button_Name': 'Watcho Aur Jeeto',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'Header_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'watcho-aur-jeeto');
  }

}

