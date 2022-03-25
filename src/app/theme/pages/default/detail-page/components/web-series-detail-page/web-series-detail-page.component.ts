import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { AppConstants } from '../../../../../shared/typings/common-constants';
import { isBrowser } from '@angular/animations/browser/src/render/shared';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-web-series-detail-page',
  templateUrl: './web-series-detail-page.component.html',
  styleUrls: ['./web-series-detail-page.component.scss']
})
export class WebSeriesDetailPageComponent implements OnInit {

  isDetailPage: boolean;
  assetId: number;
  assetDetails: any;
  episodeCount: number;
  screenId: string;
  DMS: any;
  // pageSubscription: Subscription;
  railData: any;
  clipRail: any;
  loading: boolean;
  seriesId: string;
  seasonsArray: any[] = [];
  isBrowserr: boolean;
  showLike: boolean = false;
  showRating: boolean = false;

  constructor(private kalturaAppService: KalturaAppService, private route: ActivatedRoute
    , private titleService: Title, private router: Router, private appUtilService: AppUtilService,
    public kalturaUtilService: KalturaUtilService, private snackbarUtilService: SnackbarUtilService, @Inject(DOCUMENT) private dom,
    private platformIdentifierService: PlatformIdentifierService, private meta: Meta, @Inject(PLATFORM_ID) private platformId ) {
    this.isDetailPage = true;
    this.railData = null;
    this.clipRail = null;
    this.isBrowserr = isPlatformBrowser(platformId);

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
  }

  ngOnInit() {
    if(this.isBrowserr) {
      this.DMS = this.appUtilService.getDmsConfig();
      this.screenId = environment.ENVEU.SCREEN_IDS.WEB_SERIES_DETAIL;;
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.assetId = +params.get('assetId');
        this.getAssetDetails(this.assetId.toString());
      })
    } else {
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.assetId = +params.get('assetId');
        this.seoTitleSetAsset(this.assetId.toString());
      })
      let url = this.router.url.split('/');
      let urlArray = url[4];
      for (let i = 0; i<urlArray.length; i++) {
        if (!urlArray.charAt(i).match('[a-z 0-9]')) {
          urlArray = urlArray.replace(urlArray.charAt(i), ' ');
        }
        if (urlArray.charAt(i) === '-') {
          urlArray = urlArray.replace(urlArray[i], ' ');
        }
      }
      urlArray = decodeURI(urlArray);
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
   
  }
  getAssetDetails(assetId: string) {
    this.kalturaAppService.getMediaAssetById(assetId).then((res: any) => {
      this.assetDetails = res;
      if(this.assetDetails.metas.Likeable){
        this.showLike = this.assetDetails.metas.Likeable.value;
      }else{
        this.showLike = false;
      }
      if(this.assetDetails.metas.Rateable){
        this.showRating = this.assetDetails.metas.Rateable.value;
      }else{
        this.showRating = false;
      }
      this.gtmTagEventOnDetailPage(this.assetDetails);
      this.titleService.setTitle('Watch ' + this.assetDetails.name + ' series online on ' + AppConstants.APP_NAME_CAPS + ' | ' + AppConstants.APP_NAME_CAPS + ' Web Series ')
      if (this.assetDetails.tags.SeriesId) {
        this.seriesId = this.kalturaUtilService.getTagsObjectValue(this.assetDetails.tags.SeriesId);
        this.getNoOfSeasonInSeries(this.kalturaUtilService.getTagsObjectValue(this.assetDetails.tags.SeriesId));
      }
      this.getClipFromSeries();
    }, reject => {
      this.loading = false;
      this.snackbarUtilService.showError(reject.message);
    })
  }


  ngOnDestroy() {
    // if (this.pageSubscription) {
    //   this.pageSubscription.unsubscribe();
    // }
    this.titleService.setTitle("Watcho")
  }


  getNoOfSeasonInSeries(seriesId: string) {
    this.kalturaAppService.getEpisodeCountInSeries(seriesId, this.DMS.params.MediaTypes.WebEpisode).then(res => {
      this.episodeCount = res.totalCount;
    }, reject => {
      this.episodeCount = 0;
      console.error(reject);
    })
    this.kalturaAppService.getNoOfSeasonInSeries(seriesId, this.DMS.params.MediaTypes.WebEpisode).then(res => {
      this.seasonsArray = [];
      if (res.totalCount > 0) {
        const getEpisodeFromSeries = async () => {
          for (const element of res.objects) {
            await this.kalturaAppService.getNumberOfEpisodesInSeason(seriesId, this.kalturaUtilService.getMetasObjectValue(element.metas, 'Season number'), element.type.toString(), 1, 20).then(res1 => {
              this.seasonsArray.push(res1);
            }, reject => {
              this.seasonsArray = [];
            });
          }
        }
        getEpisodeFromSeries();
      }

    }, reject => {
      console.error(reject);
      this.loading = false;
    });
  }

  getClipFromSeries() {
    let asset_type = "and asset_type='" + this.DMS.params.MediaTypes.Clips + "'  TrailerParentRefId = '" + this.kalturaUtilService.getTagsObjectValue(this.assetDetails.tags['Ref Id']) + "'";
    let ksql = "(" + asset_type + ")";
    this.kalturaAppService.searchAsset(null, null, ksql, 1, 20).then(clipResponse => {
      if (clipResponse.totalCount > 0) {
        this.clipRail = clipResponse;
      }
    }, reject => {
      this.loading = false;
    });
  }

  playEvent() {
    this.watchAsset(this.seasonsArray[0].objects[0].name, this.seasonsArray[0].objects[0].id)
  }

  watchAsset(name, mediaId) {
    if (this.platformIdentifierService.isBrowser()) {
      this.router.navigate(['/watch/webEpisode/details/' + this.appUtilService.getSEOFriendlyURL(name) + '/' + mediaId]);
    }
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
      'page_location': 'web_series_page',
      'asset_id': assetDetails.id,
      'asset_title': assetDetails.name,
      'asset_genre': assetDetails.tags.Genre.objects[0].value,
      'asset_mediatype': 'WebSeries',
      'asset_cast': assetDetails.tags['Main Cast'] ? assetDetails.tags['Main Cast'].objects[0].value : null,
      'asset_crew': assetDetails.tags.Director ? assetDetails.tags.Director.objects[0].value : null,
      'asset_parental_rating': assetDetails.tags['Parental Rating'].objects[0].value,
      'asset_episode_number': assetDetails.metas['Episode number'] ? assetDetails.metas['Episode number'].value : null,
      'asset_duration': assetDetails.mediaFiles[0] ? assetDetails.mediaFiles[0].duration : null,
      'asset_series_name': assetDetails.name,
      'asset_language': assetDetails.tags['Asset Language'] ? assetDetails.tags['Asset Language'].objects[0].value : null

    };
    this.appUtilService.getGTMTag(dataLayerJson, 'detail_page');
  }


  seoTitleSetAsset(assetId: string) { 
    this.kalturaAppService.getMediaAssetByIdNative(assetId).subscribe((res: any) => {
      this.titleService.setTitle(res.result.metas? res.result.metas.SEOTitle? res.result.metas.SEOTitle.value : '' : '');
      this.meta.updateTag({
        name: 'description',
        content: res.result.metas? res.result.metas.SEODescription? res.result.metas.SEODescription.value : '' : ''
      })
    }, (error)=>{
    })
  }

  addCononicalSEOTags(assetName: any) {
    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", "https://www.watcho.com" + this.router.url);
    this.dom.head.appendChild(link);

    let header: HTMLHeadingElement = this.dom.createElement('h1');
    header.setAttribute('class', 'headerText');
    header.innerHTML = assetName;
    this.dom.body.appendChild(header);
  }
}
