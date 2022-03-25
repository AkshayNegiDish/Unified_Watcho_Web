import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { AppConstants } from '../../../../../shared/typings/common-constants';
import { ActivatedRoute, ParamMap } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.scss']
})
export class AssetDetailComponent implements OnInit {

  @Input()
  assetDetails: any;

  @Input()
  episodeCount?: any = null;

  isMobileView: boolean;
  isBrowser: any;

  showMeta: boolean = false;
  DMS: any;
  SubtitleLanguage: string;


  constructor(@Inject(PLATFORM_ID) private platformId, private kalturaAppService: KalturaAppService, private kalturaUtilService: KalturaUtilService,
    private appUtilService: AppUtilService, private activatedRoute: ActivatedRoute) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.SubtitleLanguage = null;
  }

  ngOnInit() {
    this.DMS = this.appUtilService.getDmsConfig();
    if (this.assetDetails.type === this.DMS.params.MediaTypes.UGCVideo) {
      this.showMeta = false;
    } else {
      this.showMeta = true;
      this.SubtitleLanguage = this.kalturaUtilService.getTagsObjectValue(this.assetDetails.tags['SubtitleLanguage']);
    }
    if (this.assetDetails) {
      // this.getAssetDetail();
      this.detailsPageVisited(this.assetDetails.type);
    }



    if ($(window).width() < 769) {
      $('.cast-n-crew').slideUp(function () {
        $('.cast-n-crew').css('display', 'none');
      });

    }
  }

  toggle() {
    if (this.isBrowser) {
      $('.cast-n-crew').slideToggle('slow', () => {
        if ($('.cast-n-crew').css('display') == 'none') {
          this.gaTagLessButton();
          $('#btnToggle').html('More');

        }
        else {
          $('#btnToggle').html('Less');
          this.gaTagMoreButton();
        }
      });
    }
    this.appUtilService.moEngageEventTrackingWithNoAttribute("MORE_DETAILS_LINK_CLICKED");
  }

  // getAssetDetail() {
  //   let asset_type = "and asset_type='" + this.assetDetails.type + "'  TrailerParentRefId ~ '" + this.kalturaUtilService.getTagsObjectValue(this.assetDetails.tags['Ref Id']) + "'";
  //   let ksql = "(" + asset_type + ")";
  //   this.kalturaAppService.searchAsset(null, null, ksql, 1, 20).then(response => {
  //     if (response.totalCount > 0) {
  //       // this.showTrailer = true;
  //     } else {
  //       // this.showTrailer = false;
  //     }
  //   }, reject => {

  //   });
  // }

  gaTagMoreButton() {

  }


  gaTagLessButton() {

  }

  detailsPageVisited(id: number) {
    let detailsPageInfo: any;
    let userDetails: any;
    let utmParams: any;
    if (JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS))) {
      userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
    }
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      utmParams = params;
    });
    if (this.appUtilService.getMediaTypeNameById(id) === 'Spotlight Series') {
      detailsPageInfo = {
        user_id: userDetails !== undefined ? userDetails.UserID : null,
        mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
        email: userDetails !== undefined ? userDetails.EmailID : null,
        name: userDetails !== undefined ? userDetails.Name : null,
        utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
        utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
        utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
        page_location: 'spotlight_channel_page',
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: this.assetDetails.name,
        asset_cast: this.assetDetails.tags['Main Cast'] ? this.assetDetails.tags['Main Cast'].objects[0].value : null,
        asset_crew: this.assetDetails.tags['Director'] ? this.assetDetails.tags['Director'].objects[0].value : null,
        page_name: 'spotlight_series_page',
        status: 'page_load_successful'
      }
    } else if (this.appUtilService.getMediaTypeNameById(id) === 'UGC Video') {
      detailsPageInfo = {
        user_id: userDetails !== undefined ? userDetails.UserID : null,
        mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
        email: userDetails !== undefined ? userDetails.EmailID : null,
        name: userDetails !== undefined ? userDetails.Name : null,
        utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
        utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
        utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
        page_location: 'ugc_video_page',
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_creator_name: this.assetDetails.tags['Series Name'] ? this.assetDetails.tags['Series Name'].objects[0].value : null,
        page_name: 'ugc_video_page',
        status: 'page_load_successful'
      }
    } else if (this.appUtilService.getMediaTypeNameById(id) === 'Movie') {
      detailsPageInfo = {
        user_id: userDetails !== undefined ? userDetails.UserID : null,
        mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
        email: userDetails !== undefined ? userDetails.EmailID : null,
        name: userDetails !== undefined ? userDetails.Name : null,
        utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
        utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
        utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
        page_location: 'movie_page',
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_cast: this.assetDetails.tags['Main Cast'] ? this.assetDetails.tags['Main Cast'].objects[0].value : null,
        asset_crew: this.assetDetails.tags['Director'] ? this.assetDetails.tags['Director'].objects[0].value : null,
        page_name: 'movie_page',
        status: 'page_load_successful'
      }
    } else if (this.appUtilService.getMediaTypeNameById(id) === 'Web Series') {
      detailsPageInfo = {
        user_id: userDetails !== undefined ? userDetails.UserID : null,
        mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
        email: userDetails !== undefined ? userDetails.EmailID : null,
        name: userDetails !== undefined ? userDetails.Name : null,
        utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
        utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
        utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
        page_location: 'series_page',
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: this.assetDetails.name,
        asset_cast: this.assetDetails.tags['Main Cast'] ? this.assetDetails.tags['Main Cast'].objects[0].value : null,
        asset_crew: this.assetDetails.tags['Director'] ? this.assetDetails.tags['Director'].objects[0].value : null,
        page_name: 'series_page',
        status: 'page_load_successful'
      }
    } else if (this.appUtilService.getMediaTypeNameById(id) === 'Web Episode' || this.appUtilService.getMediaTypeNameById(id) === 'Spotlight Episode') {
      detailsPageInfo = {
        user_id: userDetails !== undefined ? userDetails.UserID : null,
        mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
        email: userDetails !== undefined ? userDetails.EmailID : null,
        name: userDetails !== undefined ? userDetails.Name : null,
        utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
        utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
        utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
        page_location: 'episode_page',
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: this.assetDetails.tags['Series Name'] ? this.assetDetails.tags['Series Name'].objects[0].value : null,
        asset_episode_number: this.assetDetails.metas['Episode number'].value,
        asset_cast: this.assetDetails.tags['Main Cast'] ? this.assetDetails.tags['Main Cast'].objects[0].value : null,
        asset_crew: this.assetDetails.tags['Director'] ? this.assetDetails.tags['Director'].objects[0].value : null,
        page_name: this.appUtilService.getMediaTypeNameById(id) === 'Web Episode' ? 'web_episode_page' : 'spotlight_episode_page',
        status: 'page_load_successful'
      }
    } else if (this.appUtilService.getMediaTypeNameById(id) === 'Short Film') {
      detailsPageInfo = {
        user_id: userDetails !== undefined ? userDetails.UserID : null,
        mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
        email: userDetails !== undefined ? userDetails.EmailID : null,
        name: userDetails !== undefined ? userDetails.Name : null,
        utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
        utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
        utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
        page_location: 'short_film_page',
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_cast: this.assetDetails.tags['Main Cast'] ? this.assetDetails.tags['Main Cast'].objects[0].value : null,
        asset_crew: this.assetDetails.tags['Director'] ? this.assetDetails.tags['Director'].objects[0].value : null,
        page_name: 'short_film_page',
        status: 'page_load_successful'
      }
    } else if (this.appUtilService.getMediaTypeNameById(id) === 'Clips') {
      detailsPageInfo = {
        user_id: userDetails !== undefined ? userDetails.UserID : null,
        mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
        email: userDetails !== undefined ? userDetails.EmailID : null,
        name: userDetails !== undefined ? userDetails.Name : null,
        utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
        utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
        utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
        page_location: 'clips_page',
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_cast: this.assetDetails.tags['Main Cast'] ? this.assetDetails.tags['Main Cast'].objects[0].value : null,
        asset_crew: this.assetDetails.tags['Director'] ? this.assetDetails.tags['Director'].objects[0].value : null,
        page_name: 'clips_page',
        status: 'page_load_successful'
      }
    } else if (this.appUtilService.getMediaTypeNameById(id) === 'Trailer') {
      detailsPageInfo = {
        user_id: userDetails !== undefined ? userDetails.UserID : null,
        mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
        email: userDetails !== undefined ? userDetails.EmailID : null,
        name: userDetails !== undefined ? userDetails.Name : null,
        utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
        utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
        utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
        page_location: 'trailer_page',
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_cast: this.assetDetails.tags['Main Cast'] ? this.assetDetails.tags['Main Cast'].objects[0].value : null,
        asset_crew: this.assetDetails.tags['Director'] ? this.assetDetails.tags['Director'].objects[0].value : null,
        page_name: 'trailer_page',
        status: 'page_load_successful'
      }
    }
    detailsPageInfo.user_type = this.appUtilService.getUserTypeAsName();
    this.appUtilService.moEngageEventTracking('DETAILS_PAGE_VISITED', detailsPageInfo);
  }


}
