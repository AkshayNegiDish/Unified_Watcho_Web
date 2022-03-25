import { Component, OnInit, Input, Inject, PLATFORM_ID, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { RailViewType } from '../../models/rail.model';
import { Images } from '../../typings/kaltura-response-typings';
import { KalturaUtilService } from '../../services/kaltura-util.service';
import { AppUtilService } from '../../services/app-util.service';
import { isPlatformBrowser } from '@angular/common';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { PlaceholderImage } from '../../typings/common-constants';
import { KalturaAppService } from '../../services/kaltura-app.service';
import { SnackbarUtilService } from '../../services/snackbar-util.service';
import { ViewPortService } from '../../services/view.port.service';

declare var $: any;

@Component({
  selector: 'app-railItemView',
  templateUrl: './railItemView.component.html',
  styleUrls: ['./railItemView.component.scss']
})
export class RailItemViewComponent implements OnInit, AfterViewInit {
  @Input()
  imagesAsset: Images[];

  @Input()
  assetId: number;

  @Input()
  viewType: string;

  @Input()
  isPremium: boolean;

  @Input()
  runtime: number;

  @Input()
  name: string;

  @Input()
  showDescription: boolean;

  @Input()
  episodeNumber: any;

  @Input()
  mediaType: number;

  @Input()
  watchedDuration: number = 0;

  @Input()
  liveNow?: boolean = false;

  @Input()
  assetDetail: any;

  @Output()
  outputEvent?= new EventEmitter<any>();

  @Input()
  isContinueWatching?: boolean = false;

  railViewType = RailViewType;
  thumbnailURL: string;
  randomColor: string;
  UGCCreatorMediaType: number;
  isUgc: boolean;
  isBrowser: any;
  solidColor: any;

  isImageLoaded: any;
  isChannel: boolean;
  showProgressBar: boolean = false;
  ngbProgressbarConfig: NgbProgressbarConfig;
  progressBarValue: number = 0;
  DMS: any;
  malePlaceHolder: string;
  femalePlaceHolder: string;
  duration: any;
  genres: any;
  browserDetails: any;
  safariFound: boolean = false;
  channelLogo: any;
  metadata: any;
  isMobileTabletView: boolean = false;
  isTabletView: boolean = false;
  isDesktop: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId, private kalturaUtilService: KalturaUtilService, public appUtilService: AppUtilService,
    private kalturaAppService: KalturaAppService, private snackbarUtilService: SnackbarUtilService, private viewPortService: ViewPortService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    // this.randomColor = this.appUtilService.getRandomGreyScaleColor();
    this.isUgc = false;
    this.solidColor = {
      'background': this.randomColor,
      'text-align': 'center',
      'vertical-align': 'middle',
    }

    this.isImageLoaded = false;
    this.showProgressBar = false;
    this.ngbProgressbarConfig = {
      max: 0,
      animated: true,
      striped: true,
      type: '',
      showValue: false,
      height: '10px'
    }
    this.malePlaceHolder = PlaceholderImage.MALE1;
    this.femalePlaceHolder = PlaceholderImage.FEMALE;
    // this.appUtilService.checkIfPWA
  }

  ngOnInit() {
    this.DMS = this.appUtilService.getDmsConfig('fbdfsd');
    this.UGCCreatorMediaType = +this.DMS.params.MediaTypes.UGCCreator;
    try {
      if (this.assetDetail.metas['Episode number'].value) {
        this.episodeNumber = this.assetDetail.metas['Episode number'].value;
      }

    } catch (e) {

    }


    if (this.assetDetail.images) {
      let preUrl = 'https://images-eus1.ott.kaltura.com/Service.svc/GetImage/p/487/entry_id/';
      if (this.UGCCreatorMediaType === this.mediaType) {
        this.isUgc = true;
        this.thumbnailURL = this.malePlaceHolder;
        this.showDescription = true;
        // this.isImageLoaded = true;
      } else {
        this.isUgc = false;
      }
      if (this.mediaType === +this.DMS.params.MediaTypes.Linear) {
        this.isChannel = true;
      } else {
        this.isChannel = false;
      }

      if (this.mediaType === +this.DMS.params.MediaTypes.Program) {
        if (new Date().getTime() / 1000 >= this.assetDetail.startDate && this.assetDetail.endDate >= new Date().getTime() / 1000) {
          this.liveNow = true;
        } else {
          this.liveNow = false;
        }
      } else {
        this.liveNow = false;
      }

      this.thumbnailURL = this.kalturaUtilService.getImageByOrientation(this.assetDetail.images, this.viewType, null, null, null, this.viewPortService.isMobile());
      if (this.thumbnailURL.indexOf('entry_id') < 0 && this.thumbnailURL.indexOf('placeholder-images') < 0) {
        this.thumbnailURL = preUrl + this.kalturaUtilService.getImageByOrientation(this.assetDetail.images, this.viewType, null, null, null, this.viewPortService.isMobile());
      }
      if (this.isContinueWatching) {
        this.showProgressBar = true;
      } else {
        this.showProgressBar = false;
      }
      this.assetDetail.images.forEach(element => {
        if (element.ratio === '1:1') {
          if (element.url.toString().match('entry_id')) {
            this.channelLogo = this.kalturaUtilService.transformImage(element.url, 100, 100, 100);
          } else {
            this.channelLogo = preUrl + this.kalturaUtilService.transformImage(element.url, 100, 100, 100);
          }
        }
      });
    }

    if (this.assetDetail.mediaFiles) {
      if (this.assetDetail.mediaFiles.length > 0) {
        this.duration = this.assetDetail.mediaFiles[0].duration;
      }

    }

    if (this.assetDetail.tags.Genre) {
      if (this.assetDetail.tags.Genre.objects.length > 0) {
        this.genres = this.assetDetail.tags.Genre.objects[0].value;
      }
    }
    if (this.isBrowser) {
      this.browserDetails = this.appUtilService.getBrowserDetails();
      if (this.browserDetails.browser === "Safari") {
        this.safariFound = true;
      }
    }

    this.getMetaDataToShow(this.mediaType);
    if (matchMedia('(max-width: 768px)').matches) {
      this.isMobileTabletView = true;
      this.isDesktop = false;
    }
    if (matchMedia('(max-width: 992px)').matches) {
      this.isTabletView = true;
      this.isDesktop = false;
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        $(".remove-continue-mobile").show();
      }
    }
  }

  closePopover(popover) {
    popover.close();
  }

  imageLoadEvent(event) {
    // event.target.setAttribute("style", "opacity: 1;padding: 0");
    this.isImageLoaded = true;
  }

  imageLoadError(event) {
    this.thumbnailURL = this.appUtilService.getDefaultThumbnail(this.viewType);
  }

  removeFromContinueWatching(event) {
    event.stopPropagation();
    this.kalturaAppService.searchHistoryCleanAction(this.assetDetail.id.toString()).then(res => {
      this.outputEvent.emit(true);
    }, reject => {
      this.snackbarUtilService.showError();
    });
  }

  blockedLinearChannel() {
    try {
      if (this.isDesktop) {
        if (this.assetDetail.type.toString() === this.DMS.params.MediaTypes.Program && this.assetDetail.linearAssetId === undefined) {
          this.snackbarUtilService.showSnackbar("Channel Available Only On Watcho App");
        }
      }
    } catch (e) { }
  }


  getMetaDataToShow(mediaType: number) {
    switch (mediaType) {
      case +this.DMS.params.MediaTypes.WebEpisode: {
        this.metadata = (this.assetDetail.name.length > 15) ? "E" + this.episodeNumber + " | " + this.assetDetail.name.substring(0, 15) + "..." : "E" + this.episodeNumber + " | " + this.assetDetail.name;
        break;
      };
      case +this.DMS.params.MediaTypes.SpotlightEpisode: {
        this.metadata = (this.assetDetail.name.length > 15) ? "E" + this.episodeNumber + " | " + this.assetDetail.name.substring(0, 15) + "..." : "E" + this.episodeNumber + " | " + this.assetDetail.name;
        break;
      };
      case +this.DMS.params.MediaTypes.UGCVideo: {
        this.metadata = (this.assetDetail.name.length > 20) ? this.assetDetail.name.substring(0, 20) + "..." : this.assetDetail.name;
        break;
      };
      case +this.DMS.params.MediaTypes.CreatorVideo: {
        this.metadata = (this.assetDetail.name.length > 20) ? this.assetDetail.name.substring(0, 20) + "..." : this.assetDetail.name;
        break;
      };
      case +this.DMS.params.MediaTypes.Program: {
        this.metadata = (this.assetDetail.name.length > 20) ? this.assetDetail.name.substring(0, 20) + "..." : this.assetDetail.name;
        break;
      };
    }
  }

}
