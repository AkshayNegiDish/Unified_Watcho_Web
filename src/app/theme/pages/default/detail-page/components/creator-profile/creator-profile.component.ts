import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { AppConstants, PlaceholderImage } from '../../../../../shared/typings/common-constants';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-creator-profile',
  templateUrl: './creator-profile.component.html',
  styleUrls: ['./creator-profile.component.scss']
})
export class CreatorProfileComponent implements OnInit {

  assetId: number;
  loading: boolean;
  assetDetails: any;
  screenId: string;
  isDetailPage: boolean;
  DMS: any;
  moreVideoRailData: any;
  similarToCreator: any;
  placeholderImage: string;
  placeholderImageError: string;
  placeholderImageLoaded: boolean = false;
  userId: any;
  userSubscriberId: string;
  hideFollowButton: boolean = false;
  isMoreVideos: boolean = false;

  constructor(private kalturaAppService: KalturaAppService,
    private snackbarUtilService: SnackbarUtilService, private route: ActivatedRoute,
    public appUtilService: AppUtilService, private kalturaUtilService: KalturaUtilService, private titleService: Title,
    private router: Router) {
    this.isDetailPage = true;
    this.moreVideoRailData = null;
    this.similarToCreator = null;

    // override the route reuse strategy
    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // }

    // this.router.events.subscribe((evt) => {
    //   if (evt instanceof NavigationEnd) {
    //     // trick the Router into believing it's last link wasn't previously loaded
    //     this.router.navigated = false;
    //     // if you need to scroll back to top, here is the right place
    //     window.scrollTo(0, 0);
    //   }
    // });
    this.placeholderImage = PlaceholderImage.UGC_CREATOR;
    this.placeholderImageError = AppConstants.IMAGE_CLOUD_FRONT_URL + AppConstants.PLACEHOLDER_IMAGES_KEY + 'banner.png';
  }

  ngOnInit() {
    this.DMS = this.appUtilService.getDmsConfig();
    this.screenId = environment.ENVEU.SCREEN_IDS.UGC_PROFILE_DETAIL;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.assetDetails = null;
      this.similarToCreator = null;
      this.moreVideoRailData = null;
      this.assetId = +params.get('assetId');
      this.getCreatorAsset(this.assetId);
    })
  }


  getCreatorAsset(assetId: number) {
    this.kalturaAppService.getMediaAssetById(assetId.toString()).then(response => {
      this.assetDetails = response;
      this.detailsPageVisited(this.assetDetails.type);
      if (this.appUtilService.isUserLoggedIn()) {
        this.userSubscriberId = this.appUtilService.getLoggedInUserSMSDetails().OTTSubscriberID.toString();
        this.userId = response.tags.SeriesId.objects[0].value.split('_')
        if (this.userSubscriberId === this.userId[1]) {
          this.hideFollowButton = true;
        }
      }

      this.titleService.setTitle("See " + this.assetDetails.name + "'s uploaded videos and profile | " + AppConstants.APP_NAME_CAPS + " Creators")
      this.getNoOfSeasonInSeries(this.kalturaUtilService.getTagsObjectValue(this.assetDetails.tags.SeriesId));
      this.getSimilarCreator();
      this.loading = false;
    }, reject => {
      this.loading = false;
      this.snackbarUtilService.showError(reject.message);
    });
  }

  ngOnDestroy() {
  }



  getNoOfSeasonInSeries(seriesId: string) {
    this.kalturaAppService.getNoOfSeasonInSeries(seriesId, this.DMS.params.MediaTypes.UGCVideo, true).then(res => {
      this.moreVideoRailData = res;
      this.isMoreVideos = this.moreVideoRailData.totalCount > 4 ? true : false;
    }, reject => {
      console.error(reject);
    });
  }

  getSimilarCreator() {
    this.kalturaAppService.kalturaSearchAsset(null, this.DMS.params.MediaTypes.UGCCreator, 1, 20).then(res1 => {
      this.similarToCreator = res1;
    }, reject => {
      console.error(reject);
    });
  }

  placeholderImageLoadedEvent(event) {
    this.placeholderImageLoaded = true;
  }

  placeholderImageErrorEvent(event) {
    this.placeholderImageLoaded = true;
    this.placeholderImage = this.placeholderImageError;
  }

  detailsPageVisited(id: number) {
    let userDetails: any;
    let utmParams: any;
    if (JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS))) {
      userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
    }
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      utmParams = params;
    });
    if (this.appUtilService.getMediaTypeNameById(id) === 'UGC Creator') {
      let detailsPageInfo = {
        user_id: userDetails !== undefined ? userDetails.UserID : null,
        mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
        email: userDetails !== undefined ? userDetails.EmailID : null,
        name: userDetails !== undefined ? userDetails.Name : null,
        utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
        utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
        utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
        page_location: 'creator_profile_page',
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_creator_name: this.assetDetails.name,
        status: 'page_load_successful'
      }
      this.appUtilService.moEngageEventTracking('DETAILS_PAGE_VISITED', detailsPageInfo);
    }
  }
}
