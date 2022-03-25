import { Location, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { AppConstants } from '../../../../../shared/typings/common-constants';
import { environment } from '../../../../../../../environments/environment';
import { ModalMessageService } from '../../../../../shared/services/modal-message.service';

@Component({
  selector: 'app-web-episode-detail-page',
  templateUrl: './web-episode-detail-page.component.html',
  styleUrls: ['./web-episode-detail-page.component.scss']
})
export class WebEpisodeDetailPageComponent implements OnInit {

  assetCategoryId: number
  assetId: number
  assetDetails: any
  isUserLoggedIn: boolean = false
  personalListAsset: any
  personalListId: number
  isAddedToWatchList: boolean = false
  screenId: string
  isDetailPage: boolean
  showPlayer: boolean = false
  DMS: any
  railData: any
  pageSubscription: Subscription
  seriesId: string;
  seriesList: any[];
  seasonsArray: any[] = [];
  isAssetInWatchlist: boolean = false;
  nextEpisodePlayed: boolean = false;
  nextEpisodeDetails: any;
  showDescriptionShell: boolean = false;
  isBrowser: any;
  reinitiatePlayer: boolean = true;
  seasonNumber: string = null;


  constructor(private kalturaAppService: KalturaAppService,
    public kalturaUtilService: KalturaUtilService,
    private titleService: Title, private modalMessageService: ModalMessageService,
    private router: Router, private appUtilService: AppUtilService,
    private route: ActivatedRoute, private location: Location, private meta: Meta, @Inject(PLATFORM_ID) private platformId ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isDetailPage = true
    this.railData = null

    this.modalMessageService.messageCommonObj$.subscribe((res: boolean) => {
      if (!res) {
        this.reinitiatePlayer = true;
      } else {
        this.reinitiatePlayer = false;
      }
    })
  }

  ngOnInit() {
    if(this.isBrowser) {
    this.DMS = this.appUtilService.getDmsConfig();
      this.screenId = environment.ENVEU.SCREEN_IDS.WEB_EPISODE_DETAIL;;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.assetDetails = null;
      this.nextEpisodePlayed = false;
      this.assetId = +params.get('assetId');
      this.getAssetDetails(this.assetId.toString());
    })
      // override the route reuse strategy
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      }
      this.router.events.subscribe((evt) => {
        if (evt instanceof NavigationEnd) {
          // trick the Router into believing it's last link wasn't previously loaded
          this.router.navigated = false;
          // if you need to scroll back to top, here is the right place
          window.scrollTo(0, 0);
        }
      });
    } else {
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.assetId = +params.get('assetId');
        this.seoTitleSetAsset(this.assetId.toString());
      })
  }
   
  }
  getAssetDetails(assetId: string) {
    if (this.nextEpisodePlayed) {
      this.showDescriptionShell = true;
    }
    this.kalturaAppService.getMediaAssetById(assetId).then((res: any) => {
      this.showDescriptionShell = false;
      if (this.nextEpisodePlayed) {
        this.nextEpisodeDetails = res;
        this.getNewUrl(this.nextEpisodeDetails.name, this.nextEpisodeDetails.id, this.nextEpisodeDetails.type);
        this.titleService.setTitle("Watch | " + this.nextEpisodeDetails.name + "  - " + AppConstants.APP_NAME_CAPS + " Web Series")
        this.gtmTagEventOnDetailPage(this.nextEpisodeDetails);
      } else {
        this.assetDetails = res;
        this.titleService.setTitle("Watch | " + this.assetDetails.name + "  - " + AppConstants.APP_NAME_CAPS + " Web Series")
        if (this.assetDetails.tags.SeriesId) {
          this.seriesId = this.kalturaUtilService.getTagsObjectValue(this.assetDetails.tags.SeriesId);
          this.seasonNumber = this.kalturaUtilService.getMetasObjectValue(this.assetDetails.metas, 'Season number');
          this.getNoOfSeasonInSeries(this.kalturaUtilService.getTagsObjectValue(this.assetDetails.tags.SeriesId));
        }
        this.gtmTagEventOnDetailPage(this.assetDetails);
      }


    }, reject => {
      this.showDescriptionShell = false;
    })
  }
  getSeriesList(seriesId: any) {
    this.kalturaAppService.getEpisodeCountInSeries(seriesId, this.DMS.params.MediaTypes.WebEpisode).then(res => {
      if (res.objects) {
        this.seriesList = res.objects;
      }
    }, reject => {

    })
  }


  ngOnDestroy() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe()
    }
    // this.titleService.setTitle("Watcho")
  }

  getNoOfSeasonInSeries(seriesId: string) {
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
      'page_location': 'web_episode_page',
      'asset_id': assetDetails.id,
      'asset_title': assetDetails.name,
      'asset_genre': assetDetails.tags.Genre ? assetDetails.tags.Genre.objects[0].value : null,
      'asset_mediatype': 'WebEpisode',
      'asset_cast': assetDetails.tags['Main Cast'] ? assetDetails.tags['Main Cast'].objects[0].value : null,
      'asset_crew': assetDetails.tags.Director ? assetDetails.tags.Director.objects[0].value : null,
      'asset_parental_rating': assetDetails.tags['Parental Rating'] ? assetDetails.tags['Parental Rating'].objects[0].value : null,
      'asset_episode_number': assetDetails.metas['Episode number'] ? assetDetails.metas['Episode number'].value : null,
      'asset_duration': assetDetails.mediaFiles[0] ? assetDetails.mediaFiles[0].duration : null,
      'asset_series_name': assetDetails.tags['Series Name'] ? assetDetails.tags['Series Name'].objects[0].value : null,
      'asset_language': assetDetails.tags['Asset Language'] ? assetDetails.tags['Asset Language'].objects[0].value : null

    };
    this.appUtilService.getGTMTag(dataLayerJson, 'detail_page');
  }

  getCurrentEpisodeDetails(event: number) {
    this.nextEpisodePlayed = true;
    this.getAssetDetails(event.toString())
    this.assetId = event;
  }

  getNewUrl(name, mediaId, type) {
    this.appUtilService.getAssetRouteUrl(name, mediaId, null, null, type, null, null, null).subscribe((res: any) => {
      if (res.url) {
        this.location.go(res.url);
      }
    });
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

}
