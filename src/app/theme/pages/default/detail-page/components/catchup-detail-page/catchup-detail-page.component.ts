import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { KalturaMediaType, AppConstants } from '../../../../../shared/typings/common-constants';
import { environment } from '../../../../../../../environments/environment';
import { ModalMessageService } from '../../../../../shared/services/modal-message.service';


@Component({
  selector: 'app-catchup-detail-page',
  templateUrl: './catchup-detail-page.component.html',
  styleUrls: ['./catchup-detail-page.component.scss']
})
export class CatchupDetailPageComponent implements OnInit {

  isBrowser;
  currentJustify: string;
  mediaAssetDetails: any;
  channelDetails: any[];
  externalChannelId: any;
  isImageLoaded: boolean;
  channelAssetDetails: any;
  DMS: any;
  screenId: any;
  isDetailPage: boolean = true;
  programId: string;
  duration: number;
  videoDuration: string;
  browserDetails: any;
  fileIdIn: any;
  channelId: number;
  isImagLoaded: boolean;
  reinitiatePlayer: boolean = true;


  constructor(@Inject(PLATFORM_ID) private platformId, private activatedRoute: ActivatedRoute,
    private kalturaAppService: KalturaAppService, private titleService: Title, private modalMessageService: ModalMessageService,
    public kalturaUtilService: KalturaUtilService, public appUtilService: AppUtilService, private router: Router, private platformIdentifierService: PlatformIdentifierService) {
    this.currentJustify = "fill";
    this.isBrowser = isPlatformBrowser(platformId);

    if (platformIdentifierService.isBrowser()) {
      this.browserDetails = this.appUtilService.getBrowserDetails();
    }

    this.modalMessageService.messageCommonObj$.subscribe((res: boolean) => {
      if (!res) {
        this.reinitiatePlayer = true;
      } else {
        this.reinitiatePlayer = false;
      }
    })
  }

  ngOnInit() {
    this.DMS = this.appUtilService.getDmsConfig('catchup');
    this.screenId = environment.ENVEU.SCREEN_IDS.CATCHUP_DETAIL;;


    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.programId = params.get('assetId');
      this.getMediaAssetDetails(this.programId.toString());
    })

  }

  getMediaAssetDetails(programId: string) {
    this.kalturaAppService.getMediaAssetById(programId, "epg_internal").then(response => {
      this.mediaAssetDetails = response;
      this.duration = (this.mediaAssetDetails.endDate) - (this.mediaAssetDetails.startDate);
      this.videoDuration = this.getMediaTime(this.duration)
      this.channelId = this.mediaAssetDetails.linearAssetId;
      this.getChannelDetails(this.mediaAssetDetails.linearAssetId.toString())
      this.detailsPageVisited(this.mediaAssetDetails.type);
    }, reject => {
      // console.error(reject);
    })
  }

  getChannelDetails(linearAssetId: string) {
    this.kalturaAppService.getMediaAssetById(linearAssetId).then((res: any) => {
      this.channelAssetDetails = res;
      for (let mediaFile of this.channelAssetDetails.mediaFiles) {
        if (this.browserDetails.browser === "Safari" && mediaFile.type === KalturaMediaType.HLS_MAIN) {
          this.fileIdIn = mediaFile.id.toString();
        } else if (this.browserDetails.browser !== "Safari" && mediaFile.type === KalturaMediaType.DASH_MAIN) {
          this.fileIdIn = mediaFile.id.toString();
        }
      }
    }, reject => {

    })
  }

  preventPropagation(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
  }



  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.titleService.setTitle("");
  }

  onImageLoaded(event) {
    this.isImageLoaded = true;
    this.isImagLoaded = true;
  }

  playEvent() {

  }


  imageLoadError(event) {
    event.target.src = this.appUtilService.getDefaultThumbnail('LANDSCAPE');
  }

  getMediaTime(val: number) {
    var hrs = Math.floor(val / 3600);
    var mins = Math.floor((val % 3600) / 60);
    var secs = val % 60;
    var ret = "";
    if (hrs > 0) {
      if (mins > 0 && secs === 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" + mins : mins) + " min";
      }
      else if (secs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" + mins : mins) + ":" + secs + " sec";
      } else {
        ret = '' + hrs + ' hr'
      }

    }
    else if (mins > 0) {
      ret += mins + " min";
    }
    return ret;
  }

  detailsPageVisited(id: number) {
    let detailsPageInfo: any;
    let mediaAssetDetail: any;
    let userDetails: any
    let utmParams: any;
    mediaAssetDetail = this.mediaAssetDetails;
    if (JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS))) {
      userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
    }
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      utmParams = params;
    });
    if (this.appUtilService.getMediaTypeNameById(id) === 'Program') {
      detailsPageInfo = {
        user_id: userDetails !== undefined ? userDetails.UserID : null,
        mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
        email: userDetails !== undefined ? userDetails.EmailID : null,
        name: userDetails !== undefined ? userDetails.Name : null,
        utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
        utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
        utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
        page_location: 'tvshow_page',
        asset_ID: mediaAssetDetail.id,
        asset_title: mediaAssetDetail.name,
        asset_genre: mediaAssetDetail.tags['Genres'] ? mediaAssetDetail.tags['Genres'].objects[0].value : null,
        asset_mediatype: mediaAssetDetail.type,
        asset_series_name: mediaAssetDetail.metas['Series_Name'] ? mediaAssetDetail.metas['Series_Name'].value : null,
        asset_episode_number: mediaAssetDetail.metas['Episode Number'] ? mediaAssetDetail.metas['Episode Number'].value : null,
        status: 'page_load_successful'
      }
    }
    this.appUtilService.moEngageEventTracking('DETAILS_PAGE_VISITED', detailsPageInfo);
  }
}
