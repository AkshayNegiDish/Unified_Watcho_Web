import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RailViewType } from '../../../../../shared/models/rail.model';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { RailConfigService } from '../../../../../shared/services/rail-config.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { PlaceholderImage } from '../../../../../shared/typings/common-constants';
import { AssetList, AssetListObjects, OTTCategory } from '../../../../../shared/typings/kaltura-response-typings';
import { EnveuAppService } from '../../../../../shared/services/enveu-app.service';
import { ListingLayoutType } from '../../../../../shared/typings/enveu-constants';
import { UgcVideoPopupComponent } from '../../../../../shared/ugc-video-popup/ugc-video-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Recommendation } from '../../../../../shared/models/top-carousel.model';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.scss']
})
export class MoreComponent implements OnInit {

  cardsize: string

  assetId: number
  screenId: string;
  pageSize: number
  pageIndex: number
  allAssetList: AssetList[] = []
  assetList: AssetList
  railViewType: string
  assetListObjects: AssetListObjects[] = []
  totalAssetObjects: number = 0
  pageTitle: string

  categoryDetails: OTTCategory

  showLoader: boolean;
  showDescription: boolean;
  DMS: any;
  hideDetails: boolean = true;
  liveNow: boolean = false;
  railTypeViewClass: string = '';
  kalturaAssetHistoryListResponse: any;
  seriesId: any;
  url: string[];
  channelName: string;
  channelNameArray: string[];
  recommendedFound: boolean = false;
  routerUrl: string;
  contentId: any;
  genres: string[] = []
  shortBy: string;
  noResultFound: boolean = false;
  placeholderImage: any;
  showFilter: boolean = false;
  isMobileTabletView: boolean = false;
  isTabletView: boolean = false;
  isDesktop: boolean = true;
  isBrowser: any;
  isPwa: boolean = false;
  listingLayout: string;
  ListingLayoutType = ListingLayoutType;
  seasonNo: number;
  modalRef: any;
  totalVideo: any;
  isContest: any = null;
  filterType: any = null;
  contestId: any = null;

  constructor(private activatedRoute: ActivatedRoute, private kalturaAppService: KalturaAppService,
    public kalturaUtilService: KalturaUtilService, public railConfigService: RailConfigService, private router: Router,
    private appUtilService: AppUtilService, private modalService: NgbModal, private enveuAppService: EnveuAppService, private titleService: Title, private snackbarUtilService: SnackbarUtilService, @Inject(DOCUMENT) private dom, @Inject(PLATFORM_ID) private platformId) {
    this.cardsize = "col-lg-3"
    this.pageIndex = 1
    this.showLoader = false;
    this.railViewType = RailViewType[RailViewType.LANDSCAPE].toString();
    this.railTypeViewClass = 'parent-' + this.railConfigService.getRailTypeCssClass(this.railViewType);
    this.showDescription = true;
    this.DMS = this.appUtilService.getDmsConfig();
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) {
      this.routerUrl = this.router.url;
      let urls = this.router.url.split('/');
      let channelNameArray: string = urls[2];
      for (let i = 0; i < channelNameArray.length; i++) {
        channelNameArray = decodeURI(channelNameArray);
        if (!channelNameArray.charAt(i).match('[a-z 0-9]')) {
          channelNameArray = channelNameArray.replace(channelNameArray.charAt(i), ' ');
        }
        if (channelNameArray.charAt(i) === '-') {
          channelNameArray = channelNameArray.replace(channelNameArray[i], ' ');
        }
      }
      let urlArray = channelNameArray;
      let resultUrl: string = '';
      for (let i = 0; i < urlArray.length; i++) {
        if (urlArray[i - 1] === ' ') {
          resultUrl = resultUrl + urlArray[i].charAt(0).toUpperCase() + urlArray[i].slice(i + 1);
        } else if (i === 0 && urlArray[i - 1] !== ' ') {
          resultUrl = resultUrl + urlArray[i].charAt(0).toUpperCase();
        } else {
          resultUrl = resultUrl + urlArray[i];
        }
      }
      this.addCononicalSEOTags(resultUrl);

    }
    if (this.appUtilService.checkIfPWA()) {
      this.isPwa = true;
    } else {
      this.isPwa = false;
    }
    this.placeholderImage = PlaceholderImage.NO_RESULT;

    try {
      this.routerUrl = this.router.url
      if (this.routerUrl.indexOf('recommended') > 0) {
        this.recommendedFound = true;
        this.url = this.router.url.split('/');
        this.channelNameArray = this.url[2].split("-");
        this.channelName = this.channelNameArray[0] + '-' + this.channelNameArray[1];
      } else {
        this.recommendedFound = false;
      }

      this.isContest = this.activatedRoute.snapshot.queryParams['isContest'] ? this.activatedRoute.snapshot.queryParams['isContest'] : null;
      this.filterType = this.activatedRoute.snapshot.queryParams['filterType'] ? this.activatedRoute.snapshot.queryParams['filterType'] : null;
      this.contestId = this.activatedRoute.snapshot.queryParams['contestId'] ? this.activatedRoute.snapshot.queryParams['contestId'] : null;


      let contentId = this.activatedRoute.snapshot.params['contentId'];
      contentId.split('-')[1].split('_')[0];
      let listName = this.activatedRoute.snapshot.params['listName'];
      let listNameArray: any = listName.split('-');
      this.seasonNo = +listNameArray[1];
      this.seriesId = contentId.substring(contentId.indexOf('-') + 1, contentId.lastIndexOf('_'));
      this.assetId = Number.parseInt(contentId.split('-')[1].split('_')[0]);
      this.screenId = contentId.substr(contentId.lastIndexOf('_') + 1, contentId.length);
      this.contentId = this.activatedRoute.snapshot.params['contentId'];
      this.pageTitle = this.activatedRoute.snapshot.queryParams['name'];
      this.railViewType = this.activatedRoute.snapshot.queryParams['viewType'] ? this.activatedRoute.snapshot.queryParams['viewType'] : "LANDSCAPE";
      this.listingLayout = this.activatedRoute.snapshot.queryParams['listingLayout'] ? this.activatedRoute.snapshot.queryParams['listingLayout'] : "GRD";
      this.railTypeViewClass = 'parent-' + this.railConfigService.getRailTypeCssClass(this.railViewType);
      if (this.railViewType === RailViewType[RailViewType.CIRCLE].toString()) {
        // this.showDescription === true;
        this.pageSize = this.activatedRoute.snapshot.queryParams['pageSize'] ? +this.activatedRoute.snapshot.queryParams['pageSize'] : 35;
      } else {
        this.pageSize = this.activatedRoute.snapshot.queryParams['pageSize'] ? +this.activatedRoute.snapshot.queryParams['pageSize'] : 30;
      }
      // this.pageSize = 5
      if (this.screenId === this.DMS.params.MediaTypes.UGCCreator) {
        this.activatedRoute.queryParamMap.subscribe((map) => {
          if (map.has('name')) {
            this.channelName = map.get('name');
          }
        });
      }


      this.apiToCall();

    } catch (error) {

    }
    if (matchMedia('(max-width: 768px)').matches) {
      this.isMobileTabletView = true;
      this.isDesktop = false;
    }
    if (matchMedia('(max-width: 992px)').matches) {
      this.isTabletView = true;
      this.isDesktop = false;
    }
  }

  apiToCall(sendVideosToModal?: boolean) {

    if (this.screenId) {
      if (this.kalturaUtilService.isScreen(this.screenId)) {
        this.showFilter = true
        if (this.recommendedFound) {
          this.getAssetDetails(this.seriesId, this.pageIndex, this.pageSize)
        } else {
          this.kalturaGetOTTCategory(this.screenId, sendVideosToModal);
        }
      } else if (this.assetId === 0) {
        if (this.screenId === this.DMS.params.MediaTypes.UGCCreator) {
          this.railViewType = RailViewType[RailViewType.CIRCLE].toString();
          this.railTypeViewClass = 'parent-' + this.railConfigService.getRailTypeCssClass(this.railViewType);
        }
        this.pageTitle = this.channelName;
        this.getSimilarCreator();
      } else if (this.screenId === "live") {
        this.pageTitle = 'Live';
        this.populateLiveNow();
      } else if (this.screenId === "similarChannel") {
        this.pageTitle = 'Similar Channels';
        this.getSimilarChannelList();
      } else if (this.screenId === "continueWatching") {
        this.pageTitle = 'Continue Watching';
        this.pageSize = 50;
        this.getAssetHistory();
      } else if (this.screenId === "webEpisodes") {
        this.getSeasonMore(this.seriesId, this.DMS.params.MediaTypes.WebEpisode);
      } else if (this.screenId === "spotlightEpisodes") {
        this.getSeasonMore(this.seriesId, this.DMS.params.MediaTypes.SpotlightEpisode);
      } else if (this.contentId.indexOf("spotlightSeries") > 0) {
        this.getSeasonMore(this.seriesId, this.DMS.params.MediaTypes.SpotlightEpisode);
      } else if (this.screenId === "youMayAlsoLike") {
        // this.pageSize = 100;
        this.pageTitle = 'You may also like';
        this.getYouMayAlsoLike(this.seriesId);
      } else if (this.isContest === 'true') {
        this.getContestDetailById()
      } else if (this.screenId === this.DMS.params.MediaTypes.UGCVideo) {
        this.getMoreVideosFrom(this.seriesId);
      } else if (this.screenId === Recommendation[Recommendation.BYW]) {
        this.getBecauseYouWatchedRails(this.assetId);
      }
    }
  }
  getContestDetailById() {
    this.kalturaAppService.getRailByContestId(this.contestId, this.DMS.params.MediaTypes.UGCVideo, this.pageIndex, this.pageSize, this.filterType).then((res: any) => {
      if (res.totalCount > 0) {
        this.totalVideo = res.totalCount;
        this.populateRails(res, true);
      }
    })
  }

  kalturaGetOTTCategory(id: string, sendVideosToModal?: boolean) {
    this.titleService.setTitle("" + this.pageTitle + " All Results")
    this.getAssetDetails(this.assetId, this.pageIndex, this.pageSize, sendVideosToModal);
  }

  getAssetDetails(id, pageIndex, pageSize, sendVideosToModal?) {
    this.showLoader = true;
    //TODO: send ksql as parameter
    let genreList: string[] = []
    this.genres.forEach(element => {
      genreList.push("Genre='" + element + "'")
    })
    let ksql = "(and name ~'' (or " + genreList.toString().split(',').join(' ') + "))";
    this.kalturaAppService.getAssetById(id, pageIndex, pageSize, ksql, this.shortBy).then(response => {
      if (response.objects) {
        this.totalVideo = response.totalCount;
        if (response.objects.length > 0) {
          this.populateRails(response, sendVideosToModal);
          this.noResultFound = false;
        } else {
          this.showLoader = false;
          this.noResultFound = true;
        }
      } else {
        this.showLoader = false;
        this.noResultFound = true;
      }
      // this.genres = []
    }, reject => {
      console.error(reject)
    })
  }

  populateRails(assetList, sendVideosToModal?: boolean) {
    this.totalAssetObjects = assetList.totalCount
    assetList.objects.forEach((element, index) => {
      this.assetListObjects.push(element)
    });
    if (sendVideosToModal && this.modalRef) {
      this.modalRef.componentInstance.ugcVideoChange.next(this.assetListObjects);
    }
    this.showLoader = false;
  }


  onScroll(sendVideosToModal?: boolean) {
    if (this.totalAssetObjects > this.pageSize * this.pageIndex) {
      this.pageIndex += 1;
      this.apiToCall(sendVideosToModal);
      // this.getAssetDetails(this.assetId, this.pageIndex, this.pageSize);
    }
  }

  watchAsset(name, mediaId, type, channelId, index: number) {
    if (this.isDesktop) {
      if ((type.toString() === this.DMS.params.MediaTypes.Linear) && (mediaId === 804674 || mediaId === 804672 || mediaId === 804663 || mediaId === 804677)) {
        return this.blockedLinearChannel();
      }
      if ((type.toString() === this.DMS.params.MediaTypes.Program) && (channelId === undefined)) {
        return this.blockedLinearChannel();
      }
      if (type == this.DMS.params.MediaTypes.UGCVideo) {
        this.modalRef = this.modalService.open(UgcVideoPopupComponent);
        this.modalRef.componentInstance.ugcVideoChange.next(this.assetListObjects);
        this.modalRef.componentInstance.index = index;
        this.modalRef.componentInstance.totalVideos = this.totalVideo;
        this.modalRef.componentInstance.getMoreVideos.subscribe((receivedEntry) => {
          if (receivedEntry) {
            this.onScroll(true);
          };
        })
        return;
      }
    }
    this.appUtilService.getAssetRouteUrl(name, mediaId, null, null, type, null, null, channelId).subscribe((res: any) => {
      if (this.kalturaAssetHistoryListResponse) {
        let position = 0;
        position = this.getContinueWatchingPosition(mediaId)
        this.router.navigate([res.url], { queryParams: { position: position } });
      } else {
        this.router.navigate([res.url]);
      }
    }, error => {
      this.router.navigate(['/']);
    })
  }

  getSimilarCreator() {
    this.kalturaAppService.kalturaSearchAsset(null, +this.screenId, this.pageIndex, this.pageSize).then(res1 => {
      // this.similarToCreator = res1;
      this.populateRails(res1);
    }, reject => {
      console.error(reject);
    });
  }

  populateLiveNow() {
    this.kalturaAppService.getLiveNowRail(this.pageIndex, this.pageSize).then(res => {
      this.populateRails(res);
      this.liveNow = true;
    }, reject => {
      console.error(reject)
    })
  }

  getSimilarChannelList() {
    this.showLoader = true;
    this.DMS = this.appUtilService.getDmsConfig();
    this.kalturaAppService.getSimilarChannel(this.pageIndex, this.pageSize, this.DMS.params.MediaTypes.Linear).then((res: any) => {
      this.railViewType = RailViewType[RailViewType.CIRCLE].toString();
      this.railTypeViewClass = 'parent-' + this.railConfigService.getRailTypeCssClass(this.railViewType);
      this.populateRails(res);
      // this.assetList = res;
      this.showLoader = false;
    }, reject => {
      this.showLoader = false;
      console.error(reject);
    })
  }

  getAssetHistory() { // continue watching rail
    if (!this.appUtilService.isUserLoggedIn()) {
      this.showLoader = false;
      return;
    }
    this.railViewType = RailViewType[RailViewType.ContinueWatching].toString();
    this.showLoader = true;
    let daysLessThanOrEqual: number = 30;
    let statusEqual: string = "all";
    this.kalturaAppService.getAssetHistory(daysLessThanOrEqual, statusEqual, this.pageSize, this.pageIndex).then(response => {
      this.kalturaAssetHistoryListResponse = response;
      let assetIds: string = '';
      this.showLoader = false;
      if (response.objects) {
        response.objects.forEach((element, index) => {
          if (element.position !== 0 && !element.finishedWatching) {
            assetIds += element.assetId + ',';
          }
        });
      }
      assetIds = assetIds.substr(0, assetIds.length - 1);
      this.searchAsset(assetIds);
    }, reject => {
      this.showLoader = false;
    });
  }

  searchAsset(assetIds: string) {
    this.showLoader = true;
    let ksql: string = "media_id:'" + assetIds + "'";
    if (assetIds) {
      this.kalturaAppService.searchAsset(null, null, ksql, this.pageIndex, this.pageSize).then(response => {
        this.showLoader = false;
        let assetList = response;
        let arr: any[] = [];
        this.kalturaAssetHistoryListResponse.objects.forEach((elementHistory, index) => {
          assetList.objects.forEach((element, index) => {
            if (elementHistory.assetId === element.id) {
              if (element.type.toString() !== this.DMS.params.MediaTypes.UGCVideo && element.type.toString() !== this.DMS.params.MediaTypes.Trailer &&
                element.type.toString() !== this.DMS.params.MediaTypes.Clips && element.type.toString() !== this.DMS.params.MediaTypes.Linear) {
                arr.push(element);
              }
            }
          });
        });
        assetList.objects = arr;
        assetList.totalCount = arr.length;
        this.populateRails(assetList);
      }, reject => {
        this.showLoader = false;
      });
    } else {
      this.showLoader = false;
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

  outputEvent(event) {
    if (event) {
      this.snackbarUtilService.showSnackbar('Removed from continue watching');
      this.assetListObjects = [];
      this.getAssetHistory();
    }
  }

  getSeasonMore(seriesId: any, seriesType: string) {
    this.kalturaAppService.getNoOfSeasonInSeries(seriesId, seriesType).then((res: any) => {
      if (res.objects) {
        res.objects.forEach(element => {
          if (this.seasonNo === element.metas['Season number'].value) {
            this.pageTitle = "Season " + element.metas['Season number'].value;
            this.kalturaAppService.getNumberOfEpisodesInSeason(seriesId, this.kalturaUtilService.getMetasObjectValue(element.metas, 'Season number'), seriesType, this.pageIndex, this.pageSize).then(res1 => {
              this.populateRails(res1);
            }, reject => {
              console.error(reject);
            });
          }
        });
      }
    }, reject => {
      console.error(reject);
      this.showLoader = false;
      this.snackbarUtilService.showError(reject.message);
    });
  }

  getYouMayAlsoLike(assetId) {
    this.showLoader = true;
    this.kalturaAppService.getMediaAssetById(assetId.toString()).then((res: any) => {
      this.showLoader = false;
      let asset_type = "and asset_type='" + +res.type + "'";
      let genre = '';
      res.tags.Genre.objects.forEach((element, index) => {
        genre += " (or Genre='" + element.value + "')";
      });
      let ksql = "(" + asset_type + genre + ")";
      this.showLoader = true;
      this.kalturaAppService.getYouMayAlsoLike(res.id, ksql, this.pageIndex, this.pageSize).then(response => {
        this.showLoader = false;
        this.populateRails(response);
      }, reject => {
        this.showLoader = false;
      });
    }, reject => {
      this.showLoader = false;
    });
  }

  getGenres(event: any) {
    this.genres = []
    this.genres = event;
  }

  getShorting(event: any) {
    if (event === "AtoZ") {
      this.shortBy = "NAME_ASC"
    } else if (event === "ZtoA") {
      this.shortBy = "NAME_DESC"
    } else {
      this.shortBy = ""
    }
  }

  addFilters(event: boolean) {
    if (event) {
      this.pageIndex = 1
      if (this.railViewType === RailViewType[RailViewType.CIRCLE].toString()) {
        // this.showDescription === true;
        this.pageSize = this.activatedRoute.snapshot.queryParams['pageSize'] ? +this.activatedRoute.snapshot.queryParams['pageSize'] : 35;
      } else {
        this.pageSize = this.activatedRoute.snapshot.queryParams['pageSize'] ? +this.activatedRoute.snapshot.queryParams['pageSize'] : 30
      }
      this.assetListObjects = [];
      this.showLoader = true;
      setTimeout(() => {
        this.getAssetDetails(this.assetId, this.pageIndex, this.pageSize);
      }, 500)
    }
  }

  blockedLinearChannel() {
    this.snackbarUtilService.showSnackbar("Channel Available Only On Watcho App");
  }

  addCononicalSEOTags(moreData?: string) {
    moreData = decodeURI(moreData);
    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", "https://www.watcho.com" + this.routerUrl);
    this.dom.head.appendChild(link);

    let header = this.dom.createElement('h1');
    header.setAttribute('class', 'headerText');
    header.innerHTML = moreData;
    this.dom.body.appendChild(header);
  }

  getMoreVideosFrom(seriesId) {
    this.kalturaAppService.getNoOfSeasonInSeries(seriesId, this.DMS.params.MediaTypes.UGCVideo, true).then(res => {
      this.populateRails(res);
    }, reject => {
      console.error(reject);
    });
  }

  getBecauseYouWatchedRails(assetId) {
    this.showLoader = true;
    this.kalturaAppService.getBecauseYouWatchedRails(assetId, this.pageIndex, this.pageSize).then(response => {
      this.showLoader = false;
      this.populateRails(response);
    }, reject => {
      this.showLoader = false;
    });
  }
}
