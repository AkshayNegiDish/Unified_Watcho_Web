
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { AppConstants } from '../../../../../shared/typings/common-constants';
import { environment } from '../../../../../../../environments/environment';
import { ModalMessageService } from '../../../../../shared/services/modal-message.service';

@Component({
  selector: 'app-ugc-videos-detail-page',
  templateUrl: './ugc-videos-detail-page.component.html',
  styleUrls: ['./ugc-videos-detail-page.component.scss']
})
export class UgcVideosDetailPageComponent implements OnInit {

  assetId: number;
  assetDetails: any;
  screenId: string;
  isDetailPage: boolean;
  showPlayer: boolean = false;
  DMS: any;
  pageSubscription: Subscription;
  loading: boolean;
  moreVideoRailData: any;
  similarToCreator: any;
  creatorName: string;
  totalCount: number;
  creatorId: any;
  userAssetDetails: any;
  userSeriesId: any;
  creatorDetail: any;
  userSubscriberId: string;
  userId: string;
  hideFollowButton: boolean = false;
  isAssetInWatchlist: boolean = false;
  reinitiatePlayer: boolean = true;
  isMoreVideos: boolean = false;

  constructor(private route: ActivatedRoute, private kalturaAppService: KalturaAppService,
    private router: Router, public appUtilService: AppUtilService, private kalturaUtilService: KalturaUtilService,
    private snackbarUtilService: SnackbarUtilService, private titleService: Title, private platformIdentifierService: PlatformIdentifierService, private modalMessageService: ModalMessageService) {
    this.isDetailPage = true;
    this.moreVideoRailData = null;
    this.similarToCreator = null;
    this.creatorName = "";

    // // override the route reuse strategy
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
    this.modalMessageService.messageCommonObj$.subscribe((res: boolean) => {
      if (!res) {
        this.reinitiatePlayer = true;
      } else {
        this.reinitiatePlayer = false;
      }
    })
  }

  ngOnInit() {
    this.DMS = this.appUtilService.getDmsConfig();
    if (this.platformIdentifierService.isBrowser()) {
      this.screenId = environment.ENVEU.SCREEN_IDS.UGC_VIDEO_DETAIL;
    }
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.assetDetails = null;
      this.assetId = +params.get('assetId');
      this.creatorId = params.get('userId');
      this.getAssetDetails(this.assetId.toString());
    })
  }

  getCreatorAsset(assetId: string, typeIn: string) {
    this.kalturaAppService.getNoOfSeasonInSeries(assetId, typeIn, true).then(response => {
      this.userAssetDetails = response.objects[0];
    }, reject => {
      this.snackbarUtilService.showError(reject.message);
    });
  }
  getAssetDetails(assetId: string) {
    this.kalturaAppService.getMediaAssetById(assetId).then((res: any) => {
      this.assetDetails = res;
      this.gtmTagEventOnDetailPage(this.assetDetails);
      this.userSeriesId = this.assetDetails.tags.SeriesId.objects[0].value;
      if (this.appUtilService.isUserLoggedIn()) {
        this.userSubscriberId = this.appUtilService.getLoggedInUserSMSDetails().OTTSubscriberID.toString();
        this.userId = this.userSeriesId.split('_')
        if (this.userSubscriberId === this.userId[1]) {
          this.hideFollowButton = true;
        }
      }
      this.getCreatorAsset(this.userSeriesId, this.DMS.params.MediaTypes.UGCCreator);

      this.getNoOfSeasonInSeries(this.kalturaUtilService.getTagsObjectValue(this.assetDetails.tags.SeriesId));
      this.getSimilarCreator();
      this.creatorName = this.kalturaUtilService.getTagsObjectValue(this.assetDetails.tags['Series Name']);
      this.loading = false;
      this.titleService.setTitle("See " + this.assetDetails.name + " uploaded by " + this.creatorName + " | " + AppConstants.APP_NAME_CAPS + " Creators")
    }, reject => {
      this.loading = false;
      this.snackbarUtilService.showError(reject.message);
    })
  }



  ngOnDestroy() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
    this.titleService.setTitle("Watcho")
  }

  getNoOfSeasonInSeries(seriesId: string) {
    this.kalturaAppService.getNoOfSeasonInSeries(seriesId, this.DMS.params.MediaTypes.UGCVideo, true).then(response => {
      this.totalCount = response.totalCount;
      this.moreVideoRailData = response;
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

  isInWatchlist(event) {
    this.isAssetInWatchlist = event;
  }
  gtmTagEventOnDetailPage(assetDetails) {
    let dataLayerJson: any;
    let userDetails: any;
    let utmParams: any;
    if (JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS))) {
      userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
    }
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      utmParams = params;
    });
    dataLayerJson = {
      'user_id': userDetails !== undefined ? userDetails.UserID : null,
      'mobile_number': userDetails !== undefined ? userDetails.MobileNo : null,
      'email': userDetails !== undefined ? userDetails.EmailID : null,
      'name': userDetails !== undefined ? userDetails.Name : null,
      'utm_source': utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
      'utm_medium': utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
      'utm_campaign': utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
      'page_location': 'ugc_videos_page',
      'asset_id': assetDetails.id,
      'asset_title': assetDetails.name,
      'asset_genre': assetDetails.tags.Genre ? assetDetails.tags.Genre.objects[0].value : null,
      'asset_subgenre': assetDetails.tags['Sub Genre'] ? assetDetails.tags['Sub Genre'].objects[0].value : null,
      'asset_mediatype': 'UGCVideo',
      'asset_cast': assetDetails.tags['Main Cast'] ? assetDetails.tags['Main Cast'].objects[0].value : null,
      'asset_crew': assetDetails.tags.Director ? assetDetails.tags.Director.objects[0].value : null,
      'asset_parental_rating': assetDetails.tags['Parental Rating'] ? assetDetails.tags['Parental Rating'].objects[0].value : null,
      'asset_episode_number': assetDetails.metas['Episode number'] ? assetDetails.metas['Episode number'].value : null,
      'asset_series_name': assetDetails.tags['Series Name'] ? assetDetails.tags['Series Name'].objects[0].value : null,
      'asset_duration': assetDetails.mediaFiles[0] ? assetDetails.mediaFiles[0].duration : null,
      'asset_creator_name': assetDetails.tags['Series Name'] ? assetDetails.tags['Series Name'].objects[0].value : null,
      'asset_language': assetDetails.tags['Asset Language'] ? assetDetails.tags['Asset Language'].objects[0].value : null

    };
    this.appUtilService.getGTMTag(dataLayerJson, 'detail_page');
  }
}
