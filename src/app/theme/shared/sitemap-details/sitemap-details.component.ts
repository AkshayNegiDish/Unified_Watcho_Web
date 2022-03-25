import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { KalturaAppService } from '../services/kaltura-app.service';
import { AppUtilService } from '../services/app-util.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { AppConstants } from '../typings/common-constants';

@Component({
  selector: 'app-sitemap-details',
  templateUrl: './sitemap-details.component.html',
  styleUrls: ['./sitemap-details.component.scss']
})
export class SitemapDetailsComponent implements OnInit {

  @Input() ottCategory: any;
  assetList: any;
  channelName: any;
  isBrowser: boolean;

  constructor(private kalturaAppService: KalturaAppService, private appUtilService: AppUtilService, private router: Router, @Inject(PLATFORM_ID) private platformId) {
    this.isBrowser = isPlatformBrowser(this.platformId);
   }

  ngOnInit() {
    if (!this.isBrowser) {
      this.getChannelNameWithAssetList(environment.SEO.KS);
    } else {
      let ks: any = localStorage.getItem(AppConstants.KS_KEY);
      this.getChannelNameWithAssetList(ks);
    }
  }

  getChannelNameWithAssetList(ks: any) {
    this.kalturaAppService.getChannelsByIdNative(this.ottCategory.id, ks).subscribe((res: any) => {
        this.channelName = res.result.name;
    }, reject => { });
    this.kalturaAppService.getAssetListByIdNative(this.ottCategory.id, ks).subscribe((res: any) => {
      if (res.result.totalCount > 0) {
        this.assetList = res.result;
      }
    }, reject => { });
  }
  
  watchAsset(name, mediaId, type, startTime: number, channelId: string) {
    this.appUtilService.getAssetRouteUrl(name, mediaId, null, null, type, null, startTime, channelId).subscribe((res: any) => {
      if (res.url) {
        this.router.navigate([res.url]);
      }
    }, reject => {  });
  }

}
