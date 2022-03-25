import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { KalturaAppService } from '../services/kaltura-app.service';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { AppConstants } from '../typings/common-constants';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {

  ottCategoryList: any;
  isBrowser: boolean;

  constructor(private kalturaAppService: KalturaAppService, @Inject(PLATFORM_ID) private isPlatform, private title: Title) {
    this.isBrowser = isPlatformBrowser(this.isPlatform);
   }

  ngOnInit() {
    this.title.setTitle("Sitemap - Watcho");
    if (!this.isBrowser) {
      this.addSiteMap(environment.SEO.KS);      
    } else {
      let ks: any = localStorage.getItem(AppConstants.KS_KEY);
      this.addSiteMap(ks);
    }
  }

  addSiteMap(ks: any) {
    let ottCategoryId: any = environment.SITEMAPID;
    this.kalturaAppService.getOTTCategoryByIdNative(ottCategoryId, ks).subscribe((response: any) => {
      this.ottCategoryList = response.result.channels;
    }, reject => {  });
  }

}
