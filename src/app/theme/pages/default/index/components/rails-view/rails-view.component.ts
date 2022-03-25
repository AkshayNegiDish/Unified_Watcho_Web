import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { RailViewType } from '../../../../../shared/models/rail.model';
import { TopCarouselItem } from '../../../../../shared/models/top-carousel.model';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { RailConfigService } from '../../../../../shared/services/rail-config.service';
import { AppConstants, AppPages, PlaceholderImage } from '../../../../../shared/typings/common-constants';
import { AssetList, OTTCategory } from '../../../../../shared/typings/kaltura-response-typings';
import { AjaxResultRails, PlaylistDetails, RailResponse, RecomendedDetail, RecomendedDetails, Recommended, ScreenConfig } from '../../models/home';
import { EnveuAppService } from '../../../../../shared/services/enveu-app.service';
import { environment } from '../../../../../../../environments/environment';
import { LayoutConfig } from '../../../../../shared/typings/enveu-responce-typing';
import { WidgetType, LayoutType, ImageSource, RailType, RailConstant } from '../../../../../shared/typings/enveu-constants';
import { UserFormService } from '../../../user-management/services/user-form.service';


@Component({
  selector: 'app-rails-view',
  templateUrl: './rails-view.component.html',
  styleUrls: ['./rails-view.component.scss']
})
export class RailsViewComponent implements OnInit, AfterViewInit {

  @Input()
  screenId: string;

  @Input()
  hideTopCarousel: false;

  @Input()
  fromDetailScreen: boolean = false;

  isBrowser;

  topCarouselItems: TopCarouselItem[] = [];
  railViewType = RailViewType;
  railResponse: RailResponse[];
  ajaxResultRails: AjaxResultRails[] = [];

  carouselData: AssetList;

  categoryDetails: OTTCategory;
  assetList: AssetList[] = [];

  placedFrom: AppPages;
  loading: boolean;

  WIDE_SCREEN_PORTRAIT = RailViewType[RailViewType.WIDE_SCREEN_PORTRAIT].toString();
  CIRCLE = RailViewType[RailViewType.CIRCLE].toString();
  SQUARE = RailViewType[RailViewType.SQUARE].toString();
  WIDE_SCREEN_LANDSCAPE = RailViewType[RailViewType.WIDE_SCREEN_LANDSCAPE].toString();

  kalturaClient: any;
  resomendedDetail: RecomendedDetails;
  recomendedFlag = Recommended[Recommended.RECOMMENDED]
  // kalturaAppService: KalturaAppService;

  slides = [
    { img: 'http://placehold.it/350x150/000000' },
    { img: 'http://placehold.it/350x150/111111' },
    { img: 'http://placehold.it/350x150/333333' },
    { img: 'http://placehold.it/350x150/666666' }
  ];
  getConfig: any;
  navScreenId: any;

  screenConfig: ScreenConfig;
  playlistDetails: PlaylistDetails;
  railItem: string[];
  page: number;
  config: any;
  cloudfrontUrl: any;
  imageProperties: any;
  isMobileTabletView: Boolean;
  pageIndex: number;
  pageSize: number;
  loadMoreRailsFlag: number;
  loading2: boolean = true;
  firstLoad: boolean = false;
  DMS: any;
  LayoutType = LayoutType;
  screenLayout: LayoutConfig[] = [];
  noResultPicture: string = PlaceholderImage.NO_RESULT;
  showNoResultFound: boolean = false;
  isSubscriptionEndData: boolean = false;


  constructor(@Inject(PLATFORM_ID) private platformId, private router: Router, private userFormService: UserFormService,
    private kalturaAppService: KalturaAppService, public kalturaUtilService: KalturaUtilService,
    public railConfigService: RailConfigService, private appUtilService: AppUtilService, private enveuAppService: EnveuAppService) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      // detect mobile and render mobile side bar
      if (matchMedia('(min-width: 769px)').matches && matchMedia('(max-width: 991px)').matches) {
        this.isMobileTabletView = true;
      }
    }
    this.loading = true;
    this.railResponse = [];
    this.page = 10;
    this.pageIndex = 1;
    this.pageSize = 20;
    this.resomendedDetail = {
      recomendedDetails: []
    }
    if (this.isMobileTabletView) {
      this.loadMoreRailsFlag = this.appUtilService.checkIfPWA() ? 10 : 8;
    } else {
      this.loadMoreRailsFlag = this.appUtilService.checkIfPWA() ? 10 : 8;
    }
    if (this.isBrowser) {
      this.DMS = localStorage.getItem(AppConstants.DMS_KEY);
      if (!this.DMS) {
        this.DMS = null;
      }
      this.DMS = JSON.parse(this.DMS);
    }
  }


  ngAfterViewInit() {

  }

  ngOnInit() {
    this.placedFrom = this.appUtilService.getPageNameById(this.screenId);
    // this.kalturaGetOTTCategory(this.screenId);
    // if (this.appUtilService.isUserLoggedIn()) {
    //   this.recomendedFound();
    // }
    if (this.isBrowser) {
      setTimeout(() => {
        this.loadMoreRailsFlag = this.loadMoreRailsFlag + 2;
      }, 10000)
      if (this.appUtilService.isUserLoggedIn()) {
        this.getSubscriptionHistory();
      } else {
        this.getScreenConfig(this.screenId);
      }
    }
  }
  getScreenConfig(screenId: string) {
    this.loading = true;
    this.firstLoad = true;
    this.enveuAppService.getLayoutByScreenId(screenId).then((res: any) => {
      if (res.responseCode === 2000) {
        if (res.data.widgets.length > 0) {
          var widgets = res.data.widgets.sort((a, b) => {
            return a.displayOrder - b.displayOrder
          });
          widgets.forEach((element: any) => {
            let rails = new LayoutConfig();
            if (element.type === WidgetType[WidgetType.CNT].toString()) {
              if (element.layout === LayoutType[LayoutType.HRO]) {
                rails.id = element.id ? element.id : null;
                rails.name = element.name ? element.name : null;
                rails.channelType = this.appUtilService.getHeroImageType(element.item.imageType);
                rails.moreListingLayout = element.item.listingLayout;
                rails.channelViewType = element.layout;
                rails.layout = element.layout;
                if (element.item.imageSource === ImageSource[ImageSource.MNL]) {
                  rails.thumbnailUrl = element.item.imageURL;
                } else {
                  rails.heroAssetId = element.item.assetId;
                }
                rails.imageSource = element.item.imageSource;
                rails.landingPage = element.item.landingPage;
                rails.assetType = element.item.assetType;
                rails.imageType = this.railConfigService.getEnveuRailViewType(element.item.imageType);
                rails.carouselDots = element.item.contentIndicator ? element.item.contentIndicator : null;
                rails.isProgram = element.item.isProgram ? element.item.isProgram : false;
              } else if (element.item.playlist.type === RailType[RailType.K_PDF].toString()) {
                if (this.appUtilService.isUserLoggedIn() && element.item.playlist.forLoggedInUser) {
                  if (element.item.playlist.predefPlaylistType === RailConstant[RailConstant.MY_W].toString() && element.item.title.indexOf('_BYW_') < 0 && element.item.title.indexOf('_RFY') < 0) {
                    // For My Watchlist
                    rails.id = element.id;
                    rails.isWatchListRail = true;
                    rails.imageType = this.railConfigService.getEnveuRailViewType(element.item.imageType);
                    rails.pageSize = element.item.pageSize;
                    rails.showHeader = element.item.showHeader;
                    if (rails.showHeader) {
                      rails.showMoreButton = element.item.showMoreButton;
                    }
                  } else if (element.item.playlist.predefPlaylistType === RailConstant[RailConstant.CON_W].toString() && element.item.title.indexOf('_BYW_') < 0  && element.item.title.indexOf('_RFY') < 0) {
                    // For continue Watching
                    rails.id = element.id;
                    rails.isContinueWatching = true;
                    rails.imageType = this.railConfigService.getEnveuRailViewType(element.item.imageType);
                    rails.pageSize = element.item.pageSize;
                    rails.showHeader = element.item.showHeader;
                    if (rails.showHeader) {
                      rails.showMoreButton = element.item.showMoreButton;
                    }
                  } else if (element.item.playlist.predefPlaylistType === RailConstant[RailConstant.MY_W].toString() && element.item.title.indexOf('_BYW_') > 0) {
                    rails.id = element.id;
                    rails.isBecauseYouWatchedRail = true;
                    rails.name = element.item.title;
                    rails.imageType = this.railConfigService.getEnveuRailViewType(element.item.imageType);
                    rails.pageSize = element.item.pageSize;
                    rails.showHeader = element.item.showHeader;
                    if (rails.showHeader) {
                      rails.showMoreButton = element.item.showMoreButton;
                    }
                  } else if (element.item.playlist.predefPlaylistType === RailConstant[RailConstant.MY_W].toString() && element.item.title.indexOf('_RFY') > 0) {
                    rails.id = element.id;
                    rails.isRecommendedForYouRail = true;
                    rails.name = element.item.title;
                    rails.imageType = this.railConfigService.getEnveuRailViewType(element.item.imageType);
                    rails.pageSize = element.item.pageSize;
                    rails.showHeader = element.item.showHeader;
                  }
                }
              } else {
                rails.moreViewConfig = {
                  filters: false,
                  id: null,
                  sortable: false
                }
                rails.id = element.item.playlist.kalturaChannelId;
                rails.name = element.item.title;
                rails.layout = element.layout;
                rails.imageType = this.railConfigService.getEnveuRailViewType(element.item.imageType);
                rails.carouselDots = element.item.contentIndicator;
                rails.listingLayout = element.item.listingLayout;
                rails.moreViewConfig.filters = element.item.moreViewConfig ? element.item.moreViewConfig.filters.length > 0 ? true : false : false;
                rails.moreViewConfig.sortable = element.item.moreViewConfig ? element.item.moreViewConfig.sortable : false;
                rails.listingLayoutContentSize = element.item.listingLayoutContentSize ? element.item.listingLayoutContentSize : 20;
                rails.pageSize = element.item.pageSize;
                rails.showHeader = element.item.showHeader;
                if (rails.showHeader) {
                  rails.showMoreButton = element.item.showMoreButton;
                }
              }
            } else if (element.type === WidgetType[WidgetType.ADS].toString()) {
              if (element.layout === LayoutType[LayoutType.BAN]) {
                rails.ADUnitId = this.isSubscriptionEndData ? '' : element.item.adUnitInfo.adId;
                rails.layout = element.layout;
                rails.channelType = element.item.platform;
              }

            }
            if (Object.keys(rails).length > 0) {
              this.screenLayout.push(rails)
            }
            this.firstLoad = false;
            this.loading = false;
          });
        } else {
          if (!this.fromDetailScreen) {
            this.showNoResultFound = true;
          }
        }

        this.firstLoad = false;
        this.loading = false;
      }
      this.firstLoad = false;
      this.loading = false;
    }, error => {
      if (error.responseJSON.responseCode === 4004 && !this.hideTopCarousel) {
        this.showNoResultFound = true;
      }
      this.firstLoad = false;
      this.loading = false;
    })
  }

  openMore(id: number, name: string) {
    this.router.navigate(['/list/' + this.appUtilService.getSEOFriendlyURL(name) + '/k-' + id + '_' + this.screenId]);
  }

  kalturaGetOTTCategory(id: string) {
    this.loading = true;
    this.firstLoad = true;
    this.kalturaAppService.getOTTCategory(id).then((response: OTTCategory) => {
      this.categoryDetails = response;
      this.loading = false;
    }, reject => {
      this.categoryDetails = null;
      this.loading = false;
      console.error(reject);
    });

  }

  watchAsset(name, mediaId, mediaType, mediaTypeId) {
    this.router.navigate(['/watch/' + this.appUtilService.getSEOFriendlyURL(mediaType) + '/' + mediaTypeId + '/' + this.appUtilService.getSEOFriendlyURL(name) + '/' + mediaId]);
  }
  recomendedFound() {

    this.kalturaAppService.getOttUser().then(res => {
      try {
        let content = res.dynamicData.ContentPrefrences.value.split(',');
        if (content.length > 0) {

          for (let i = 0; i < content.length; i++) {
            let recomendedDetail: RecomendedDetail;
            recomendedDetail = {
              channelId: null,
              channelName: null
            }
            recomendedDetail.channelId = this.DMS.params.Genres[content[i]];
            recomendedDetail.channelName = content[i];
            this.resomendedDetail.recomendedDetails.push(recomendedDetail);
          }

        }

      } catch (e) {

      }

    }, reject => {
    });
  }

  onScroll() {
    this.firstLoad = false;
    if (this.loadMoreRailsFlag >= this.screenLayout.length - 1) {
      this.loading2 = false;
      this.firstLoad = false;
    }
    setTimeout(() => {
      this.loading2 = false;
    }, 2000)
    this.loadMoreRailsFlag = this.loadMoreRailsFlag + 5;
  }

  getSubscriptionHistory() {
    if (this.isBrowser) {
      this.userFormService.getSubscriptionHistory(this.appUtilService.getLoggedInUserSMSDetails().OTTSubscriberID).subscribe((res: any) => {
        if (res.ResultCode === 0) {
          if (res.Result.length > 0) {
            for (let result of res.Result) {
              if (result.SubscriptionStatus.toLowerCase() === "active" && result.SubscriptionCategory.toLowerCase() === 'watcho') {
                if (new Date(result.SubscriptionEndDate).getTime() >= new Date().getTime()) {
                  this.isSubscriptionEndData = true;
                  this.getScreenConfig(this.screenId);
                  return;
                }
              }
            }
          }
        }
        this.isSubscriptionEndData = false;
        this.getScreenConfig(this.screenId);
        return;
      }, error => {
        this.isSubscriptionEndData = false;
        this.getScreenConfig(this.screenId);
      });
    }
  }
}