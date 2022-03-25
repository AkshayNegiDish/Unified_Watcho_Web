import { Component, OnInit, PLATFORM_ID, Inject, Output, EventEmitter } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RailViewType } from '../../../../../shared/models/rail.model';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { AppConstants } from '../../../../../shared/typings/common-constants';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../../../../environments/environment';
import { ModalMessageService } from '../../../../../shared/services/modal-message.service';

@Component({
  selector: 'app-short-film-detail-page',
  templateUrl: './short-film-detail-page.component.html',
  styleUrls: ['./short-film-detail-page.component.scss']
})
export class ShortFilmDetailPageComponent implements OnInit {
  assetCategoryId: number
  assetId: number;
  assetDetails: any;
  isUserLoggedIn: boolean = false;
  personalListAsset: any;
  personalListId: number;
  isAddedToWatchList: boolean = false;
  screenId: string;
  isDetailPage: boolean;
  viewType: string = RailViewType[RailViewType.LANDSCAPE].toString();
  DMS: any;
  isAssetInWatchlist: boolean = false;
  isBrowser: any;
  isMobileTabletView: boolean = false;
  showLike: boolean = false;
  showRating: boolean = false;
  reinitiatePlayer: boolean = true;


  constructor(private kalturaAppService: KalturaAppService, public kalturaUtilService: KalturaUtilService,
    private titleService: Title, private appUtilService: AppUtilService, private route: ActivatedRoute, private meta: Meta, @Inject(PLATFORM_ID) private platformId, private modalMessageService: ModalMessageService) {
      this.isBrowser = isPlatformBrowser(platformId);
    this.isDetailPage = true;

    //  // override the route reuse strategy
    //  this.router.routeReuseStrategy.shouldReuseRoute = function () {
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
      //subscription of the url 
    this.DMS = this.appUtilService.getDmsConfig('short flim');
      this.screenId = environment.ENVEU.SCREEN_IDS.SHORT_FILM_DETAIL;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.assetDetails = null;
      this.assetId = +params.get('assetId');
      this.getAssetDetails(this.assetId.toString());
    })
    } else {
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.assetId = +params.get('assetId');
        this.seoTitleSetAsset(this.assetId.toString());
      })
    }

    if (matchMedia('(max-width: 768px)').matches) {
      this.isMobileTabletView = true;
    } else if (matchMedia('(max-width: 992px)').matches) {
      this.isMobileTabletView = true;
    } else {
      this.isMobileTabletView = false;
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
      this.titleService.setTitle("Watch " + this.assetDetails.name + " short film online on " + AppConstants.APP_NAME_CAPS + " | " + AppConstants.APP_NAME_CAPS + " Shortfilms");
    }, reject => {

    })
  }

  ngOnDestroy() {
    this.titleService.setTitle(AppConstants.APP_NAME_CAPS);
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
    try {
      dataLayerJson = {
        'user_id': userDetails !== undefined ? userDetails.UserID : null,
        'mobile_number': userDetails !== undefined ? userDetails.MobileNo : null,
        'email': userDetails !== undefined ? userDetails.EmailID : null,
        'name': userDetails !== undefined ? userDetails.Name : null,
        'utm_source': utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
        'utm_medium': utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
        'utm_campaign': utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
        'page_location': 'short_film_page',
        'asset_id': assetDetails.id,
        'asset_title': assetDetails.name,
        'asset_genre': assetDetails.tags.Genre ? assetDetails.tags.Genre.objects[0].value : null,
        'asset_mediatype': 'ShortFilm',
        'asset_cast': assetDetails.tags['Main Cast'] ? assetDetails.tags['Main Cast'].objects[0].value : null,
        'asset_crew': assetDetails.tags.Director ? assetDetails.tags.Director.objects[0].value : null,
        'asset_duration': assetDetails.mediaFiles[0] ? assetDetails.mediaFiles[0].duration : null,
        'asset_parental_rating': assetDetails.tags['Parental Rating'] ? assetDetails.tags['Parental Rating'].objects[0].value : null,
        'asset_language': assetDetails.tags['Asset Language'] ? assetDetails.tags['Asset Language'].objects[0].value : null
      };
    } catch (e) {

    }
    this.appUtilService.getGTMTag(dataLayerJson, 'detail_page');
  }

  isInWatchlist(event) {
    this.isAssetInWatchlist = event;
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
