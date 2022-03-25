import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';
import { environment } from '../../../../../environments/environment';
import { AppDownloadComponent } from '../../download-app-modal/app-download.component';
import { SignInSignUpModalComponent } from '../../entry-component/signIn-signUp-modal.component';
import { RailViewType } from '../../models/rail.model';
import { Recommendation, TopCarouselItem } from '../../models/top-carousel.model';
import { AppUtilService } from '../../services/app-util.service';
import { KalturaAppService } from '../../services/kaltura-app.service';
import { KalturaUtilService } from '../../services/kaltura-util.service';
import { PlatformIdentifierService } from '../../services/platform-identifier.service';
import { RailConfigService } from '../../services/rail-config.service';
import { SnackbarUtilService } from '../../services/snackbar-util.service';
import { AppPages } from '../../typings/common-constants';
import { AssetList } from '../../typings/kaltura-response-typings';
import { UgcVideoPopupComponent } from '../../ugc-video-popup/ugc-video-popup.component';
declare var $: any;

@Component({
  selector: 'app-rail-item',
  templateUrl: './rail-item.component.html',
  styleUrls: ['./rail-item.component.scss']
})
export class RailItemComponent implements OnInit {

  @Input()
  channelId?: number;

  @Input()
  viewType?: string = 'LANDSCAPE';

  @Input()
  channelName?: string;

  @Input()
  screenId?: string;

  @Input()
  isCarousel?: boolean;

  @Input()
  hideTitle?: boolean;

  @Input()
  isYouMayAlsoLike?: boolean;

  @Input()
  isSimilarMovie?: boolean;

  @Input()
  showLiveChannel?: boolean = false;

  @Input()
  showSimilarChannel?: boolean = false;

  @Input()
  railData: any;

  @Input()
  seriesId?: any;

  @Input()
  firstLoad: boolean = false;

  @Input()
  showCarouselDots?: string = null;

  @Input()
  showMoreButton?: boolean = false;

  @Input()
  isWatchlist?: boolean = false;

  @Input()
  isBecauseYouWatchedRail?: boolean = false;

  @Input()
  isRecommendedForYouRail?: boolean = false;

  @Input()
  isContinueWatching?: boolean = false;

  @Input()
  listingLayout?: string = null;

  @Input()
  sortable?: boolean = false;

  @Input()
  filters?: boolean = false;

  @Input()
  showHeader?: boolean = false;

  @Input()
  pageSize: number;

  @Input()
  morePageSize: number;

  @Input()
  contestId?: number = null;

  @Input()
  filterType?: string = null;

  @Input()
  isContestRail?: boolean = false;



  railViewType = RailViewType;
  pageIndex: number;
  loading: boolean;
  railIndex: number;
  ImgIndex: number;

  assetList: any = {};

  isMobileTabletView: boolean;

  railConfig: any;
  railViewTypeClass: any;
  slickRailViewTypeClass: any;

  carouselString: string;
  // isCarousel: boolean;

  topCarouselItems: TopCarouselItem[] = [];
  topCarouselItem: TopCarouselItem;
  kalturaAssetHistoryListResponse: any;
  appPagesRespons: AppPages;

  DMS: any;
  liveNow: boolean = false;

  totalCount: number = 0;
  assetListObjects: any;
  channelAssetDetails: any;
  showAllButton: boolean = true;
  contentPrefences: any;
  content: string[];
  isTabletView: boolean;
  myDate: number;
  bannerSeries: boolean;
  isDesktop: boolean = true;
  checkImage: boolean = false;
  KalturaPersonalListListResponse: any;
  KalturaPersonalListListResponseArray: any[] = [];
  kalturaAssetListResponse: any;
  bywName: string = '';
  bywIndex: number = 0;
  isBecauseYouWatched: boolean = false;
  bywAssetId: string = null;
  rfyAssetId: any[] = [];
  rfyAssetList: any[] = [];
  assetListRFY: any[] = [];

  constructor(private kalturaUtilService: KalturaUtilService, public appUtilService: AppUtilService,
    private kalturaAppService: KalturaAppService, private snackbarUtilService: SnackbarUtilService,
    private renderer: Renderer2, private railConfigService: RailConfigService, private router: Router,
    private platformIdentifierService: PlatformIdentifierService, private signInSignUpModalComponent: SignInSignUpModalComponent, private modalService: NgbModal) {
    this.pageIndex = 1;
    this.loading = true;
    this.carouselString = this.railViewType[this.railViewType.CAROUSEL].toString();
    this.kalturaAssetHistoryListResponse = null;
    this.bannerSeries = false;
  }

  ngOnInit() {
    this.DMS = this.appUtilService.getDmsConfig();
    if (this.isSimilarMovie) {
      this.showAllButton = false;
    }
    if (this.isYouMayAlsoLike) {
      this.showAllButton = true;
    }
    if (this.channelName && this.channelName.indexOf('_BYW_') > 0 &&  this.isBecauseYouWatchedRail) {
      let bywArray = this.channelName.split('_');
      if (bywArray[1] === Recommendation[Recommendation.BYW]) {
        this.screenId = bywArray[1];
        this.isBecauseYouWatched = true;
        this.bywName = bywArray[0];
        this.bywIndex = +bywArray[2];
      }
    } else {
      this.isBecauseYouWatched = false;
    }
    if (this.channelName && this.channelName.indexOf('_RFY') > 0 && this.isRecommendedForYouRail) {
      let bywArray = this.channelName.split('_');
      if (bywArray[1] === Recommendation[Recommendation.RFY]) {
        this.screenId = bywArray[1];
        this.channelName = "Recommended For You";
      }
    }
    if (matchMedia('(max-width: 768px)').matches) {
      this.isDesktop = false;
      this.isMobileTabletView = true;
      this.railViewTypeClass = this.railConfigService.getRailTypeCssClass(this.viewType, this.isMobileTabletView);
      this.slickRailViewTypeClass = 'slick-' + this.railViewTypeClass + ' col-lg-12 rail-data-container';
    } else {
      this.slickRailViewTypeClass = '';
    }
    if (this.channelId) {
      this.railConfig = this.railConfigService.getViewTypeConfig(this.viewType, this.isMobileTabletView);
      this.railViewTypeClass = this.railConfigService.getRailTypeCssClass(this.viewType, this.isMobileTabletView);
      // this.slickRailViewTypeClass = 'slick-'+this.railViewTypeClass + ' col-lg-12 rail-data-container';
      if (this.isYouMayAlsoLike) {
        this.channelName = "You may also like";
        this.getYouMayAlsoLike(this.channelId);
      }
      // if (this.isSimilarMovie) {
      //   this.channelName = "Similar Movies";
      //   this.getSimalarMovies(this.channelId);
      // }
      else if (!this.isSimilarMovie && !this.isYouMayAlsoLike && !this.railData && !this.isBecauseYouWatched && !this.isRecommendedForYouRail) {
        if (this.isWatchlist) {
          this.channelName = "My Watchlist"
          this.getUserWatchlist();
        } else if (this.isContinueWatching) {
          this.channelName = "Continue Watching"
          this.getAssetHistory();
        } else {
          this.getChannelAssets();
        }
      }
    }
    if (this.railData) {
      this.railConfig = this.railConfigService.getViewTypeConfig(this.viewType, this.isMobileTabletView);
      this.railViewTypeClass = this.railConfigService.getRailTypeCssClass(this.viewType, this.isMobileTabletView);
      this.hideTitle = false;

      this.assetList = this.railData;
      this.loading = false;
      this.railData.objects.forEach(element => {
        if (element.type.toString() !== this.DMS.params.MediaTypes.UGCVideo) {
          this.channelId = 0;
        }
      });
    }
    if (this.showLiveChannel) {
      this.railConfig = this.railConfigService.getViewTypeConfig(this.viewType, this.isMobileTabletView);
      this.railViewTypeClass = this.railConfigService.getRailTypeCssClass(this.viewType, this.isMobileTabletView);
      this.getLiveNowRail();
    }
    if (this.showSimilarChannel) {
      this.railConfig = this.railConfigService.getViewTypeConfig(this.viewType, this.isMobileTabletView);
      this.railViewTypeClass = this.railConfigService.getRailTypeCssClass(this.viewType, this.isMobileTabletView);
      this.getSimilarChannelList()
    }
    // this.kalturaUtilService.getMediaTypeNameById(557);
    if (matchMedia('(max-width: 992px)').matches) {
      this.isTabletView = true;
      this.isDesktop = false;

    }
    // if (this.platformIdentifierService.isBrowser()) {
    //   setTimeout(() => {
    //     this.firstLoad = false;
    //   }, 2000)
    // }
    if (this.isBecauseYouWatched) {
      this.getAssetHistoryForBecauseYouWatched();
    }
    if (this.isRecommendedForYouRail) {
      this.showMoreButton = false;
      this.getAssetHistoryForRecommendationForYou();
    }
  }

  getChannelAssets() {
    this.loading = true;
    if (this.viewType.toUpperCase() === RailViewType[RailViewType.SERIESBANNER].toString().toUpperCase()) {
      this.pageSize = 1;
      this.bannerSeries = true;
    }
    this.kalturaAppService.getAssetById(this.channelId, this.pageIndex, this.pageSize).then(response => {
      this.loading = false;
      this.firstLoad = false;
      this.assetList = response;
      if (this.viewType.toUpperCase() === RailViewType[RailViewType.SERIESBANNER].toString().toUpperCase()) {
      }
      if (this.isCarousel) {
        this.populateCarousel(response);
      }

    }, reject => {
      this.loading = false;

      this.firstLoad = false;
      this.snackbarUtilService.showError(reject.message);
    });
  }

  closePopover(popover) {
    popover.close();
  }

  populateCarousel(data: AssetList) {
    let preUrl = 'https://images-eus1.ott.kaltura.com/Service.svc/GetImage/p/487/entry_id/';
    if (data.totalCount > 0) {
      data.objects.forEach((element: any, index) => {
        const carouselItem = new TopCarouselItem();
        if (element.mediaFiles) {
          if (element.mediaFiles.length > 0) {
            carouselItem.duration = element.mediaFiles[0].duration;
          }

        }
        if (element.tags.SubtitleLanguage) {
          if (element.tags.SubtitleLanguage.objects.length > 0) {
            carouselItem.audioLanguage = element.tags.SubtitleLanguage.objects[0].value;
          }
        }
        carouselItem.id = element.id;
        carouselItem.title = element.name;
        carouselItem.type = +element.type;
        carouselItem.linearAssetId = element.linearAssetId;
        carouselItem.startDate = element.startDate;
        carouselItem.externalId = element.externalId;
        carouselItem.contentProvider = this.kalturaUtilService.getTagsObjectValue(element.tags['Provider']);
        carouselItem.genre = element.tags.Genre ? element.tags.Genre.objects[0].value.split(",") : element.tags.Genres ? element.tags.Genres.objects[0].value.split(",") : [];
        carouselItem.description = element.description;
        carouselItem.isPremium = element.metas["Is Premium"] ? element.metas["Is Premium"].value : false;
        carouselItem.tags = element.tags;
        this.checkImage = false;
        element.images.forEach((imgElement, index) => {
          // if (!this.checkImage) {
          if (this.appUtilService.checkIfPWA()) {
            if (imgElement.ratio === '16:9' && !this.isDesktop) {
              carouselItem.thumbnailURL = this.kalturaUtilService.transformImage(imgElement.url, 391, 220, 60);
              if ((carouselItem.thumbnailURL.indexOf('entry_id') < 0) && (carouselItem.thumbnailURL.indexOf('placeholder-images') < 0)) {
                carouselItem.thumbnailURL = preUrl + this.kalturaUtilService.transformImage(imgElement.url, 391, 220, 60);
              }
              this.checkImage = true;
            }
            else if (imgElement.ratio === '120:37' && !this.isDesktop) {
              carouselItem.thumbnailURL = this.kalturaUtilService.transformImage(imgElement.url, 391, 220, 60);
              if ((carouselItem.thumbnailURL.indexOf('entry_id') < 0) && (carouselItem.thumbnailURL.indexOf('placeholder-images') < 0)) {
                carouselItem.thumbnailURL = preUrl + this.kalturaUtilService.transformImage(imgElement.url, 391, 220, 60);
              }
              this.checkImage = true;
            }
          }
          else if (imgElement.ratio === '16:9' && !this.isDesktop) {
            carouselItem.thumbnailURL = this.kalturaUtilService.transformImage(imgElement.url, 391, 220, 60);
            if ((carouselItem.thumbnailURL.indexOf('entry_id') < 0) && (carouselItem.thumbnailURL.indexOf('placeholder-images') < 0)) {
              carouselItem.thumbnailURL = preUrl + this.kalturaUtilService.transformImage(imgElement.url, 391, 220, 60);
            }
          }

          // if (this.isMobileTabletView) {
          //   carouselItem.thumbnailURL = this.kalturaUtilService.transformImage(imgElement.url, 391, 220, 60);
          //   if ((carouselItem.thumbnailURL.indexOf('entry_id') < 0) && (carouselItem.thumbnailURL.indexOf('placeholder-images') < 0)) {
          //     carouselItem.thumbnailURL = preUrl + this.kalturaUtilService.transformImage(imgElement.url, 1170, 362, 60);
          //   }
          // } else {
          //   carouselItem.thumbnailURL = this.kalturaUtilService.transformImage(imgElement.url, 1170, 362, 60);
          //   if ((carouselItem.thumbnailURL.indexOf('entry_id') < 0) && (carouselItem.thumbnailURL.indexOf('placeholder-images') < 0)) {
          //     carouselItem.thumbnailURL = preUrl + this.kalturaUtilService.transformImage(imgElement.url, 1170, 362, 60);
          //   }
          // }
          else {
            if (imgElement.ratio === '16:9' && this.isDesktop) {
              carouselItem.thumbnailURL = this.kalturaUtilService.transformImage(imgElement.url, 750, 422, 60);
              if ((carouselItem.thumbnailURL.indexOf('entry_id') < 0) && (carouselItem.thumbnailURL.indexOf('placeholder-images') < 0)) {
                carouselItem.thumbnailURL = preUrl + this.kalturaUtilService.transformImage(imgElement.url, 750, 422, 60);
              }
              this.checkImage = true;
            } else if (imgElement.ratio === '120:37' && this.isDesktop && !this.checkImage) {
              carouselItem.thumbnailURL = this.kalturaUtilService.transformImage(imgElement.url, 750, 422, 60);
              if ((carouselItem.thumbnailURL.indexOf('entry_id') < 0) && (carouselItem.thumbnailURL.indexOf('placeholder-images') < 0)) {
                carouselItem.thumbnailURL = preUrl + this.kalturaUtilService.transformImage(imgElement.url, 1170, 422, 60);
              }
            }
            else if (imgElement.ratio === '16:9' && !this.isDesktop) {
              carouselItem.thumbnailURL = this.kalturaUtilService.transformImage(imgElement.url, 391, 220, 60);
              if ((carouselItem.thumbnailURL.indexOf('entry_id') < 0) && (carouselItem.thumbnailURL.indexOf('placeholder-images') < 0)) {
                carouselItem.thumbnailURL = preUrl + this.kalturaUtilService.transformImage(imgElement.url, 1170, 362, 60);
              }
            } else if (imgElement.ratio === '1:1') {
              carouselItem.logoUrl = this.kalturaUtilService.transformImage(imgElement.url, 100, 100, 50);
              if (carouselItem.logoUrl.indexOf('entry_id') < 0) {
                carouselItem.logoUrl = preUrl + this.kalturaUtilService.transformImage(imgElement.url, 100, 100, 50);
              }
            }
          }
          // }

        });
        if (!carouselItem.thumbnailURL) {
          carouselItem.thumbnailURL = this.appUtilService.getDefaultThumbnail(RailViewType[RailViewType.CAROUSEL].toString());
        }
        if (index === 0) {
          carouselItem.isActive = true;
        } else {
          carouselItem.isActive = false;
        }
        carouselItem.contentId = element.id;
        this.topCarouselItems.push(carouselItem);
      });
    }

  }

  slickInit(e, modal) {
    if (!this.isMobileTabletView) {
      this.renderer.addClass(modal.slides[0].el.nativeElement, "slick-expand-right");
      for (var idx = 1; idx < modal.config.slidesToShow - 1; idx++) {
        if (idx < modal.slides.length) {
          this.renderer.addClass(modal.slides[idx].el.nativeElement, "slick-expand");
        } else break;
      }
    }
  }

  slickAfterChange(e, modal) {

    if (!this.isMobileTabletView) {
      // required to calculate correct slide class
      var isFirst = true;
      modal.slides.forEach((element, idx, arr) => {
        var slickActive: boolean = idx >= Math.min(e.currentSlide, modal.slides.length - Math.floor(modal.config.slidesToShow)) && idx < (e.currentSlide) + Math.floor(modal.config.slidesToShow);
        if (slickActive) {
          this.renderer.addClass(element.el.nativeElement, "slick-active");

          this.renderer.setAttribute(element.el.nativeElement, 'tabindex', '0');

          if (isFirst) {  // if first slide is active, add class expand-right
            this.renderer.addClass(element.el.nativeElement, "slick-expand-right");
          } else if (idx === arr.length - 1) {  // if last slide is active add class expand-left
            this.renderer.addClass(element.el.nativeElement, "slick-expand-left");
          } else {
            this.renderer.addClass(element.el.nativeElement, "slick-expand");
          }

          isFirst = false;

        } else {
          this.renderer.removeClass(element.el.nativeElement, "slick-active");
          this.renderer.removeClass(element.el.nativeElement, "slick-expand-right");
          this.renderer.removeClass(element.el.nativeElement, "slick-expand-left");
          this.renderer.removeClass(element.el.nativeElement, "slick-expand");
          this.renderer.setAttribute(element.el.nativeElement, 'tabindex', '-1');
        }

      });
    }
  }

  openMore(channelId: number, channelName: string, e: any) {
    $(".rail-title").each((i, ele) => {
      if (ele.innerText === e.target.innerText) {
        this.railIndex = i + 1
      }
    })
    if (this.showAllButton) {
      if (this.screenId && channelId) {
        if (this.isContinueWatching) {
          this.router.navigate(['/list/' + this.appUtilService.getSEOFriendlyURL(channelName) + '/k-' + channelId + '_' + 'continueWatching'], { queryParams: { "name": channelName, "viewType": this.viewType, "listingLayout": this.listingLayout, "filter": this.filters, "sortable": this.sortable, "pageSize": this.morePageSize } });
        } else if (this.isYouMayAlsoLike) {
          this.router.navigate(['/list/' + this.appUtilService.getSEOFriendlyURL(channelName) + '/k-' + channelId + '_' + 'youMayAlsoLike'], { queryParams: { "name": channelName, "viewType": this.viewType, "listingLayout": this.listingLayout, "filter": this.filters, "sortable": this.sortable, "pageSize": this.morePageSize } });
        } else if (this.isBecauseYouWatched && this,this.screenId === Recommendation[Recommendation.BYW]) {
          this.router.navigate(['/list/' + this.appUtilService.getSEOFriendlyURL(channelName) + '/k-' + this.bywAssetId + '_' + this.screenId], { queryParams: { "name": channelName, "viewType": this.viewType, "listingLayout": this.listingLayout, "filter": this.filters, "sortable": this.sortable, "pageSize": this.morePageSize } });
        } else {
          this.router.navigate(['/list/' + this.appUtilService.getSEOFriendlyURL(channelName) + '/k-' + channelId + '_' + this.screenId], { queryParams: { "name": channelName, "viewType": this.viewType, "listingLayout": this.listingLayout, "filter": this.filters, "sortable": this.sortable, "pageSize": this.morePageSize } });
        }
      } else if (this.screenId === "live" || this.screenId === "similarChannel") {
        this.router.navigate(['/list/' + this.appUtilService.getSEOFriendlyURL(channelName) + '/k-_' + this.screenId], { queryParams: { "name": channelName, "viewType": this.viewType, "listingLayout": this.listingLayout, "filter": this.filters, "sortable": this.sortable, "pageSize": this.morePageSize } });
      } else if (this.screenId === "webEpisodes") {
        this.router.navigate(['/list/' + this.appUtilService.getSEOFriendlyURL(channelName) + '/k-' + this.seriesId + '_' + this.screenId], { queryParams: { "name": channelName, "viewType": this.viewType, "listingLayout": this.listingLayout, "filter": this.filters, "sortable": this.sortable, "pageSize": this.morePageSize } });
      } else if (this.screenId === "spotlightEpisodes") {
        this.router.navigate(['/list/' + this.appUtilService.getSEOFriendlyURL(channelName) + '/k-' + this.seriesId + '_' + this.screenId], { queryParams: { "name": channelName, "viewType": this.viewType, "listingLayout": this.listingLayout, "filter": this.filters, "sortable": this.sortable, "pageSize": this.morePageSize } });
      } else if (this.screenId === "spotlightSeries") {
        this.router.navigate(['/list/' + this.appUtilService.getSEOFriendlyURL(channelName) + '/k-' + this.seriesId + '_' + this.screenId], { queryParams: { "name": channelName, "viewType": this.viewType, "listingLayout": this.listingLayout, "filter": this.filters, "sortable": this.sortable, "pageSize": this.morePageSize } });
      } else if (this.isContestRail) {
        this.router.navigate(['/list/' + this.appUtilService.getSEOFriendlyURL(channelName) + '/k-'], { queryParams: { "name": channelName, "contestId": this.contestId, "filterType": this.filterType, "isContest": "true" } });
      }  else if ((this.screenId === "creator" || this.screenId === "ugcVideo") && this.seriesId) {
        this.router.navigate(['/list/' + this.appUtilService.getSEOFriendlyURL(channelName) + '/k-' + this.seriesId + '_' + this.assetList.objects[0].type], { queryParams: { "name": channelName, "viewType": this.viewType, "listingLayout": this.listingLayout, "filter": this.filters, "sortable": this.sortable, "pageSize": this.morePageSize } });
      } else {
        this.router.navigate(['/list/' + this.appUtilService.getSEOFriendlyURL(channelName) + '/k-' + channelId + '_' + this.assetList.objects[0].type], { queryParams: { "name": channelName, "viewType": this.viewType, "listingLayout": this.listingLayout, "filter": this.filters, "sortable": this.sortable, "pageSize": this.morePageSize } });
      }
    }
    this.railExpandedMoEngageEvent(this.railIndex);
  }

  watchAsset(name, mediaId, mediaType, mediaTypeId, type, externalId, startTime: number, channelId: string, assetType: string, index?: number) {
    if (this.isDesktop) {
      if ((type.toString() === this.DMS.params.MediaTypes.Linear) && (mediaId === 804674 || mediaId === 804672 || mediaId === 804663 || mediaId === 804677)) {
        return this.blockedLinearChannel();
      }
      if (type.toString() === this.DMS.params.MediaTypes.Program && channelId === undefined) {
        return this.blockedLinearChannel();
      }

      if (type == this.DMS.params.MediaTypes.UGCVideo) {
        const modalRef = this.modalService.open(UgcVideoPopupComponent);
        modalRef.componentInstance.ugcVideoChange.next(this.assetList.objects);
        modalRef.componentInstance.index = index;
        modalRef.componentInstance.fromRails = true;
        modalRef.componentInstance.totalVideos = this.assetList.objects.length;
        return;
      }
    }
    if (this.platformIdentifierService.isBrowser()) {
      let position = 0;
      if (this.kalturaAssetHistoryListResponse) {
        position = this.getContinueWatchingPosition(mediaId)
      }



      this.appUtilService.getAssetRouteUrl(name, mediaId, mediaType, mediaTypeId, type, externalId, startTime, channelId).subscribe((res: any) => {
        if (res.url) {
          if (type.toString() === this.DMS.params.MediaTypes.UGCIFPImage) {
            if (this.isMobileTabletView || this.isTabletView) {
              this.downloadInAppModal();
            }
            else {
              this.router.navigate([res.url]);
            }
          } else {
            if (position > 0) {
              this.router.navigate([res.url], { queryParams: { position: position } });
            } else {
              this.router.navigate([res.url]);
            }
          }

        } else {
          if (this.isMobileTabletView) {
            this.downloadInAppModal();
          } else {
            const modalRef = this.modalService.open(SignInSignUpModalComponent);
            this.appUtilService.pausePlayer();
            modalRef.result.then((data) => {
              this.appUtilService.playPlayer();
            }, (reason) => {
              this.appUtilService.playPlayer();
            });
          }
        }
      });
    }

  }

  getAssetHistory() { // continue watching rail
    if (!this.appUtilService.isUserLoggedIn()) {
      this.loading = false;
      this.firstLoad = false;
      return;
    }
    this.loading = true;
    let daysLessThanOrEqual: number = 30;
    let statusEqual: string = "all";
    let pageSize: number = 50;
    let pageIndex: number = 1;
    this.kalturaAppService.getAssetHistory(daysLessThanOrEqual, statusEqual, pageSize, pageIndex).then(response => {
      this.kalturaAssetHistoryListResponse = response;
      let assetIds: string = '';
      this.loading = false;
      this.firstLoad = false;
      response.objects.forEach((element, index) => {
        if (element.position !== 0 && !element.finishedWatching) {
          assetIds += element.assetId + ',';
        }
      });
      assetIds = assetIds.substr(0, assetIds.length - 1);
      this.searchAsset(assetIds);
    }, reject => {
      this.loading = false;

      this.firstLoad = false;
    });
  }

  getAssetHistoryForBecauseYouWatched() { // because you watched rail
    if (!this.appUtilService.isUserLoggedIn()) {
      this.loading = false;
      return;
    }
    this.loading = true;
    let daysLessThanOrEqual: number = 30;
    let statusEqual: string = "all";
    let pageSize: number = 50;
    let pageIndex: number = 1;
    let typeIn: string = this.DMS.params.MediaTypes.ShortFilm + ',' + this.DMS.params.MediaTypes.Movie + ',' + this.DMS.params.MediaTypes.SpotlightEpisode + ',' + this.DMS.params.MediaTypes.WebEpisode;
    this.kalturaAppService.getAssetHistoryForBecauseYouWatched(daysLessThanOrEqual, statusEqual, typeIn, pageSize, pageIndex).then(response => {
      if (response.totalCount > 0) {
        response.objects.forEach((element, index) => {
          if (index === this.bywIndex - 1) {
            this.getAssetDetails(element.assetId.toString());
          } else {
            this.loading = false;
          }
        });
      } else {
        this.loading = false;
      }
    }, reject => {
      this.loading = false;
    });
  }

  getAssetHistoryForRecommendationForYou() { // recommended for you rail
    if (!this.appUtilService.isUserLoggedIn()) {
      this.loading = false;
      return;
    }
    this.loading = true;
    let daysLessThanOrEqual: number = 30;
    let statusEqual: string = "all";
    let pageSize: number = 50;
    let pageIndex: number = 1;
    let typeIn: string = this.DMS.params.MediaTypes.ShortFilm + ',' + this.DMS.params.MediaTypes.Movie + ',' + this.DMS.params.MediaTypes.SpotlightEpisode + ',' + this.DMS.params.MediaTypes.WebEpisode;
    this.kalturaAppService.getAssetHistoryForRecommendationForYou(daysLessThanOrEqual, statusEqual, typeIn, pageSize, pageIndex).then(response => {
      if (response.totalCount > 0) {
        response.objects.forEach((element, index) => {
          if (index < 4) {
            this.rfyAssetId.push(element.assetId);
          } else {
            this.loading = false;
          }
        });
        this.getAssetDetailsForRecommendationForYou(this.rfyAssetId);
      } else {
        this.loading = false;
      }
    }, reject => {
      this.loading = false;
    });
  }

  getAssetDetails(assetId: string) {
    this.kalturaAppService.getMediaAssetById(assetId).then((res: any) => {
      if (res) {
        if (this.appUtilService.getMediaTypeNameById(res.type) === 'Spotlight Episode') {
          this.kalturaAppService.getSeriesDetailFromEpisode(res.tags.SeriesId.objects[0].value, this.DMS.params.MediaTypes.SpotlightSeries, 1, 1).then(res1 => {
            if (res1.totalCount > 0) {
              this.bywAssetId = res1.objects[0].id;
              this.channelName = this.bywName + ' ' + res1.objects[0].name;
              this.getBecauseYouWatchedRails(res1.objects[0].id);
            } else {
              this.loading = false;
            }
          }, reject => {
            this.loading = false;
          });
        } else if (this.appUtilService.getMediaTypeNameById(res.type) === 'Web Episode') {
          this.kalturaAppService.getSeriesDetailFromEpisode(res.tags.SeriesId.objects[0].value, this.DMS.params.MediaTypes.WebSeries, 1, 1).then(res2 => {
            if (res2.totalCount > 0) {
              this.bywAssetId = res2.objects[0].id;
              this.channelName = this.bywName + ' ' + res2.objects[0].name;
              this.getBecauseYouWatchedRails(res2.objects[0].id);
            } else {
              this.loading = false;
            }
          }, reject => {
            this.loading = false;
          });
        } else {
          this.bywAssetId = res.id;
          this.channelName = this.bywName + ' ' + res.name;
          this.getBecauseYouWatchedRails(res.id);
        }
      } else {
        this.loading = false;
      }
    }, reject => {
      this.loading = false;
      console.error(reject);
    });
  }

  getAssetDetailsForRecommendationForYou(rfyAssetId: any) {
    rfyAssetId.forEach((element) => {
      this.kalturaAppService.getMediaAssetById(element).then((res: any) => {
        if (res) {
          if (this.appUtilService.getMediaTypeNameById(res.type) === 'Spotlight Episode') {
            this.kalturaAppService.getSeriesDetailFromEpisode(res.tags.SeriesId.objects[0].value, this.DMS.params.MediaTypes.SpotlightSeries, 1, 1).then(res1 => {
              if (res1.totalCount > 0) {
                this.getRecommendationForYouRails(res1.objects[0].id);
              } else {
                this.loading = false;
              }
            }, reject => {
              this.loading = false;
            });
          } else if (this.appUtilService.getMediaTypeNameById(res.type) === 'Web Episode') {
            this.kalturaAppService.getSeriesDetailFromEpisode(res.tags.SeriesId.objects[0].value, this.DMS.params.MediaTypes.WebSeries, 1, 1).then(res2 => {
              if (res2.totalCount > 0) {
                this.getRecommendationForYouRails(res2.objects[0].id);
              } else {
                this.loading = false;
              }
            }, reject => {
              this.loading = false;
            });
          } else {
            this.getRecommendationForYouRails(res.id);
          }
        } else {
          this.loading = false;
        }
      }, reject => {
        this.loading = false;
        console.error(reject);
      });
    });
  }

  searchAsset(assetIds: string) {
    this.loading = true;
    let ksql: string = "media_id:'" + assetIds + "'";
    let pageSize: number = 100;
    let pageIndex: number = 1;
    if (assetIds) {
      this.kalturaAppService.searchAsset(null, null, ksql, pageIndex, pageSize).then(response => {
        this.loading = false;
        this.firstLoad = false;
        this.assetList = response;
        let arr: any[] = [];
        this.kalturaAssetHistoryListResponse.objects.forEach((elementHistory, index) => {
          this.assetList.objects.forEach((element, index) => {
            if (elementHistory.assetId === element.id) {
              if (element.type.toString() !== this.DMS.params.MediaTypes.UGCVideo && element.type.toString() !== this.DMS.params.MediaTypes.Trailer &&
                element.type.toString() !== this.DMS.params.MediaTypes.Clips && element.type.toString() !== this.DMS.params.MediaTypes.Linear) {
                arr.push(element);
              }
            }
          });
        });

        this.assetList.objects = arr;
        this.assetList.totalCount = arr.length;
      }, reject => {
        this.loading = false;

      });
    } else {
      this.loading = false;


    }
  }

  getWatchedDuration(assetId: number): number {
    let duration: number = 0;
    if (this.kalturaAssetHistoryListResponse) {
      try {
        this.kalturaAssetHistoryListResponse.objects.forEach(element => {
          if (element.assetId === assetId) {
            duration = element.position / element.duration * 100;
          }
        });
      } catch (error) {

      }
    }
    return Math.floor(duration);
  }

  getContinueWatchingPosition(assetId: number): number {
    let position: number = 0;
    if (this.kalturaAssetHistoryListResponse) {
      try {
        this.kalturaAssetHistoryListResponse.objects.forEach(element => {
          if (element.assetId === assetId) {
            position = element.position;
          }
        });
      } catch (error) {

      }
    }
    return position;
  }

  getYouMayAlsoLike(assetId) {
    this.loading = true;
    this.kalturaAppService.getMediaAssetById(assetId.toString()).then((res: any) => {
      this.loading = false;
      let asset_type = "and asset_type='" + +res.type + "'";
      let genre = '';
      if (res.tags.Genre) {
        res.tags.Genre.objects.forEach((element, index) => {
          genre += " (or Genre='" + element.value + "')";
        });
      }
      let ksql = "(" + asset_type + genre + ")";
      this.loading = true;
      this.kalturaAppService.getYouMayAlsoLike(res.id, ksql, 1, 20).then(response => {
        this.loading = false;
        this.firstLoad = false;
        this.assetList = response;

      }, reject => {
        this.loading = false;

      });
    }, reject => {
      this.loading = false;

    });
  }

  getSimalarMovies(assetId) {
    this.loading = true;
    this.kalturaAppService.getMediaAssetById(assetId.toString()).then((res: any) => {
      this.loading = false;
      this.firstLoad = false;
      let asset_type = "and asset_type='" + +res.type + "'";
      let ksql = "(" + asset_type + ")";
      this.loading = true;
      this.kalturaAppService.getSimilarMovies(res.id, ksql, 1, 20).then(response => {
        this.loading = false;
        this.firstLoad = false;
        this.assetList = response;


      }, reject => {
        this.loading = false;

      });
    }, reject => {
      this.loading = false;

    });
  }

  getLiveNowRail() {
    this.loading = true;
    this.kalturaAppService.getLiveNowRail(1, 20).then((res: any) => {
      this.liveNow = true;
      this.assetList = res;
      this.loading = false;

      this.firstLoad = false;
    }, reject => {
      this.loading = false;
      this.firstLoad = false;
      console.error("error")

    })
  }

  getSimilarChannelList() {
    this.loading = true;
    this.DMS = this.appUtilService.getDmsConfig('channel_Schedule');
    this.kalturaAppService.getSimilarChannel(1, 20, this.DMS.params.MediaTypes.Linear).then((res: any) => {
      this.assetList = res;
      this.loading = false;

      this.firstLoad = false;
    }, reject => {
      this.loading = false;
      this.firstLoad = false;
      console.error(reject);

    })
  }

  outputEvent(event) {
    if (event) {
      this.snackbarUtilService.showSnackbar('Removed from continue watching');
      this.getAssetHistory();
    }
  }

  getChannelDetails(channelId: number): Promise<any> {

    return new Promise((resolve, value) => {
      let channelName: string = null;
      let ksql = "media_id:'" + channelId + "'";
      this.kalturaAppService.searchAsset(null, null, ksql, 1, 1).then((res: any) => {
        if (res.objects) {
          this.channelAssetDetails = res.objects[0];
          channelName = this.channelAssetDetails.name;
          resolve(channelName)
        }
      }, reject => {
        console.error("error");
        resolve(channelName)
      })
    })

  }

  downloadInAppModal() {
    this.modalService.open(AppDownloadComponent, { size: 'lg' })
  }

  gtmTagOnCarouselClick(topCarouselItem: TopCarouselItem, index: number, name, mediaId, mediaType, mediaTypeId, type, externalId, startTime: number, channelId: string, ) {
    let url: any;
    this.myDate = new Date().getTime();
    this.appUtilService.getAssetRouteUrl(name, mediaId, mediaType, mediaTypeId, type, externalId, startTime, channelId).subscribe((res: any) => {
      url = res.url;
    }
    );
    this.appPagesRespons = this.appUtilService.getPageNameById(this.screenId)
    let dataLayerJson: any;
    let mediatypee = this.appUtilService.getMediaTypeNameById(topCarouselItem.type);
    if (this.appPagesRespons === AppPages.HOME_SCREEN) {
      dataLayerJson = {
        'carousel_id': topCarouselItem.id,
        'carousel_name': topCarouselItem.title,
        'carousel_position': index,
        'click_timestamp': this.myDate,
        'carousel_url': environment.URL + url,
        'carousel_location': this.appPagesRespons,
        'carousel_genre': topCarouselItem.genre,
        'carousel_language': topCarouselItem.audioLanguage

      };
    } else if (this.appPagesRespons === AppPages.PREMIUM) {
      dataLayerJson = {
        'carousel_id': topCarouselItem.id,
        'carousel_name': topCarouselItem.title,
        'carousel_position': index,
        'click_timestamp': this.myDate,
        'carousel_url': environment.URL + url,
        'carousel_location': this.appPagesRespons,
        'carousel_genre': topCarouselItem.genre,
        'carousel_language': topCarouselItem.audioLanguage

      };
    } else if (this.appPagesRespons === AppPages.SPOTLIGHT) {
      dataLayerJson = {
        'carousel_id': topCarouselItem.id,
        'carousel_name': topCarouselItem.title,
        'carousel_position': index,
        'click_timestamp': this.myDate,
        'carousel_url': environment.URL + url,
        'carousel_location': this.appPagesRespons,
        'carousel_genre': topCarouselItem.genre,
        'carousel_language': topCarouselItem.audioLanguage

      };
    } else if (this.appPagesRespons === AppPages.LIVETV) {
      dataLayerJson = {
        'carousel_id': topCarouselItem.id,
        'carousel_name': topCarouselItem.title,
        'carousel_position': index,
        'click_timestamp': this.myDate,
        'carousel_url': environment.URL + url,
        'carousel_location': this.appPagesRespons,
        'carousel_genre': topCarouselItem.genre,
        'carousel_language': topCarouselItem.audioLanguage

      };
    } else if (this.appPagesRespons === AppPages.TRENDING) {
      dataLayerJson = {
        'carousel_id': topCarouselItem.id,
        'carousel_name': topCarouselItem.title,
        'carousel_position': index,
        'click_timestamp': this.myDate,
        'carousel_url': environment.URL + url,
        'carousel_location': this.appPagesRespons,
        'carousel_genre': topCarouselItem.genre,
        'carousel_language': topCarouselItem.audioLanguage

      };
    }
    if (mediatypee === 'Linear') {
      dataLayerJson.channel_name = topCarouselItem.title;
    }
    dataLayerJson.asset_language = topCarouselItem.tags['Asset Language'] ? topCarouselItem.tags['Asset Language'].objects[0].value : null;
    this.appUtilService.getGTMTag(dataLayerJson, 'carousel_click');


  }

  gtmTagOnRailClick(topCarouselItem: any, index: number, name, mediaId, mediaType, mediaTypeId, type, externalId, startTime: number, channelId: string, assetType: string) {
    let url: any;
    let mediatypee = this.appUtilService.getMediaTypeNameById(topCarouselItem.type);
    this.myDate = new Date().getTime();
    this.appUtilService.getAssetRouteUrl(name, mediaId, mediaType, mediaTypeId, type, externalId, startTime, channelId).subscribe((res: any) => {
      url = res.url;
    }
    );
    this.appPagesRespons = this.appUtilService.getPageNameById(this.screenId)
    let dataLayerJson: any;
    if (this.appPagesRespons === AppPages.HOME_SCREEN) {
      dataLayerJson = {
        'rail_id': this.channelId,
        'rail_page_location': AppPages[AppPages.HOME_SCREEN],
        'rail_name': this.channelName,
        'rail_position': index,
        'asset_id': topCarouselItem.id,
        'assite_title': topCarouselItem.name,
        'asset_genre': topCarouselItem.tags.Genre ? topCarouselItem.tags.Genre.objects[0].value : null,
        'asset_mediatype': mediatypee,
        'asset_parental_rating': topCarouselItem.tags['Parental Rating'] ? topCarouselItem.tags['Parental Rating'].objects[0].value : null,
        'asset_series_name': topCarouselItem.tags['Series Name'] ? topCarouselItem.tags['Series Name'].objects[0].value : null,
        'asset_episode_number': topCarouselItem.metas['Episode number'] ? topCarouselItem.metas['Episode number'].value : null,
        'asset_sub_genre': topCarouselItem.tags['Sub Genre'] ? topCarouselItem.tags['Sub Genre'].objects[0].value : null,
        'status': 'successful'
      };
    } else if (this.appPagesRespons === AppPages.PREMIUM) {
      dataLayerJson = {
        'rail_id': this.channelId,
        'rail_page_location': AppPages[AppPages.PREMIUM],
        'rail_name': this.channelName,
        'rail_position': index,
        'asset_id': topCarouselItem.id,
        'assite_title': topCarouselItem.name,
        'asset_genre': topCarouselItem.tags.Genre ? topCarouselItem.tags.Genre.objects[0].value : null,
        'asset_mediatype': mediatypee,
        'asset_parental_rating': topCarouselItem.tags['Parental Rating'] ? topCarouselItem.tags['Parental Rating'].objects[0].value : null,
        'asset_series_name': topCarouselItem.tags['Series Name'] ? topCarouselItem.tags['Series Name'].objects[0].value : null,
        'asset_episode_number': topCarouselItem.metas['Episode number'] ? topCarouselItem.metas['Episode number'].value : null,
        'asset_sub_genre': topCarouselItem.tags['Sub Genre'] ? topCarouselItem.tags['Sub Genre'].objects[0].value : null,
        'status': 'successful'
      };
    } else if (this.appPagesRespons === AppPages.SPOTLIGHT) {
      dataLayerJson = {
        'rail_id': this.channelId,
        'rail_page_location': AppPages[AppPages.SPOTLIGHT],
        'rail_name': this.channelName,
        'rail_position': index,
        'asset_id': topCarouselItem.id,
        'assite_title': topCarouselItem.name,
        'asset_genre': topCarouselItem.tags.Genre ? topCarouselItem.tags.Genre.objects[0].value : null,
        'asset_mediatype': mediatypee,
        'asset_parental_rating': topCarouselItem.tags['Parental Rating'] ? topCarouselItem.tags['Parental Rating'].objects[0].value : null,
        'asset_series_name': topCarouselItem.tags['Series Name'] ? topCarouselItem.tags['Series Name'].objects[0].value : null,
        'asset_episode_number': topCarouselItem.metas['Episode number'] ? topCarouselItem.metas['Episode number'].value : null,
        'asset_sub_genre': topCarouselItem.tags['Sub Genre'] ? topCarouselItem.tags['Sub Genre'].objects[0].value : null,
        'status': 'successful'
      };
    } else if (this.appPagesRespons === AppPages.LIVETV) {
      dataLayerJson = {
        'rail_id': this.channelId,
        'rail_page_location': AppPages[AppPages.LIVETV],
        'rail_name': this.channelName,
        'rail_position': index,
        'asset_id': topCarouselItem.id,
        'assite_title': topCarouselItem.name,
        'asset_genre': topCarouselItem.tags.Genre ? topCarouselItem.tags.Genre.objects[0].value : null,
        'asset_mediatype': mediatypee,
        'asset_parental_rating': topCarouselItem.tags['Parental Rating'] ? topCarouselItem.tags['Parental Rating'].objects[0].value : null,
        'asset_series_name': topCarouselItem.tags['Series Name'] ? topCarouselItem.tags['Series Name'].objects[0].value : null,
        'asset_episode_number': topCarouselItem.metas['Episode number'] ? topCarouselItem.metas['Episode number'].value : null,
        'asset_sub_genre': topCarouselItem.tags['Sub Genre'] ? topCarouselItem.tags['Sub Genre'].objects[0].value : null,
        'status': 'successful'
      };
    } else if (this.appPagesRespons === AppPages.TRENDING) {
      dataLayerJson = {
        'rail_id': this.channelId,
        'rail_page_location': AppPages[AppPages.TRENDING],
        'rail_name': this.channelName,
        'rail_position': index,
        'asset_id': topCarouselItem.id,
        'assite_title': topCarouselItem.name,
        'asset_genre': topCarouselItem.tags.Genre ? topCarouselItem.tags.Genre.objects[0].value : null,
        'asset_mediatype': mediatypee,
        'asset_parental_rating': topCarouselItem.tags['Parental Rating'] ? topCarouselItem.tags['Parental Rating'].objects[0].value : null,
        'asset_series_name': topCarouselItem.tags['Series Name'] ? topCarouselItem.tags['Series Name'].objects[0].value : null,
        'asset_episode_number': topCarouselItem.metas['Episode number'] ? topCarouselItem.metas['Episode number'].value : null,
        'asset_sub_genre': topCarouselItem.tags['Sub Genre'] ? topCarouselItem.tags['Sub Genre'].objects[0].value : null,
        'status': 'successful'
      };
    }
    if (mediatypee === 'Linear') {
      dataLayerJson.channel_name = topCarouselItem.name;
    }

    dataLayerJson.asset_language = topCarouselItem.tags['Asset Language'] ? topCarouselItem.tags['Asset Language'].objects[0].value : null;
    this.appUtilService.getGTMTag(dataLayerJson, 'rail_asset_clicked');

  }

  railExpandedMoEngageEvent(railIndex: number) {
    let railExpaned: any;
    if (this.screenId === this.DMS.baseChannels.home) {
      railExpaned = {
        source: 'home_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    } else if (this.screenId === this.DMS.baseChannels.exclusive) {
      railExpaned = {
        source: 'exclusives_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    } else if (this.screenId === this.DMS.baseChannels.spotlight) {
      railExpaned = {
        source: 'spotlight_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    } else if (this.screenId === this.DMS.baseChannels.liveTVDetail) {
      railExpaned = {
        source: 'live_tv_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    } else if (this.screenId === this.DMS.baseChannels.moreTrending) {
      railExpaned = {
        source: 'trending_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    } else if (this.screenId === this.DMS.baseChannels.spotlightSeriesDetail) {
      railExpaned = {
        source: 'spotlight_channel_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    } else if (this.screenId === this.DMS.baseChannels.ugcVideoDetail) {
      railExpaned = {
        source: 'ugc_video_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    } else if (this.screenId === this.DMS.baseChannels.ugcCreatorProfileDetail || this.screenId === 'creator') {
      railExpaned = {
        source: 'ugc_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    } else if (this.screenId === this.DMS.baseChannels.movieDetail) {
      railExpaned = {
        source: 'movie_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    } else if (this.screenId === this.DMS.baseChannels.webSeriesDetail) {
      railExpaned = {
        source: 'series_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    } else if (this.screenId === this.DMS.baseChannels.webEpisodeDetail) {
      railExpaned = {
        source: 'episode_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    } else if (this.screenId === this.DMS.baseChannels.spotlightEpisodeDetail) {
      railExpaned = {
        source: 'episode_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    } else if (this.screenId === this.DMS.baseChannels.shortFilmDetail) {
      railExpaned = {
        source: 'short_film_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    } else if (this.screenId === this.DMS.baseChannels.moreLiveTV) {
      railExpaned = {
        source: 'linear_channel_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    } else if (this.screenId === this.DMS.baseChannels.catchUpDetail) {
      railExpaned = {
        source: 'tv_shows_page',
        rail_name: this.channelName,
        rail_position: railIndex
      }
    }
    this.appUtilService.moEngageEventTracking('RAIL_EXPANDED', railExpaned);
  }

  railAssetClickMoEngageEvent(index: number, assetDetail: any) {
    this.ImgIndex = index;
    let railAsset: any;
    if (this.screenId === this.DMS.baseChannels.home) {
      railAsset = {
        source: 'home_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.type !== 0 ? assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.type !== 0 ? assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null : assetDetail.metas['Series_Name'] ? assetDetail.metas['Series_Name'].value : null,
        asset_episode_number: assetDetail.type !== 0 ? assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null : assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === this.DMS.baseChannels.exclusive) {
      railAsset = {
        source: 'exclusives_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.type !== 0 ? assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.type !== 0 ? assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null : assetDetail.metas['Series_Name'] ? assetDetail.metas['Series_Name'].value : null,
        asset_episode_number: assetDetail.type !== 0 ? assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null : assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === this.DMS.baseChannels.spotlight) {
      railAsset = {
        source: 'spotlight_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.type !== 0 ? assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.type !== 0 ? assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null : assetDetail.metas['Series_Name'] ? assetDetail.metas['Series_Name'].value : null,
        asset_episode_number: assetDetail.type !== 0 ? assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null : assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === this.DMS.baseChannels.liveTVDetail) {
      railAsset = {
        source: 'live_tv_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.type !== 0 ? assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.type !== 0 ? assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null : assetDetail.metas['Series_Name'] ? assetDetail.metas['Series_Name'].value : null,
        asset_episode_number: assetDetail.type !== 0 ? assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null : assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === this.DMS.baseChannels.moreTrending) {
      railAsset = {
        source: 'trending_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.type !== 0 ? assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.type !== 0 ? assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null : assetDetail.metas['Series_Name'] ? assetDetail.metas['Series_Name'].value : null,
        asset_episode_number: assetDetail.type !== 0 ? assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null : assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === this.DMS.baseChannels.spotlightSeriesDetail) {
      railAsset = {
        source: 'spotlight_channel_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.type !== 0 ? assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.name,
        asset_episode_number: assetDetail.type !== 0 ? assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null : assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === this.DMS.baseChannels.ugcVideoDetail) {
      railAsset = {
        source: 'ugc_video_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.type !== 0 ? assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.type !== 0 ? assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null : assetDetail.metas['Series_Name'] ? assetDetail.metas['Series_Name'].value : null,
        asset_episode_number: assetDetail.type !== 0 ? assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null : assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === this.DMS.baseChannels.ugcCreatorProfileDetail || this.screenId === 'creator') {
      railAsset = {
        source: 'ugc_landing_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.type !== 0 ? assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.type !== 0 ? assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null : assetDetail.metas['Series_Name'] ? assetDetail.metas['Series_Name'].value : null,
        asset_episode_number: assetDetail.type !== 0 ? assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null : assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === this.DMS.baseChannels.movieDetail) {
      railAsset = {
        source: 'movie_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.type !== 0 ? assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.type !== 0 ? assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null : assetDetail.metas['Series_Name'] ? assetDetail.metas['Series_Name'].value : null,
        asset_episode_number: assetDetail.type !== 0 ? assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null : assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === this.DMS.baseChannels.webSeriesDetail) {
      railAsset = {
        source: 'series_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.type !== 0 ? assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.name,
        asset_episode_number: assetDetail.type !== 0 ? assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null : assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === this.DMS.baseChannels.webEpisodeDetail) {
      railAsset = {
        source: 'episode_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.type !== 0 ? assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.type !== 0 ? assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null : assetDetail.metas['Series_Name'] ? assetDetail.metas['Series_Name'].value : null,
        asset_episode_number: assetDetail.type !== 0 ? assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null : assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === this.DMS.baseChannels.spotlightEpisodeDetail) {
      railAsset = {
        source: 'episode_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.type !== 0 ? assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.type !== 0 ? assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null : assetDetail.metas['Series_Name'] ? assetDetail.metas['Series_Name'].value : null,
        asset_episode_number: assetDetail.type !== 0 ? assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null : assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === this.DMS.baseChannels.shortFilmDetail) {
      railAsset = {
        source: 'short_film_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.type !== 0 ? assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.type !== 0 ? assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null : assetDetail.metas['Series_Name'] ? assetDetail.metas['Series_Name'].value : null,
        asset_episode_number: assetDetail.type !== 0 ? assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null : assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === this.DMS.baseChannels.moreLiveTV) {
      railAsset = {
        source: 'linear_channel_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.type !== 0 ? assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.type !== 0 ? assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null : assetDetail.metas['Series_Name'] ? assetDetail.metas['Series_Name'].value : null,
        asset_episode_number: assetDetail.type !== 0 ? assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null : assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === this.DMS.baseChannels.catchUpDetail) {
      railAsset = {
        source: 'tv_shows_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.metas['Series_Name'] ? assetDetail.metas['Series_Name'].value : null,
        asset_episode_number: assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    } else if (this.screenId === null) {
      railAsset = {
        source: 'ugc_videos_page',
        rail_name: this.channelName,
        rail_position: this.railIndex,
        image_name: assetDetail.images[0] ? assetDetail.images[0].url : null,
        image_position: this.ImgIndex,
        asset_ID: assetDetail.id,
        asset_title: assetDetail.name,
        asset_genre: assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : null,
        asset_mediatype: assetDetail.type,
        asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: assetDetail.metas['Series_Name'] ? assetDetail.metas['Series_Name'].value : null,
        asset_episode_number: assetDetail.metas['Episode Number'] ? assetDetail.metas['Episode Number'].value : null,
        status: 'redirection_successful'
      }
    }
    this.appUtilService.moEngageEventTracking('RAIL_ASSET_CLICKED', railAsset);
  }

  moEngageTagOnCarouselClick(item: any, index: number, title: string, assetId: number, type: number, genre: string) {
    this.appPagesRespons = this.appUtilService.getPageNameById(this.screenId)
    let attribute: any;
    if (this.appPagesRespons === AppPages.HOME_SCREEN) {
      attribute = {
        'source': 'home_page',
        'image_name': item.thumbnailURL,
        'image_position': index,
        'asset_ID': assetId,
        'asset_title': title,
        'asset_genre': item.genre ? genre : null,
        'asset_mediatype': type,
        'status': 'redirection_successful'

      };
    } else if (this.appPagesRespons === AppPages.PREMIUM) {
      attribute = {
        'source': 'exclusives_landing_page',
        'image_name': item.thumbnailURL,
        'image_position': index,
        'asset_ID': assetId,
        'asset_title': title,
        'asset_genre': item.genre ? genre : null,
        'asset_mediatype': type,
        'status': 'redirection_successful'

      };
    } else if (this.appPagesRespons === AppPages.SPOTLIGHT) {
      attribute = {
        'source': 'spotlight_landing_page',
        'image_name': item.thumbnailURL,
        'image_position': index,
        'asset_ID': assetId,
        'asset_title': title,
        'asset_genre': item.genre ? genre : null,
        'asset_mediatype': type,
        'status': 'redirection_successful'

      };
    } else if (this.appPagesRespons === AppPages.LIVETV) {
      attribute = {
        'source': 'live_tv_landing_page',
        'image_name': item.thumbnailURL,
        'image_position': index,
        'asset_ID': assetId,
        'asset_title': title,
        'asset_genre': item.genre ? genre : null,
        'asset_mediatype': type,
        'status': 'redirection_successful'

      };
    } else if (this.appPagesRespons === AppPages.TRENDING) {
      attribute = {
        'source': 'trending_landing_page',
        'image_name': item.thumbnailURL,
        'image_position': index,
        'asset_ID': assetId,
        'asset_title': title,
        'asset_genre': item.genre ? genre : null,
        'asset_mediatype': type,
        'status': 'redirection_successful'
      };
    }
    this.appUtilService.moEngageEventTracking("CAROUSEL_CLICKED", attribute);
  }

  blockedLinearChannel() {
    this.snackbarUtilService.showSnackbar("Channel Available Only On Watcho App");
  }

  getUserWatchlist() {
    this.loading = true;
    this.assetList.objects = [];
    this.pageSize = 40;
    this.kalturaAppService.getPersonalList(1, this.pageSize, this.pageIndex).then(res => {
      if (res.totalCount > 0) {
        this.KalturaPersonalListListResponse = res;

        this.KalturaPersonalListListResponse.objects.forEach(element => {
          this.KalturaPersonalListListResponseArray.push(element);
        });
      }
      this.kalturaAssetListResponse = null;
      this.loading = false;
      this.firstLoad = false;
      let str = '';
      if (res.totalCount > 0) {
        res.objects.forEach((element, index) => {
          let media_id: string;
          media_id = element.ksql.split('=')[1];
          str += media_id.substr(1, media_id.length - 2) + ',';
        })
        str = str.substr(0, str.length - 1);
        let ksql: string = 'media_id:\'' + str + '\'';
        this.loading = true;
        this.firstLoad = true;
        this.kalturaAppService.searchAsset(null, null, ksql, 1, this.pageSize).then(res2 => {
          this.loading = false;
          this.firstLoad = false;
          this.kalturaAssetListResponse = res2;
          this.kalturaAssetListResponse.objects.forEach((element, index) => {
            this.assetList.objects.push(element);
          });
        }, reject => {
          this.loading = false;
          this.firstLoad = false;
          this.snackbarUtilService.showError(reject.message);
        });
      }
    }, reject => {
      this.loading = false;
      this.firstLoad = false;
      this.snackbarUtilService.showError(reject.message);
    })
  }

  getBecauseYouWatchedRails(assetId) {
    this.kalturaAppService.getBecauseYouWatchedRails(assetId, 1, 20).then(response => {
      this.loading = false;
      this.assetList = response;
    }, reject => {
      this.loading = false;
    });
  }

  getRecommendationForYouRails(assetId) {
    this.kalturaAppService.getRecommendationForYouRails(assetId, 1, 20).then(response => {
      this.loading = false;
      if (response.totalCount > 0) {
        response.objects.forEach((ele, index) => {
          if (index < 5) {
            this.assetListRFY.push(response.objects[index]);
          }
        });
        this.assetList = {
          totalCount: this.assetListRFY.length,
          objects: this.assetListRFY
        }
      }
    }, reject => {
      this.loading = false;
    });
  }
}
