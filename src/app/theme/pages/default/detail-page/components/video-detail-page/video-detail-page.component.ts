import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../../../environments/environment';
import { SignInSignUpModalComponent } from '../../../../../shared/entry-component/signIn-signUp-modal.component';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { ShareService } from '../../../../../shared/services/share.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { AppConstants, KalturaMediaType } from '../../../../../shared/typings/common-constants';



declare var KalturaPlayer: any;

@Component({
  selector: 'app-video-detail-page',
  templateUrl: './video-detail-page.component.html',
  styleUrls: ['./video-detail-page.component.scss']
})


export class VideoDetailPageComponent implements OnInit {

  isBrowser;

  playerId: string;
  secure: boolean;
  entryId: string;
  partnerId: string;
  uiConfId: string;
  divId: string;
  assetId: string;
  loading: boolean;

  mediaAssetDetails: any;

  ready: EventEmitter<string> = new EventEmitter<string>();
  videoDeepUrl: any;

  showFollowButton: boolean;
  showWatchListButton: boolean;

  isAddedToWatchList: boolean;
  isFollowed: boolean;

  personalListId: number;
  personalListAsset: any;

  partnerListType: number = 1;

  DMS: any;
  pageSize: number;
  pageIndex: number;

  constructor(@Inject(PLATFORM_ID) private platformId, private activatedRoute: ActivatedRoute,
    private kalturaAppService: KalturaAppService,
    public kalturaUtilService: KalturaUtilService, private shareService: ShareService, private snackbarUtilService: SnackbarUtilService,
    private appUtilService: AppUtilService, private modalService: NgbModal) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.showFollowButton = false;
    this.showWatchListButton = false;
    this.isAddedToWatchList = false;
    this.isFollowed = false;
    this.pageIndex = 1;
    this.pageSize = 40;
  }

  ngOnInit() {
    this.DMS = this.appUtilService.getDmsConfig('sfsf');

    let mediaTypeById: any;
    if (this.isBrowser) {
    }
    try {
      this.assetId = this.activatedRoute.snapshot.params['assetId'];
      mediaTypeById = this.activatedRoute.snapshot.params['mediaTypeById'];
    } catch (error) {

    }
    this.playerId = Date.now().toString();
    this.partnerId = this.DMS.extServices.kavaPartnerID;
    this.uiConfId = environment.KALTURA_UICONF_ID;
    this.divId = "kaltura_player_" + this.playerId;
    // if (this.isBrowser) {
    if (mediaTypeById) {
      setTimeout(() => {
        this.getMediaAssetDetails(this.assetId);
      }, 200);
    } else {
      this.getMediaAssetDetails(this.assetId);

    }
    // }
    this.getMediaAssetDetails(this.assetId);
    this.getWatchlist();
  }

  getMediaAssetDetails(assetId) {
    this.kalturaAppService.getMediaAssetById(assetId).then(response => {
      this.mediaAssetDetails = response;
      if (this.DMS.params.MediaTypes.WebSeries === this.mediaAssetDetails.type.toString() ||
        this.DMS.params.MediaTypes.SpotlightSeries === this.mediaAssetDetails.type.toString() ||
        // this.DMS.params.MediaTypes.TVShowSeries === this.mediaAssetDetails.type.toString() ||
        this.DMS.params.MediaTypes.UGCCreator === this.mediaAssetDetails.type.toString()) {
        this.showFollowButton = true;
        this.showWatchListButton = false;
      } else {
        this.showFollowButton = false;
        this.showWatchListButton = true;
      }
      this.mediaAssetDetails.mediaFiles.forEach((element, index) => {
        if (element.type === KalturaMediaType.DASH_MAIN) {
          this.entryId = element.assetId.toString();
        }
      });
      if (this.isBrowser) {
        this.loadPlayer();
      }
      this.getMediaAssetInfo(this.kalturaUtilService.getTagsObjectValue(this.mediaAssetDetails.tags.SeriesId), this.mediaAssetDetails.type);

    }, reject => {
      console.error(reject);
    })
  }

  loadPlayer() {
    const intervalID = setInterval(() => {

      clearInterval(intervalID);

      const target = this.playerId ? `kaltura_player_${this.playerId}` : `kaltura_player_`;

      var playerConfig = {
        targetId: target,
        provider: {
          partnerId: 487,
          ks: localStorage.getItem(AppConstants.KS_KEY),
          env: {
            serviceUrl: this.DMS.params.Gateways.JsonGW + environment.KALTURA_API_VERSION
          }
        },
        player: {
          playback: {
            autoplay: false,
            allowMutedAutoPlay: false,
            "options": {
              "html5": {
                "hls": {
                  "maxBufferLength": 6,
                  "maxBufferSize": 2000000,
                  "maxMaxBufferLength": 40,
                  "capLevelToPlayerSize": true,
                  "debug": true,
                  "appendErrorMaxRetry": 10
                }
              }
            }
          }
        }

      };

      this.getKalturaPlayer(this.entryId, KalturaMediaType.DASH_MAIN, playerConfig);

    }, 50);
  }

  getKalturaPlayer(entryId, format, playerConfig) {
    var info = {
      entryId: entryId,
      formats: [format]//,
      //"mediaType": "epg",
      //"contextType": "START_OVER"
    };
    try {
      let kalturaPlayer = KalturaPlayer.setup(playerConfig);
      kalturaPlayer.loadMedia(info);
      return kalturaPlayer;
    } catch (e) {
      console.error(e.message)
    }
  }

  getMediaAssetInfo(seriesId: string, typeIn: number) {
    // this.kalturaAppService.getNumberOfSeasonInSeries(seriesId, typeIn).then(response => {
    //   // console.log(response);
    // }, reject => {
    //   console.error(reject);
    // });
  }
  setupDeepLink() {

    // this.fbImageUrl = this.IMAGE_CLOUDFRONT_URL + this.filters + AppConstants.VIDEO_IMAGE_BASE_KEY + this.videoResult.landscapeImage;

    this.videoDeepUrl = this.shareService.share(this.mediaAssetDetails.id, this.mediaAssetDetails.type, this.mediaAssetDetails.name, this.mediaAssetDetails.description);

  }

  copyToClipboard() {
    if (this.videoDeepUrl) {
      this.snackbarUtilService.showSnackbar("Link copied to clipboard");

    }
    else {
      this.snackbarUtilService.showSnackbar("Link cannot be copied");

    }
  }

  getWatchlist() {
    if (this.appUtilService.isUserLoggedIn()) {
      this.kalturaAppService.getPersonalList(1, this.pageSize, this.pageIndex).then(res => {
        this.personalListAsset = res;
        if (this.personalListAsset.totalCount > 0) {
          this.personalListAsset.objects.forEach((element, index) => {
            let media_id = element.ksql.split('=')[1];
            media_id = media_id.substr(1, media_id.length - 2);
            if (this.assetId === media_id) {
              this.personalListId = element.id;
              this.isAddedToWatchList = true;
            }
          })
        }

      }, reject => {
        console.error(reject);
        this.snackbarUtilService.showError(reject.message);
      })
    }

  }

  getPersonalListId(assetId): number {
    this.personalListAsset.objects.forEach((element, index) => {
      let media_id = element.ksql.split('=')[1];
      media_id = media_id.substr(1, media_id.length - 2);
      if (assetId === media_id) {
        this.personalListId = element.id;
      }
    });
    return this.personalListId;
  }

  toggleWatchlist(isAddedToWatchList: boolean) {
    if (this.appUtilService.isUserLoggedIn()) {
      if (isAddedToWatchList) {
        // item already available on watchlist call api to remove from watchlist
        this.loading = true;
        this.personalListId = this.getPersonalListId(this.assetId);
        this.kalturaAppService.personalListDeleteAction(this.personalListId).then(response => {
          this.loading = false;
          this.snackbarUtilService.showSnackbar('Video removed in your Watchlist');
          this.isAddedToWatchList = false;
          this.getWatchlist();
        }, reject => {
          this.loading = false;
          this.snackbarUtilService.showError(reject.message);
        });
      } else {
        // item not in watchlist call api to add item to watchlist
        this.loading = true;
        let ksql = "media_id='" + this.assetId + "'";
        let name = "name='" + this.mediaAssetDetails.name + "'"

        this.kalturaAppService.personalListAddAction(name, ksql, this.partnerListType).then(res => {
          this.loading = false;
          this.snackbarUtilService.showSnackbar('Video added in your Watchlist');
          this.isAddedToWatchList = true;
          this.getWatchlist();
        }, reject => {
          this.loading = false;
          this.snackbarUtilService.showError(reject.message);
        })
      }
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
}

