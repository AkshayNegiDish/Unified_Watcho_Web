import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { SignInSignUpModalComponent } from '../entry-component/signIn-signUp-modal.component';
import { AppUtilService } from '../services/app-util.service';
import { KalturaAppService } from '../services/kaltura-app.service';
import { KalturaUtilService } from '../services/kaltura-util.service';
import { PlatformIdentifierService } from '../services/platform-identifier.service';
import { SnackbarUtilService } from '../services/snackbar-util.service';
import { AppConstants, EntitlementConstants, KalturaMediaType } from '../typings/common-constants';
import { Entries, EntryIds } from '../typings/shared-typing';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';
import { UUID } from 'angular2-uuid';
import { UserFormService } from '../../pages/default/user-management/services/user-form.service';
declare var $: any;

declare var KalturaPlayer: any;
declare var screen: any;

@Component({
  selector: 'app-kaltura-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class KalturaPlayerComponent implements OnInit, OnChanges {

  @Input() playerId: any;
  @Input() secure = true;
  @Input() assetDetail: any = [];
  @Input() programAssetDetail: any;
  @Input() partnerId;
  @Input() playerPartnerId;
  @Input() serviceUrl: any;
  @Input() autoplay = true;
  @Input() channelFileIdIn: any = null;
  @Input() allowMutedAutoPlay = false;
  @Input() isLive = false;
  @Input() showWaterMark = false;
  @Input() seriesId: any = null;
  @Input() isCatchup: boolean = false;
  @Input() channelId: number = null;
  @Input() isAssetInWatchlist: boolean = false
  @Output() episodeId = new EventEmitter<any>();
  @Input() ugcPlayerFound?: boolean = false;
  @Input() seasonNumber?: string = null;



  showPlayer = false;
  kalturaPlayer: any;
  entryId = '';

  @Output()
  isEntitled = new EventEmitter<any>()

  private debug: boolean;
  loading = false;
  assetId: string;
  browserDetails: any;
  fileIdIn = "";

  DMS: any;
  watermark: string;
  seriesList: any[] = [];
  assetIds: number[] = [];
  mediaType: any;
  entries: Entries = null;
  autoplayNext: boolean = false;
  parentalPassed: boolean = false;
  channelAssetId: number = null;
  moeEventStatus: string;
  youboraAccountCode: string = '';
  quaterCompletionFlag: boolean = false;
  halfCompletionFlag: boolean = false;
  moreThenHalfCompletionFlag: boolean = false;
  videoEnd: boolean = false;
  isProgram: boolean = false;
  videoQuality: number;
  isHLSClearFound: boolean = false;
  channelLogo: string;
  appPosterWaterMark: boolean = false;
  UserCategory: string = '';
  deviceId: string;
  previousUrl: string = null;

  showSubscriptionPlans: boolean;
  isUserLoggedIn: boolean;
  isIntrostart: boolean = false;
  isCreditSkip: boolean = false;
  mediaURL: string = null;
  isSubscriptionEndData: boolean = false;
  freePlayCount: number;
  freePlayInterval: any;

  constructor(private appUtilService: AppUtilService, private kalturaUtilService: KalturaUtilService, private userFormService: UserFormService,
    private platformIdentifierService: PlatformIdentifierService, private modalService: NgbModal,
    private snackbarUtilService: SnackbarUtilService, private activatedRoute: ActivatedRoute, private kalturaAppService: KalturaAppService) {
    if (platformIdentifierService.isBrowser()) {
      this.browserDetails = this.appUtilService.getBrowserDetails();
    }
    // this.entries = {
    //   entries: []
    // }
    this.showSubscriptionPlans = null;
  }

  // play event from poster play button
  playEvent() {

    if (this.kalturaPlayer) {
      this.kalturaPlayer.reset();
    }
    this.initPlayer();

  }

  ngOnInit() {
    this.isUserLoggedIn = this.appUtilService.isUserLoggedIn();
    this.videoEnd = false;
    this.DMS = this.appUtilService.getDmsConfig('cdsffdv');
    this.partnerId = +this.DMS.version.partnerid;
    this.playerId = environment.KALTURA_UICONF_ID;
    this.playerPartnerId = this.DMS.extServices.kavaPartnerID;
    this.youboraAccountCode = environment.YOUBORA_ACCOUNT_CODE;
    this.serviceUrl = this.DMS.params.Gateways.JsonGW + environment.KALTURA_PLAYER_API_VERSION;
    this.loading = true;
    if (environment.env === "dev" || environment.env === "qa") {
      this.debug = true;
    }
    if (this.assetDetail) {
      this.mediaType = this.assetDetail.type.toString();
      // this.entries = this.getSeriesList(this.seriesId);
      for (let i = 0; i < this.assetDetail.images.length; i++) {
        if (this.assetDetail.images[i].ratio === '1:1') {
          this.channelLogo = this.assetDetail.images[i].url;
        }
      }
    }
    if (this.isLive || this.isCatchup) {
      this.appPosterWaterMark = true;
    }
    this.UserCategory = localStorage.getItem(AppConstants.USER_CATEGORY);
    if (this.UserCategory === '1') {
      this.UserCategory = 'DISH TV';
    } else if (this.UserCategory === '2') {
      this.UserCategory = 'D2H';
    } else if (this.UserCategory === '3') {
      this.UserCategory = 'WATCHO';
    }
    this.getDeviceId();

  }

  ngOnChanges(changes: SimpleChanges) {
    const assetDetail: SimpleChange = changes.assetDetail;
    this.assetDetail = assetDetail.currentValue;
    if (this.platformIdentifierService.isBrowser()) {
      if (changes) {
        if (document.getElementById('kalturaLib') !== null) {
          if (KalturaPlayer.getPlayer("kalturaPlayerTargetId")) {
            if (KalturaPlayer.getPlayer("kalturaPlayerTargetId").isInPictureInPicture()) {
              KalturaPlayer.getPlayer("kalturaPlayerTargetId").exitPictureInPicture()
              KalturaPlayer.getPlayer("kalturaPlayerTargetId").pause()
            }
          }
        }

        setTimeout(() => {
          if (this.appUtilService.isUserLoggedIn()) {
            this.getSubscriptionHistory();
          } else {
            this.initPlayer();
            this.entries = this.getSeriesList(this.seriesId, this.seasonNumber);
          }
          // this.initPlayer();
          // this.entries = this.getSeriesList(this.seriesId);
        }, 100)
      }
    }
  }

  private initPlayer() {
    // this.entries = {
    //   entries: []
    // }
    if (this.isCatchup === true || this.isLive === true) {
      this.isProgram = true;

    }
    this.loading = true;
    if (this.platformIdentifierService.isBrowser()) {
      if (localStorage.getItem(AppConstants.USER_CATEGORY) === '2') {
        this.watermark = 'https://d1f8xt8ufwfd45.cloudfront.net/web/statics/D2H-logo.png';
      } else {
        this.watermark = 'https://d1f8xt8ufwfd45.cloudfront.net/web/statics/dish-logo.png';
      }
      if (localStorage.getItem(AppConstants.AUTOPLAY) === 'true') {
        this.autoplayNext = true;
      } else {
        this.autoplayNext = false;
      }
      this.entryId = this.assetDetail.entryId ? this.assetDetail.entryId : '';
      this.showPlayer = false;
      this.loading = true;
      this.assetId = this.assetDetail.id + "";
      if (environment.env === "dev" || environment.env === "qa") {
        this.debug = true;
      }
      this.fileIdIn = "null";
      this.mediaURL = null;
      if (this.isCatchup) {
        this.channelAssetId = this.channelId;
        this.fileIdIn = this.channelFileIdIn;
      } else {
        this.channelAssetId = this.assetDetail.id;
        for (let mediaFile of this.assetDetail.mediaFiles) {
          if (mediaFile.type === "HLS_Clear") {
            this.isHLSClearFound = true;
            break;
          } else {
            if (this.browserDetails.browser === "Safari" && mediaFile.type === KalturaMediaType.HLS_MAIN) {
              this.fileIdIn = mediaFile.id.toString();
              this.isHLSClearFound = false;
              this.mediaURL = mediaFile.url;
            } else if (this.browserDetails.browser !== "Safari" && mediaFile.type === KalturaMediaType.DASH_MAIN) {
              this.fileIdIn = mediaFile.id.toString();
              this.isHLSClearFound = false;
              this.mediaURL = mediaFile.url;
            }
          }
        }
      }

      if (this.isHLSClearFound) {
        this.loading = true;
        this.loadScript();
      } else if (this.ugcPlayerFound) {
        this.loading = true;
        this.loadScript();
      } else {
        // this.loading = false;
        this.kalturaUtilService.checkIfUserCanWatchAsset(this.channelAssetId, this.fileIdIn, this.parentalPassed).subscribe((response: string) => {
          this.parentalPassed = false;
          let errorDetails: any = null;
          // this.loading = false;
          switch (response) {
            case EntitlementConstants.PLAY:
              this.loading = true;

              //FTA Live Channels
              let isFTA = this.assetDetail.metas.IsFTA ? this.assetDetail.metas.IsFTA.value : false;
              if (!this.isUserLoggedIn && this.appUtilService.getMediaTypeNameById(this.assetDetail.type) === 'Linear' && isFTA) {
                if (+localStorage.getItem('freePlayCount') >= this.assetDetail.metas.FreePlay.value && localStorage.getItem('ftaDate').toString() === new Date().getDate().toString()) {
                  this.loading = false;
                  this.appUtilService.pausePlayer();
                  this.modalService.open(SignInSignUpModalComponent);
                  this.snackbarUtilService.showError("Please login to view this content");
                } else {
                  this.loadScript();
                }
              } else {
                this.loadScript();
              }
              break;
            case EntitlementConstants.DEVICE_NOT_ACTIVE:
              this.loading = false;
              this.snackbarUtilService.showSnackbar('You are logged out from the application, as your device is deleted, \n Please login again');
              this.appUtilService.logoutUser();
              this.addMoengageEvent(this.assetDetail, 'other_error');
              break;
            case EntitlementConstants.PARENTAL_ERROR:
              this.loading = false;
              this.snackbarUtilService.showSnackbar('Enter PIN for watching this video');
              errorDetails = 'Enter PIN for watching this video';
              this.addMoengageEventParentalRating(this.assetDetail, errorDetails, false);
              this.addGTMTagForPlaybackErrorAndParentalRating(this.assetDetail, errorDetails, false);
              break;
            case EntitlementConstants.PARENTAL_PASSED:
              this.parentalPassed = true;
              this.initPlayer()
              this.addMoengageEventParentalRating(this.assetDetail, errorDetails, true);
              this.addGTMTagForPlaybackErrorAndParentalRating(this.assetDetail, errorDetails, true);
              break;
            case EntitlementConstants.ERROR:
              this.loading = false;
              this.snackbarUtilService.showSnackbar('Looks like you have an unstable network at the moment, please try again when network stabilizes ');
              this.addMoengageEvent(this.assetDetail, 'server_error');
              break;
            case EntitlementConstants.GEO_LOCATION_BLOCKED_ERROR:
              this.loading = false;
              this.snackbarUtilService.showSnackbar('The content is not  allowed to be  viewed in your region.');
              break;
            case EntitlementConstants.NOT_SUBSCRIBED:
              this.loading = false;
              if (this.isLive) {
                if (this.appUtilService.getLogginType() === true && this.UserCategory === 'DISH TV') {
                  this.snackbarUtilService.showSnackbar('You are not subscribed to this channel on your Dish TV. To start viewing content, please add this channel to your Account on Dish TV.');
                  errorDetails = 'You are not subscribed to this channel on your Dish TV. To start viewing content, please add this channel to your Account on Dish TV.';
                } else if (this.UserCategory === 'D2H') {
                  this.snackbarUtilService.showSnackbar('You are not subscribed to this channel on your D2H TV. To start viewing content, please add this channel to your Account on D2H TV.');
                  errorDetails = 'You are not subscribed to this channel on your D2H TV. To start viewing content, please add this channel to your Account on D2H TV.';
                } else {
                  this.snackbarUtilService.showSnackbar('This channel is available only for Dish/D2H subscribers. Please login with your RMN if you are an existing subscriber.');
                  errorDetails = 'This channel is available only for Dish/D2H subscribers. Please login with your RMN if you are an existing subscriber.';
                }
              } else {
                if (!this.isProgram) {
                  this.showSubscriptionPlans = true;
                }
                this.snackbarUtilService.showSnackbar('You are not entitled to view this video');
                errorDetails = 'You are not entitled to view this video';
              }
              // this.addMoengageEvent(this.assetDetail, 'entitlement_error');
              this.addMoengageEventParentalRating(this.assetDetail, errorDetails, false);
              this.addGTMTagForPlaybackErrorAndParentalRating(this.assetDetail, errorDetails, false);
              break;
            case EntitlementConstants.USER_NOT_LOGGED_IN:
              this.loading = false;
              this.showSubscriptionPlans = true;
              if (this.isLive) {
                this.snackbarUtilService.showSnackbar('Please login to view this content');
                // this.addMoengageEvent(this.assetDetail, 'other_error');
                errorDetails = 'Please login to view this content';
                this.addMoengageEventParentalRating(this.assetDetail, errorDetails, false);
                this.addGTMTagForPlaybackErrorAndParentalRating(this.assetDetail, errorDetails, false);
              } else {
                this.snackbarUtilService.showSnackbar('Please login and subscribe to view this content');
                // this.addMoengageEvent(this.assetDetail, 'other_error');
                errorDetails = 'Please login and subscribe to view this content';
                this.addMoengageEventParentalRating(this.assetDetail, errorDetails, false);
                this.addGTMTagForPlaybackErrorAndParentalRating(this.assetDetail, errorDetails, false);
              }
              this.appUtilService.pausePlayer();
              this.showLoginPopup();
              break;
          }
        });
      }
    }
  }

  private isKalturaPlayerScriptLoaded(): boolean {
    if (document.getElementById('kalturaLib') === null) {
      return false;
    } else {
      return true;
    }
  }

  public loadScript() {
    if (document.getElementById('kalturaLib') === null) {
      let src = `http${this.secure ? 's' : ''}://cdnapi${this.secure ? 'sec' : ''}.kaltura.com/p/${this.playerPartnerId}/embedPlaykitJs/uiconf_id/${this.playerId}/`;
      const node = document.createElement('script');
      node.id = 'kalturaLib';
      node.src = src;
      node.type = 'text/javascript';
      node.async = false;
      node.charset = 'utf-8';
      node.onload = this.getContinueWatchingPosition.bind(this);
      document.getElementsByTagName('head')[0].appendChild(node);
    } else {
      this.getContinueWatchingPosition();
    }
  }

  getContinueWatchingPosition() {
    return this.activatedRoute.queryParamMap.subscribe((map) => {
      let position = 0;
      if (map.has('position')) {
        position = Number.parseInt(map.get('position'));
      }
      return this.onKalturaScriptLoaded(position);
    });
  }

  onKalturaScriptLoaded(position) {
    const target = "kalturaPlayerTargetId";

    var playerConfig = {
      targetId: target,
      provider: {
        uiConfId: this.playerId,
        partnerId: this.partnerId,
        ks: localStorage.getItem(AppConstants.KS_KEY),
        env: {
          serviceUrl: this.serviceUrl
        }
      },
      customLabels: {
        qualities: function (videoTrack) {
          if (videoTrack.height > 400) {
            return 'High';
          }
          if (videoTrack.height < 300) {
            return 'Low';
          }
          else {
            return 'Medium'
          }
        }
      },
      player: {
        plugins: {
          ottAnalytics: {
            serviceUrl: this.serviceUrl,
            ks: localStorage.getItem(AppConstants.KS_KEY)
          },
          kava: {
            partnerId: this.playerPartnerId,
            entryId: this.entryId,
            userId: this.isUserLoggedIn ? JSON.parse(localStorage.getItem("user-sms")).OTTSubscriberID : null
          },
          ima: {
            adTagUrl: this.isProgram ? "" : this.isSubscriptionEndData ? "" : "https://pubads.g.doubleclick.net/gampad/ads?iu=/11440465/Watcho_Video/Watcho_Video_Preroll&description_url=https%3A%2F%2Fwatcho.com&tfcd=0&npa=0&sz=640x480&gdfp_req=1&output=vmap&unviewed_position_start=1&env=vp&impl=s&correlator=[timestamp]&hl=en"
          },
          youbora: {

            options: {
              accountCode: this.youboraAccountCode,
              "username": JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS)) ? JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS)).OTTSubscriberID : this.deviceId ? this.deviceId : '',
              "content.title": this.assetDetail.name,
              "content.duration": this.isLive ? this.assetDetail.mediaFiles[0] : 0 ? this.assetDetail.mediaFiles[0].duration : null,
              "content.resource": this.assetDetail.mediaFiles === undefined ? null : this.mediaURL ? this.mediaURL : null,
              "content.isLive": this.isLive ? true : false,
              "content.id": this.assetDetail.id,
              "content.type": this.isLive ? 'LIVE' : this.ugcPlayerFound ? 'UGC' : 'VOD',
              "content.genre": this.assetDetail.tags.Genre ? this.assetDetail.tags.Genre.objects[0].value : null,
              "content.language": "English",
              "content.year": this.assetDetail.metas.Year ? this.assetDetail.metas.Year.value : null,
              "content.cast": this.assetDetail.tags["Main Cast"] ? this.assetDetail.tags["Main Cast"].objects[0].value : null,
              "content.director": this.assetDetail.tags.Director ? this.assetDetail.tags.Director.objects[0].value : null,
              "content.owner": "Self",
              "extraparam.1": this.assetDetail.tags.Genre ? this.assetDetail.tags.Genre.objects[0].value : null,
              "extraparam.2": localStorage.getItem(AppConstants.AUTH_HEADER_KEY) ? this.UserCategory : '',
              "extraparam.3": this.deviceId ? this.deviceId : ''
            }

          }
        },
        playback: {
          "startTime": position,
          "preload": "auto",
          autoplay: true,
          allowMutedAutoPlay: true,
          pictureInPicture: true,
          loop: this.ugcPlayerFound ? true : false,
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
          },
          streamPriority: [
            {
              engine: 'html5',
              format: 'hls'
            },
            {
              engine: 'html5',
              format: 'dash'
            },
            {
              engine: 'html5',
              format: 'progressive'
            }
          ]
        },

        sources: {
          type: this.isLive ? 'Live' : ''
        }
      },

      abr: {
        enabled: true,
        fpsDroppedFramesInterval: 5000,
        fpsDroppedMonitoringThreshold: 0.2,
        capLevelOnFPSDrop: true,
        capLevelToPlayerSize: false,
        defaultBandwidthEstimate: 500e3
      },
      ui: {
        components: {
          watermark: {
            img: this.showWaterMark ? this.watermark : '',
            // url: 'javascript:;',
            placement: this.showWaterMark ? 'bottom-right' : ''
            // timeout: Infinity
          }
        }
      },
      playlist: {
        options:
        {
          autoContinue: this.autoplayNext
        },
        countdown: {
          duration: this.assetDetail.tags.Creditstart ? this.assetDetail.mediaFiles[0].duration - (this.assetDetail.tags.Creditstart.objects[0].value) / 1000 : 30
        }
      },
      preferredTextLanguage: "en"


    };
    this.loadPlayer(this.assetId, playerConfig);
  }


  private loadPlayer(entryId: string, playerConfig) {
    var info = {
      entryId: entryId,
      formats: this.isHLSClearFound ? ['HLS_Clear'] : '',
      // formats: ['HLS_Clear'],
      mediaType: this.isCatchup ? "epg" : '',
      assetReferenceType: this.isCatchup ? "epg_internal" : "media",
      "contextType": this.isCatchup ? "CATCHUP" : ''
    };
    try {
      if (document.getElementById('kalturaLib') !== null) {
        if (KalturaPlayer !== undefined) {
          if (KalturaPlayer.getPlayer("kalturaPlayerTargetId")) {
            KalturaPlayer.getPlayer("kalturaPlayerTargetId").destroy();
          }
        }
      }

      this.kalturaPlayer = KalturaPlayer.setup(playerConfig);
      this.kalturaPlayer.addEventListener('play', (event) => {
        let moeEventStatus = 'play_successful'
        this.addMoengageEvent(this.assetDetail, moeEventStatus);
        if (this.isAssetInWatchlist) {
          this.addMoeEventForWatchlist('play_successful')
        }
        if (this.videoEnd === true) {
          this.gtmTagForPlayerEvent(this.assetDetail, 'replayed')
        } else {
          this.gtmTagForPlayerEvent(this.assetDetail, 'play')
        }

        //FTA Live Channels
        let isFTA = this.assetDetail.metas.IsFTA ? this.assetDetail.metas.IsFTA.value : false;
        if (!this.isUserLoggedIn && this.appUtilService.getMediaTypeNameById(this.assetDetail.type) === 'Linear' && isFTA) {
          this.isFTATagOnLiveChannels(this.assetDetail);
        }

      });

      this.kalturaPlayer.addEventListener('leavepictureinpicture', (event) => {
        if (window.location.href.toString().match(event.currentTarget.getMediaInfo().entryId) === null) {
          this.kalturaPlayer.reset();
        }
      });

      this.kalturaPlayer.addEventListener('pause', (event) => {

        // if (this.assetDetail.mediaFiles[0].duration - 1 > this.kalturaPlayer.currentTime) {
        //   this.gtmTagForPlayerEvent(this.assetDetail, 'Pause')
        // }
        this.moengageEventForVideoStopped(this.assetDetail, this.kalturaPlayer.currentTime.toFixed());
        this.addGTMTagForVideoStopped(this.assetDetail);
        setTimeout(() => {
          clearInterval(this.freePlayInterval);
        }, 1000);
      });

      this.kalturaPlayer.addEventListener('medialoaded', (event) => {
        if (this.ugcPlayerFound) {
          let currentKalturaPlayer = KalturaPlayer.getPlayer("kalturaPlayerTargetId");
          currentKalturaPlayer.muted = false;
          $(document).ready(function () {
            if (!$(".playkit-top-bar>.playkit-right-controls>.playkit-icon").hasClass("playkit-icon-volume-base")) {
              $(".playkit-top-bar>.playkit-right-controls").append("<i class='playkit-icon playkit-icon-volume-base'></i><i class='playkit-icon playkit-icon-volume-waves'></i>");
            }
          });
          $(document).click(function (e) {
            try {
              let kalturaPlayer = KalturaPlayer.getPlayer("kalturaPlayerTargetId");
              if (e.target.className === "playkit-icon playkit-icon-volume-waves") {
                if (KalturaPlayer.getPlayer("kalturaPlayerTargetId")) {
                  kalturaPlayer.ready().then(() => {
                    if (kalturaPlayer.muted === false) {
                      kalturaPlayer.muted = true;
                      $(".playkit-top-bar>.playkit-right-controls>.playkit-icon-volume-waves").remove();
                      $(".playkit-top-bar>.playkit-right-controls").append("<i class='playkit-icon playkit-icon-volume-mute'></i>");
                    }
                  });
                }
              } else if (e.target.className === "playkit-icon playkit-icon-volume-mute") {
                if (KalturaPlayer.getPlayer("kalturaPlayerTargetId")) {
                  kalturaPlayer.ready().then(() => {
                    if (kalturaPlayer.muted === true) {
                      kalturaPlayer.muted = false;
                      $(".playkit-top-bar>.playkit-right-controls>.playkit-icon-volume-mute").remove();
                      $(".playkit-top-bar>.playkit-right-controls").append("<i class='playkit-icon playkit-icon-volume-waves'></i>");
                    }
                  });
                }
              }
            } catch (e) { }
          });
        }
        if (!this.ugcPlayerFound) {
          $(document).click(function (e) {
            if (e.target.className === "playkit-icon playkit-icon-volume-waves" || e.target.className === "playkit-icon playkit-icon-volume-mute") {
              if ($(".playkit-top-bar>.playkit-right-controls>").hasClass("playkit-icon")) {
                $(".playkit-top-bar .playkit-right-controls .playkit-icon").remove();
              }
            }
          });
        }
      });

      this.kalturaPlayer.addEventListener('timeupdate', (event: any) => {
        if (!this.quaterCompletionFlag) {
          if ((this.kalturaPlayer.currentTime) > (this.assetDetail.mediaFiles[0].duration / 4)) {
            this.quaterCompletionFlag = true;
            this.gtmTagForPlayerEvent(this.assetDetail, '25% watched')
          }
        }
        if (!this.halfCompletionFlag) {
          if ((this.kalturaPlayer.currentTime) > (this.assetDetail.mediaFiles[0].duration / 2)) {
            this.halfCompletionFlag = true;
            this.gtmTagForPlayerEvent(this.assetDetail, '50% watched')
          }
        }
        if (!this.moreThenHalfCompletionFlag) {
          if ((this.kalturaPlayer.currentTime) > (this.assetDetail.mediaFiles[0].duration * (3 / 4))) {
            this.moreThenHalfCompletionFlag = true;
            this.gtmTagForPlayerEvent(this.assetDetail, '75% watched')
          }
        }

        //skip intro
        if (this.assetDetail.tags.Introstart) {
          if (((this.assetDetail.tags.Introstart.objects[0].value) / 1000 < this.kalturaPlayer.currentTime) && (this.kalturaPlayer.currentTime < (this.assetDetail.tags.Introend.objects[0].value / 1000))) {
            if (!this.isIntrostart) {
              this.isIntrostart = true;
              try {
                $("#player-gui").parent().append("<div class='skip-intro'><button class='skip-button'>" + this.assetDetail.tags.labelIntro.objects[0].value + "</button></div>");
                $(document).ready(() => {
                  $('.skip-button').on('click', () => {
                    this.kalturaPlayer.ready().then(() => {
                      this.kalturaPlayer.currentTime = (this.assetDetail.tags.Introend.objects[0].value) / 1000;
                    });
                    this.gtmTagEventClickOnSkipIntroButton(this.assetDetail, 'skip_intro');
                    this.moEngageEventForSkipIntroButton(this.assetDetail, 'SKIP_INTRO');
                  });
                });
              } catch (e) { }
            }
          } else {
            try {
              $(".skip-intro").removeClass();
              this.isIntrostart = false;
            } catch (e) { }
          }
        }

         //credit skip
         let isEpisode: boolean = this.appUtilService.getMediaTypeNameById(this.assetDetail.type) === "Web Episode" ? true : this.appUtilService.getMediaTypeNameById(this.assetDetail.type) === "Spotlight Episode" ? true : false;
         if (this.assetDetail.tags.Creditstart && !isEpisode) {
          if (((this.assetDetail.tags.Creditstart.objects[0].value) / 1000 < this.kalturaPlayer.currentTime) && (this.kalturaPlayer.currentTime < (this.assetDetail.tags.Creditend.objects[0].value / 1000))) {
            if (!this.isCreditSkip) {
              this.isCreditSkip = true;
              try {
                $("#player-gui").parent().append("<div class='credit-skip'><button class='credit-button'>" + this.assetDetail.tags.labelendcredit.objects[0].value + "</button></div>");
                $(document).ready(() => {
                  $('.credit-button').on('click', () => {
                    this.kalturaPlayer.ready().then(() => {
                      this.kalturaPlayer.currentTime = (this.assetDetail.tags.Creditend.objects[0].value) / 1000;
                    });
                    this.gtmTagEventClickOnCreditSkipButton(this.assetDetail, 'skip_credits');
                    this.moEngageEventForCreditSkipButton(this.assetDetail, 'SKIP_CREDITS');
                  });
                });
              } catch (e) { }
            }
          } else {
            try {
              $(".credit-skip").removeClass();
              this.isCreditSkip = false;
            } catch (e) { }
          }
        }

        // mute or unmute button
        if (this.ugcPlayerFound) {
          if (this.kalturaPlayer.muted === false) {
            this.kalturaPlayer.muted = false;
            $(document).ready(function () {
              if (!$(".playkit-top-bar>.playkit-right-controls>.playkit-icon").hasClass("playkit-icon-volume-base")) {
                $(".playkit-top-bar>.playkit-right-controls").append("<i class='playkit-icon playkit-icon-volume-base'></i><i class='playkit-icon playkit-icon-volume-waves'></i>");
              }
            });
          } else {
            this.kalturaPlayer.muted = true;
            $(document).ready(function () {
              if (!$(".playkit-top-bar>.playkit-right-controls>.playkit-icon").hasClass("playkit-icon-volume-base")) {
                $(".playkit-top-bar>.playkit-right-controls").append("<i class='playkit-icon playkit-icon-volume-base'></i><i class='playkit-icon playkit-icon-volume-mute'></i>");
              }
            });
          }
        }
      });

      this.kalturaPlayer.addEventListener('alladscompleted', (event) => {
        this.showPrecedeTextAndNatureOfContentOnPlayer();
        setTimeout(() => {
          try {
            $(".asset-detail-onplayer").removeClass();
          } catch (e) { }
        }, 7000);
      });

      this.kalturaPlayer.addEventListener('abort', (event) => {
        this.gtmTagForPlayerEvent(this.assetDetail, 'stop')
      });

      this.kalturaPlayer.addEventListener(this.kalturaPlayer.Event.Core.ENDED, (event) => {
        this.videoEnd = true;
        this.gtmTagForPlayerEvent(this.assetDetail, 'completed')
      });

      let concurrencyLimitErrorCode: boolean = false;
      this.kalturaPlayer.addEventListener(this.kalturaPlayer.Event.CONCURRENCY_LIMIT, event => {
        const payload = event.payload;
        if (payload.result.error.code === "4001" && !concurrencyLimitErrorCode) {
          concurrencyLimitErrorCode = true;
          this.loading = false;
          setTimeout(() => {
            history.back();
          }, 1000);
          this.snackbarUtilService.showError("Your Watcho account is in use on too many devices. Please stop playing on other devices to continue.");
        }
      });




      this.kalturaPlayer.addEventListener(this.kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, e => {
        $('#kalturaPlayerTargetId').addClass("kalturaPlayerTargetId");
        setTimeout(function () {
          $('#kalturaPlayerTargetId').removeClass("kalturaPlayerTargetId");
        }, 4000)
        if (e.payload.index > 0) {
          this.videoEnd = false;
          this.episodeId.emit(e.payload.activeItem._sources.id);
          this.getNextEpisodeDetail(e.payload.activeItem._sources.id)
          this.kalturaPlayer.ready().then(function () {
            let selectedVideoQuality = 0;
            let currentKalturaPlayer = KalturaPlayer.getPlayer("kalturaPlayerTargetId");
            let currentVideoTracks = currentKalturaPlayer.getTracks(currentKalturaPlayer.Track.VIDEO);
            if (currentVideoTracks.length >= 6) {
              if (localStorage.getItem(AppConstants.VIDEO_QUALITY)) {
                if (localStorage.getItem(AppConstants.VIDEO_QUALITY) === '300000') {
                  selectedVideoQuality = 1;
                } else if (localStorage.getItem(AppConstants.VIDEO_QUALITY) === "500000") {
                  selectedVideoQuality = 2;
                } else if (localStorage.getItem(AppConstants.VIDEO_QUALITY) === "800000") {
                  selectedVideoQuality = 5;
                }

              }
              if (selectedVideoQuality) {
                currentKalturaPlayer.selectTrack(currentKalturaPlayer.getTracks()[selectedVideoQuality]);
              }
            }
          });
        }

      });
      this.kalturaPlayer.addEventListener('error', (event) => {
        if (this.entries) {
          if (this.entries.entries.length > 0) {
            if (this.kalturaPlayer) {
              this.kalturaPlayer.reset();
            }
            this.episodeId.emit(+event.target._mediaInfo.entryId);
            this.showPlayer = !this.showPlayer;
            this.getAssetDetails(event.target._mediaInfo.entryId);
          }
        }
        if (!this.entries) {
          this.snackbarUtilService.showSnackbar("Something went wrong")
        }
        this.showPlayer = !this.showPlayer;
        let moeEventStatus = 'other_error'
        this.addMoengageEvent(this.assetDetail, moeEventStatus);
        if (this.isAssetInWatchlist) {
          this.addMoeEventForWatchlist('play_error')
        }
      });

      this.kalturaPlayer.addEventListener(this.kalturaPlayer.Event.UI.USER_ENTERED_FULL_SCREEN, (event) => {
        if (event) {
          screen.orientation.lock("landscape");
        }
      })

      if (this.entries) {
        if (this.entries.entries.length > 0) {
          this.kalturaPlayer.loadPlaylistByEntryList(this.entries, { options: { autoContinue: this.autoplayNext } }, { countdown: { duration: this.assetDetail.tags.Creditstart ? this.assetDetail.mediaFiles[0].duration - (this.assetDetail.tags.Creditstart.objects[0].value) / 1000 : 30 } });
        } else {
          this.kalturaPlayer.loadMedia(info);
        }
      } else {
        this.kalturaPlayer.loadMedia(info);
      }
      this.showPlayer = true;
      this.loading = false;
      this.kalturaPlayer.ready().then(() => {
        if (this.isLive || this.isCatchup) {
          try {
            $("#player-gui").parent().append('<div class="playkit-watermark playkit-top playkit-right"><a target="_blank" rel="noopener noreferrer"><img src=' + this.channelLogo + '></a></div>');
          } catch (e) {
            //WooHoo!!!
          }
        }
        let selectedVideoQuality = 0;
        let currentKalturaPlayer = KalturaPlayer.getPlayer("kalturaPlayerTargetId");
        let currentVideoTracks = currentKalturaPlayer.getTracks(currentKalturaPlayer.Track.VIDEO);
        if (currentVideoTracks.length >= 6) {
          if (localStorage.getItem(AppConstants.VIDEO_QUALITY)) {
            if (localStorage.getItem(AppConstants.VIDEO_QUALITY) === '300000') {
              selectedVideoQuality = 1;
            } else if (localStorage.getItem(AppConstants.VIDEO_QUALITY) === "500000") {
              selectedVideoQuality = 2;
            } else if (localStorage.getItem(AppConstants.VIDEO_QUALITY) === "800000") {
              selectedVideoQuality = 5;
            }

          }
          if (selectedVideoQuality) {
            currentKalturaPlayer.selectTrack(currentKalturaPlayer.getTracks()[selectedVideoQuality]);
          }
        }
        if (this.appUtilService.checkIfPWA()) {
          $(document).ready(() => {
            $(".playkit-unmute-button-container").css("left", "65px");
          });
        }
      });

      return this.kalturaPlayer;
    } catch (e) {
      if (environment.env === "dev") {
        console.error(e.message)
      }
    }
  }
  getNextEpisodeDetail(id: any) {
    this.kalturaAppService.getMediaAssetById(id).then((res) => {
      if (res) {
        this.assetDetail = res;
      }
    })
  }

  getSeriesList(seriesId: any, seasonNumber?: any): Entries {
    this.entries = {
      entries: []
    }
    // this.kalturaAppService.getEpisodeCountInSeries(seriesId, this.mediaType).then(res => {
      this.kalturaAppService.getNumberOfEpisodesInSeason(seriesId, seasonNumber, this.mediaType, 1, 150).then(res => {
      this.entries.entries = [];
      let addToPlaylist = false;
      if (res.objects) {
        this.seriesList = res.objects;
      }
      // if (this.seriesList.metas['Season number'].value)
      this.seriesList = this.seriesList.sort((a: any, b: any) => {
        if (b.metas['Season number'] && b.metas['Episode number'] && a.metas['Season number'] && a.metas['Episode number']) {
          let na = parseInt(a.metas['Season number'].value + '' + a.metas['Episode number'].value);
          let nb = parseInt(b.metas['Season number'].value + '' + b.metas['Episode number'].value);

          if (na > nb) {
            return 1;
          } else if (na < nb) {
            return -1;
          }
          return 0;
        }
      })
      this.seriesList.forEach(element => {
        if (element.metas['Season number'] && element.metas['Episode number']) {
          let entryIds = new EntryIds();
          entryIds.entryId = element.id.toString();
          if (this.assetId === entryIds.entryId) {
            addToPlaylist = true;
          }
          if (addToPlaylist) {
            this.entries.entries.push(entryIds);
          }
        }

      })
    }, reject => {

    })
    this.entries.entries = this.entries.entries.filter((el, i, a) => i === a.indexOf(el))
    return this.entries;

  }

  addMoengageEvent(assetDetail: any, status: string) {
    let playEvent: any = null;
    if (assetDetail) {
      if (this.assetDetail.type === parseInt(this.DMS.params.MediaTypes.WebEpisode)) {
        playEvent = {
          asset_ID: assetDetail.id,
          asset_title: assetDetail.name,
          asset_genre: assetDetail.tags.Genre ? assetDetail.tags.Genre.objects[0].value : null,
          asset_subgenre: null,
          asset_mediatype: this.appUtilService.getMediaTypeNameById(assetDetail.type),
          asset_monetization: assetDetail.metas['Is Premium'] ? assetDetail.metas['Is Premium'].value : null,
          asset_language: null,
          asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
          asset_series_name: assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null,
          asset_episode_number: assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null,
          status: status
        }
      } else if (this.assetDetail.type === parseInt(this.DMS.params.MediaTypes.UGCVideo)) {
        playEvent = {
          asset_ID: assetDetail.id,
          asset_title: assetDetail.name,
          asset_genre: assetDetail.tags.Genre ? assetDetail.tags.Genre.objects[0].value : null,
          asset_subgenre: null,
          asset_mediatype: this.appUtilService.getMediaTypeNameById(assetDetail.type),
          asset_monetization: assetDetail.metas['Is Premium'] ? assetDetail.metas['Is Premium'].value : null,
          asset_language: null,
          asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
          asset_creator_name: assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null,
          status: status
        }
      } else {
        playEvent = {
          asset_ID: assetDetail.id,
          asset_title: assetDetail.name,
          asset_genre: assetDetail.tags.Genre ? assetDetail.tags.Genre.objects[0].value : null,
          asset_subgenre: null,
          asset_mediatype: this.appUtilService.getMediaTypeNameById(assetDetail.type),
          asset_monetization: assetDetail.metas['Is Premium'] ? assetDetail.metas['Is Premium'].value : null,
          asset_language: null,
          asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
          status: status
        }
      }
      playEvent.user_type = this.UserCategory;
      this.appUtilService.moEngageEventTracking("VIDEO_PLAYED", playEvent);
    }

  }
  addMoeEventForWatchlist(status: string) {
    let watchlistPlayEvent = {
      source: 'watchlist_page',
      status: status
    }
    this.appUtilService.moEngageEventTracking("PLAY_WATCHLISTED_VIDEO", watchlistPlayEvent);
  }


  gtmTagForPlayerEvent(assetDetails: any, type: string) {
    let dataLayerJson: any;
    if (this.isLive) {
      dataLayerJson = {
        'asset_id': assetDetails.id,
        'asset_title': assetDetails.name,
        'asset_genre': assetDetails.tags.Genre ? assetDetails.tags.Genre.objects[0].value : null,
        'asset_sub_genre': assetDetails.tags["Sub Genre"] ? assetDetails.tags["Sub Genre"].objects[0].value : null,
        'asset_duration': assetDetails.mediaFiles[0] ? assetDetails.mediaFiles[0].duration : null,
        'asset_name': assetDetails.name,
        'channel_name': assetDetails.name,
        'epg_name': this.programAssetDetail ? this.programAssetDetail.name : null,
        'now_playing': this.programAssetDetail ? this.programAssetDetail.name : null,
        'asset_language': assetDetails.tags['Asset Language'] ? assetDetails.tags['Asset Language'].objects[0].value : null
      };
    } else {
      dataLayerJson = {
        'asset_id': assetDetails.id,
        'asset_title': assetDetails.name,
        'asset_genre': assetDetails.tags.Genre ? assetDetails.tags.Genre.objects[0].value : null,
        'asset_sub_genre': assetDetails.tags["Sub Genre"] ? assetDetails.tags["Sub Genre"].objects[0].value : null,
        'asset_duration': assetDetails.mediaFiles[0] ? assetDetails.mediaFiles[0].duration : null,
        'asset_name': assetDetails.name,
        'asset_language': assetDetails.tags['Asset Language'] ? assetDetails.tags['Asset Language'].objects[0].value : null
      };
    }
    this.appUtilService.getGTMTag(dataLayerJson, type);
  }

  getAssetDetails(assetId: string) {
    this.kalturaAppService.getMediaAssetById(assetId).then((res: any) => {
      this.assetDetail = res;
      this.initPlayer()
    }, reject => {
    })
  }

  getDeviceId() {
    var user: any = null;
    if (localStorage.getItem(AppConstants.UDID_KEY)) {
      if (localStorage.getItem(AppConstants.AUTH_HEADER_KEY)) {
        this.deviceId = localStorage.getItem(AppConstants.UDID_KEY);
        user = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS));
        this.deviceId += '_' + user.username;
      } else {
        this.deviceId = localStorage.getItem(AppConstants.UDID_KEY);
      }
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    try {
      if (document.getElementById('kalturaLib') !== null) {
        if (KalturaPlayer.getPlayer("kalturaPlayerTargetId")) {
          try {
            if (!KalturaPlayer.getPlayer("kalturaPlayerTargetId").isInPictureInPicture()) {
              this.kalturaPlayer.destroy()
            }
          } catch (e) {

          }
        }
      }
    } catch (e) {
      console.error(e)
    }

    clearInterval(this.freePlayInterval);
    if (this.platformIdentifierService.isBrowser()) {
      if (!this.appUtilService.isUserLoggedIn()) {
        this.modalService.dismissAll();
      }
    }
  }


  addMoengageEventParentalRating(assetDetail: any, errorDetails?: string, isParentalRatingSuccss?: boolean) {
    let playEvent: any = null;
    let userDetails: any;
    let utmParams: any;
    if (JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS))) {
      userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
    }
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      utmParams = params;
    });
    if (assetDetail && isParentalRatingSuccss === false) {
      if (this.assetDetail.type === parseInt(this.DMS.params.MediaTypes.WebEpisode)) {
        playEvent = {
          user_id: userDetails !== undefined ? userDetails.UserID : null,
          mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
          email: userDetails !== undefined ? userDetails.EmailID : null,
          name: userDetails !== undefined ? userDetails.Name : null,
          utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
          utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
          utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
          asset_ID: assetDetail.id,
          asset_title: assetDetail.name,
          asset_genre: assetDetail.tags.Genre ? assetDetail.tags.Genre.objects[0].value : null,
          asset_subgenre: null,
          asset_mediatype: this.appUtilService.getMediaTypeNameById(assetDetail.type),
          asset_monetization: assetDetail.metas['Is Premium'] ? assetDetail.metas['Is Premium'].value : null,
          asset_language: null,
          asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
          asset_series_name: assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null,
          asset_episode_number: assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null,
          asset_cast: assetDetail.tags['Main Cast'] ? assetDetail.tags['Main Cast'].objects[0].value : null,
          asset_crew: assetDetail.tags['Director'] ? assetDetail.tags['Director'].objects[0].value : null,
          error_details: errorDetails
        }
      } else if (this.assetDetail.type === parseInt(this.DMS.params.MediaTypes.UGCVideo)) {
        playEvent = {
          user_id: userDetails !== undefined ? userDetails.UserID : null,
          mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
          email: userDetails !== undefined ? userDetails.EmailID : null,
          name: userDetails !== undefined ? userDetails.Name : null,
          utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
          utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
          utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
          asset_ID: assetDetail.id,
          asset_title: assetDetail.name,
          asset_genre: assetDetail.tags.Genre ? assetDetail.tags.Genre.objects[0].value : null,
          asset_subgenre: null,
          asset_mediatype: this.appUtilService.getMediaTypeNameById(assetDetail.type),
          asset_monetization: assetDetail.metas['Is Premium'] ? assetDetail.metas['Is Premium'].value : null,
          asset_language: null,
          asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
          asset_creator_name: assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null,
          error_details: errorDetails
        }
      } else {
        playEvent = {
          user_id: userDetails !== undefined ? userDetails.UserID : null,
          mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
          email: userDetails !== undefined ? userDetails.EmailID : null,
          name: userDetails !== undefined ? userDetails.Name : null,
          utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
          utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
          utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
          asset_ID: assetDetail.id,
          asset_title: assetDetail.name,
          asset_genre: assetDetail.tags.Genre ? assetDetail.tags.Genre.objects[0].value : null,
          asset_subgenre: null,
          asset_mediatype: this.appUtilService.getMediaTypeNameById(assetDetail.type),
          asset_monetization: assetDetail.metas['Is Premium'] ? assetDetail.metas['Is Premium'].value : null,
          asset_language: null,
          asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
          asset_cast: assetDetail.tags['Main Cast'] ? assetDetail.tags['Main Cast'].objects[0].value : null,
          asset_crew: assetDetail.tags['Director'] ? assetDetail.tags['Director'].objects[0].value : null,
          error_details: errorDetails
        }
      }
      this.appUtilService.moEngageEventTracking("PLAYBACK_ERROR", playEvent);
    } else if (assetDetail && isParentalRatingSuccss === true) {
      playEvent = {
        user_id: userDetails !== undefined ? userDetails.UserID : null,
        mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
        email: userDetails !== undefined ? userDetails.EmailID : null,
        name: userDetails !== undefined ? userDetails.Name : null,
        utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
        utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
        utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null
      }
      this.appUtilService.moEngageEventTracking("PARENTAL_RATING", playEvent);
    }
  }

  moengageEventForVideoStopped(assetDetail: any, current_video_duration: number) {
    let playEvent: any = null;
    let userDetails: any;
    let utmParams: any;
    if (JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS))) {
      userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
    }
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      utmParams = params;
    });
    if (assetDetail) {
      if (this.assetDetail.type === parseInt(this.DMS.params.MediaTypes.WebEpisode)) {
        playEvent = {
          user_id: userDetails !== undefined ? userDetails.UserID : null,
          mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
          email: userDetails !== undefined ? userDetails.EmailID : null,
          name: userDetails !== undefined ? userDetails.Name : null,
          utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
          utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
          utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
          asset_ID: assetDetail.id,
          asset_title: assetDetail.name,
          asset_genre: assetDetail.tags.Genre ? assetDetail.tags.Genre.objects[0].value : null,
          asset_subgenre: null,
          asset_mediatype: this.appUtilService.getMediaTypeNameById(assetDetail.type),
          asset_monetization: assetDetail.metas['Is Premium'] ? assetDetail.metas['Is Premium'].value : null,
          asset_language: null,
          asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
          asset_series_name: assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null,
          asset_episode_number: assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null,
          asset_cast: assetDetail.tags['Main Cast'] ? assetDetail.tags['Main Cast'].objects[0].value : null,
          asset_crew: assetDetail.tags['Director'] ? assetDetail.tags['Director'].objects[0].value : null,
          video_stopped_duration: current_video_duration
        }
      } else if (this.assetDetail.type === parseInt(this.DMS.params.MediaTypes.UGCVideo)) {
        playEvent = {
          user_id: userDetails !== undefined ? userDetails.UserID : null,
          mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
          email: userDetails !== undefined ? userDetails.EmailID : null,
          name: userDetails !== undefined ? userDetails.Name : null,
          utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
          utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
          utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
          asset_ID: assetDetail.id,
          asset_title: assetDetail.name,
          asset_genre: assetDetail.tags.Genre ? assetDetail.tags.Genre.objects[0].value : null,
          asset_subgenre: null,
          asset_mediatype: this.appUtilService.getMediaTypeNameById(assetDetail.type),
          asset_monetization: assetDetail.metas['Is Premium'] ? assetDetail.metas['Is Premium'].value : null,
          asset_language: null,
          asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
          asset_creator_name: assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null,
          video_stopped_duration: current_video_duration
        }
      } else {
        playEvent = {
          user_id: userDetails !== undefined ? userDetails.UserID : null,
          mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
          email: userDetails !== undefined ? userDetails.EmailID : null,
          name: userDetails !== undefined ? userDetails.Name : null,
          utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
          utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
          utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
          asset_ID: assetDetail.id,
          asset_title: assetDetail.name,
          asset_genre: assetDetail.tags.Genre ? assetDetail.tags.Genre.objects[0].value : null,
          asset_subgenre: null,
          asset_mediatype: this.appUtilService.getMediaTypeNameById(assetDetail.type),
          asset_monetization: assetDetail.metas['Is Premium'] ? assetDetail.metas['Is Premium'].value : null,
          asset_language: null,
          asset_parental_rating: assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
          asset_cast: assetDetail.tags['Main Cast'] ? assetDetail.tags['Main Cast'].objects[0].value : null,
          asset_crew: assetDetail.tags['Director'] ? assetDetail.tags['Director'].objects[0].value : null,
          video_stopped_duration: current_video_duration
        }
      }
      this.appUtilService.moEngageEventTracking("VIDEO_STOPPED", playEvent);
    }
  }

  addGTMTagForPlaybackErrorAndParentalRating(assetDetail: any, errorDetails?: string, isParentalRatingSuccss?: boolean) {
    let playEvent: any = null;
    let userDetails: any;
    let utmParams: any;
    if (JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS))) {
      userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
    }
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      utmParams = params;
    });
    if (assetDetail && isParentalRatingSuccss === false) {
      if (this.assetDetail.type === parseInt(this.DMS.params.MediaTypes.WebEpisode)) {
        playEvent = {
          'user_id': userDetails !== undefined ? userDetails.UserID : null,
          'mobile_number': userDetails !== undefined ? userDetails.MobileNo : null,
          'email': userDetails !== undefined ? userDetails.EmailID : null,
          'name': userDetails !== undefined ? userDetails.Name : null,
          'utm_source': utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
          'utm_medium': utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
          'utm_campaign': utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
          'asset_id': assetDetail.id,
          'asset_title': assetDetail.name,
          'asset_genre': assetDetail.tags.Genre ? assetDetail.tags.Genre.objects[0].value : null,
          'asset_subgenre': null,
          'asset_mediatype': this.appUtilService.getMediaTypeNameById(assetDetail.type),
          'asset_monetization': assetDetail.metas['Is Premium'] ? assetDetail.metas['Is Premium'].value : null,
          'asset_language': assetDetail.tags['Asset Language'] ? assetDetail.tags['Asset Language'].objects[0].value : null,
          'asset_parental_rating': assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
          'asset_series_name': assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null,
          'asset_episode_number': assetDetail.metas['Episode number'] ? assetDetail.metas['Episode number'].value : null,
          'asset_cast': assetDetail.tags['Main Cast'] ? assetDetail.tags['Main Cast'].objects[0].value : null,
          'asset_crew': assetDetail.tags['Director'] ? assetDetail.tags['Director'].objects[0].value : null,
          'error_details': errorDetails
        }
      } else if (this.assetDetail.type === parseInt(this.DMS.params.MediaTypes.UGCVideo)) {
        playEvent = {
          'user_id': userDetails !== undefined ? userDetails.UserID : null,
          'mobile_number': userDetails !== undefined ? userDetails.MobileNo : null,
          'email': userDetails !== undefined ? userDetails.EmailID : null,
          'name': userDetails !== undefined ? userDetails.Name : null,
          'utm_source': utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
          'utm_medium': utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
          'utm_campaign': utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
          'asset_id': assetDetail.id,
          'asset_title': assetDetail.name,
          'asset_genre': assetDetail.tags.Genre ? assetDetail.tags.Genre.objects[0].value : null,
          'asset_subgenre': null,
          'asset_mediatype': this.appUtilService.getMediaTypeNameById(assetDetail.type),
          'asset_monetization': assetDetail.metas['Is Premium'] ? assetDetail.metas['Is Premium'].value : null,
          'asset_language': assetDetail.tags['Asset Language'] ? assetDetail.tags['Asset Language'].objects[0].value : null,
          'asset_parental_rating': assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
          'asset_creator_name': assetDetail.tags['Series Name'] ? assetDetail.tags['Series Name'].objects[0].value : null,
          'error_details': errorDetails
        }
      } else {
        playEvent = {
          'user_id': userDetails !== undefined ? userDetails.UserID : null,
          'mobile_number': userDetails !== undefined ? userDetails.MobileNo : null,
          'email': userDetails !== undefined ? userDetails.EmailID : null,
          'name': userDetails !== undefined ? userDetails.Name : null,
          'utm_source': utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
          'utm_medium': utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
          'utm_campaign': utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
          'asset_id': assetDetail.id,
          'asset_title': assetDetail.name,
          'asset_genre': assetDetail.tags.Genre ? assetDetail.tags.Genre.objects[0].value : null,
          'asset_subgenre': null,
          'asset_mediatype': this.appUtilService.getMediaTypeNameById(assetDetail.type),
          'asset_monetization': assetDetail.metas['Is Premium'] ? assetDetail.metas['Is Premium'].value : null,
          'asset_language': assetDetail.tags['Asset Language'] ? assetDetail.tags['Asset Language'].objects[0].value : null,
          'asset_parental_rating': assetDetail.tags['Parental Rating'] ? assetDetail.tags['Parental Rating'].objects[0].value : null,
          'asset_cast': assetDetail.tags['Main Cast'] ? assetDetail.tags['Main Cast'].objects[0].value : null,
          'asset_crew': assetDetail.tags['Director'] ? assetDetail.tags['Director'].objects[0].value : null,
          'error_details': errorDetails
        }
      }
      this.appUtilService.getGTMTag(playEvent, "playback_error");
    } else if (assetDetail && isParentalRatingSuccss === true) {
      playEvent = {
        'user_id': userDetails !== undefined ? userDetails.UserID : null,
        'mobile_number': userDetails !== undefined ? userDetails.MobileNo : null,
        'email': userDetails !== undefined ? userDetails.EmailID : null,
        'name': userDetails !== undefined ? userDetails.Name : null,
        'utm_source': utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
        'utm_medium': utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
        'utm_campaign': utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
        'asset_language': assetDetail.tags['Asset Language'] ? assetDetail.tags['Asset Language'].objects[0].value : null,
      }
      this.appUtilService.getGTMTag(playEvent, "parental_rating");
    }
  }

  addGTMTagForVideoStopped(assetDetails: any) {
    let dataLayerJson: any;
    let userDetails: any;
    let utmParams: any;
    if (JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS))) {
      userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
    }
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
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
      'asset_cast': assetDetails.tags['Main Cast'] ? assetDetails.tags['Main Cast'].objects[0].value : null,
      'asset_crew': assetDetails.tags.Director ? assetDetails.tags.Director.objects[0].value : null,
      'video_stopped_duration': !this.isLive ? this.kalturaPlayer.currentTime.toFixed() : null,
      'asset_mediatype': this.appUtilService.getMediaTypeNameById(this.assetDetail.type),
      'asset_monetization': this.assetDetail.metas['Is Premium'] ? this.assetDetail.metas['Is Premium'].value : null,
      'asset_parental_rating': this.assetDetail.tags['Parental Rating'] ? this.assetDetail.tags['Parental Rating'].objects[0].value : null,
      'asset_series_name': this.assetDetail.tags['Series Name'] ? this.assetDetail.tags['Series Name'].objects[0].value : null,
      'asset_episode_number': this.assetDetail.metas['Episode number'] ? this.assetDetail.metas['Episode number'].value : null,
      'asset_creator_name': this.appUtilService.getMediaTypeNameById(this.assetDetail.type) === 'UGC Video' ? this.assetDetail.tags['Series Name'].objects[0].value : null,
      'asset_id': assetDetails.id,
      'asset_title': assetDetails.name,
      'asset_genre': assetDetails.tags.Genre ? assetDetails.tags.Genre.objects[0].value : null,
      'asset_subgenre': assetDetails.tags["Sub Genre"] ? assetDetails.tags["Sub Genre"].objects[0].value : null,
      'asset_language': assetDetails.tags['Asset Language'] ? assetDetails.tags['Asset Language'].objects[0].value : null
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'video_stopped');
  }

  showLoginPopup() {
    const modalRef = this.modalService.open(SignInSignUpModalComponent);
    modalRef.result.then((data) => {
      this.appUtilService.playPlayer();
    }, (reason) => {
      this.appUtilService.playPlayer();
    });
  }

  gtmTagEventClickOnSkipIntroButton(assetDetails: any, status: string) {
    let dataLayerJson = {
      'asset_title': assetDetails.name,
      'asset_genre': assetDetails.tags.Genre ? assetDetails.tags.Genre.objects[0].value : null
    }
    this.appUtilService.getGTMTag(dataLayerJson, status);
  }

  gtmTagEventClickOnCreditSkipButton(assetDetails: any, status: string) {
    let dataLayerJson = {
      'asset_title': assetDetails.name,
      'asset_genre': assetDetails.tags.Genre ? assetDetails.tags.Genre.objects[0].value : null
    }
    this.appUtilService.getGTMTag(dataLayerJson, status);
  }

  moEngageEventForSkipIntroButton(assetDetails: any, status: string) {
    let attribute = {
      'asset_title': assetDetails.name,
      'asset_genre': assetDetails.tags.Genre ? assetDetails.tags.Genre.objects[0].value : null,
      'user_type': this.appUtilService.getUserTypeAsName()
    }
    this.appUtilService.moEngageEventTracking(status, attribute);
  }

  moEngageEventForCreditSkipButton(assetDetails: any, status: string) {
    let attribute = {
      'asset_title': assetDetails.name,
      'asset_genre': assetDetails.tags.Genre ? assetDetails.tags.Genre.objects[0].value : null,
      'user_type': this.appUtilService.getUserTypeAsName()
    }
    this.appUtilService.moEngageEventTracking(status, attribute);
  }

  isFTATagOnLiveChannels(assetDetails: any) {
    if (this.platformIdentifierService.isBrowser()) {
      this.freePlayCount = localStorage.getItem('freePlayCount') ? +localStorage.getItem('freePlayCount') : 0;

      if (!localStorage.getItem('ftaDate')) {
        localStorage.setItem('ftaDate', new Date().getDate().toString());
      } else if (this.freePlayCount >= assetDetails.metas.FreePlay.value && localStorage.getItem('ftaDate').toString() !== new Date().getDate().toString()) {
        localStorage.removeItem('freePlayCount');
        this.freePlayCount = 0;
        localStorage.setItem('ftaDate', new Date().getDate().toString());
      }

      this.freePlayInterval = setInterval(() => {
        if (this.freePlayCount < assetDetails.metas.FreePlay.value) {
          this.freePlayCount = this.freePlayCount + 1;
          localStorage.setItem('freePlayCount', this.freePlayCount.toString());
        }
        setTimeout(() => {
          if (this.freePlayCount >= assetDetails.metas.FreePlay.value) {
            clearInterval(this.freePlayInterval);
            this.loading = false;
            this.appUtilService.pausePlayer();
            this.modalService.open(SignInSignUpModalComponent);
            this.snackbarUtilService.showError("Please login to view this content");
          }
        }, assetDetails.metas.FreePlay.value + 1);
      }, 1000);
    }
  }

  getSubscriptionHistory() {
    if (this.platformIdentifierService.isBrowser()) {
      this.userFormService.getSubscriptionHistory(this.appUtilService.getLoggedInUserSMSDetails().OTTSubscriberID).subscribe((res: any) => {
        if (res.ResultCode === 0) {
          if (res.Result.length > 0) {
            for (let result of res.Result) {
              if (result.SubscriptionStatus.toLowerCase() === "active" && result.SubscriptionCategory.toLowerCase() === 'watcho') {
                if (new Date(result.SubscriptionEndDate).getTime() >= new Date().getTime()) {
                  this.isSubscriptionEndData = true;
                  this.initPlayer();
                  this.entries = this.getSeriesList(this.seriesId, this.seasonNumber);
                  return;
                }
              }
            }
          }
        }
        this.isSubscriptionEndData = false;
        this.initPlayer();
        this.entries = this.getSeriesList(this.seriesId, this.seasonNumber);
        return;
      }, error => {
        this.isSubscriptionEndData = false;
        this.initPlayer();
        this.entries = this.getSeriesList(this.seriesId, this.seasonNumber);
      });
    }
  }

  showPrecedeTextAndNatureOfContentOnPlayer() {
    if (!this.isProgram && !this.ugcPlayerFound) {
      let isPrecedeText: boolean = this.assetDetail.metas["PrecedeText "] ? this.assetDetail.metas["PrecedeText "].value !== '' ? true : false : false;
      let isNatureOfContent: boolean = this.assetDetail.tags["NatureOfContent"] ? this.kalturaUtilService.getTagsObjectValue(this.assetDetail.tags["NatureOfContent"]) !== '' ? true : false : false;
      if (isPrecedeText && isNatureOfContent) {
        $("#player-gui").parent().append('<div class="asset-detail-onplayer">' +
          '<div class="player-add-asset-detail">' +
          '<div class="precede-text">' + this.assetDetail.metas["PrecedeText "].value + '</div>' +
          '<div class="asset-genre-time-rating">' +
          '<span class="nature-of-content">' + this.kalturaUtilService.getTagsObjectValue(this.assetDetail.tags["NatureOfContent"]) + '</span>' +
          '</div>' +
          '</div>' +
          '</div>');
      } else if (isPrecedeText && !isNatureOfContent) {
        $("#player-gui").parent().append('<div class="asset-detail-onplayer">' +
        '<div class="player-add-asset-detail">' +
        '<div class="precede-text">' + this.assetDetail.metas["PrecedeText "].value + '</div>' +
        '</div>' +
        '</div>');
      } else if (!isPrecedeText && isNatureOfContent) {
        $("#player-gui").parent().append('<div class="asset-detail-onplayer">' +
        '<div class="player-add-asset-detail">' +
        '<div class="asset-genre-time-rating">' +
        '<span class="nature-of-content">' + this.kalturaUtilService.getTagsObjectValue(this.assetDetail.tags["NatureOfContent"]) + '</span>' +
        '</div>' +
        '</div>' +
        '</div>');
      }
    }
  }
}

