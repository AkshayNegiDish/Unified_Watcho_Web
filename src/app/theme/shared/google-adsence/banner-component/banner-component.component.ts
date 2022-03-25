import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

declare var googletag;

@Component({
  selector: 'google-gpt',
  templateUrl: './banner-component.component.html',
  styleUrls: ['./banner-component.component.scss']
})
export class BannerComponent implements OnInit, OnDestroy {

  @Input()
  AdData: string;

  timeStamp: string;
  gptId: string;
  uniqueId: string;
  mobileView: boolean = false;
  MobileDimensions: number[][];
  isBrowser: any;
  adDataArray: string[] = [];


  constructor(@Inject(PLATFORM_ID) private platformId) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {

    if (this.isBrowser) {
      if (matchMedia('(max-width: 768px)').matches) {
        this.MobileDimensions = [[320, 50]];
      } else {
        this.MobileDimensions = [[1003, 90], [728, 90], [468, 60]]
      }
      this.timeStamp = new Date().getTime().toString();
      this.uniqueId = `div-gpt-ad-${this.timeStamp}-0`;
      if (this.AdData) {
        this.gptId = this.AdData.toString();
        this.initGpt(this.gptId, this.uniqueId)
      }
    }
  }
  initGpt(gptId: string, uniqueId: string) {
    setTimeout(() => {
      // Prevents JS errors of googletag of undefined
      if (typeof googletag !== 'undefined') {
        // Configurations for dfp ads
        googletag.cmd.push(() => {
          googletag.defineSlot(gptId, this.MobileDimensions, uniqueId).addService(googletag.pubads());
          googletag.pubads().collapseEmptyDivs();
          googletag.pubads().enableSingleRequest();
          googletag.enableServices();
        });
        this.displayAds(uniqueId);
      }
    }, 100)
  }

  // Displays ad to the browser
  displayAds(uniqueId) {
    googletag.cmd.push(() => {
      googletag.display(uniqueId);
    });
  }



  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    if (typeof googletag !== undefined) {
      try {
        googletag.destroySlots();
      } catch (e) {

      }
    }

  }
}
