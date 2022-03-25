import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { AppConstants } from '../../../../../shared/typings/common-constants';
import { environment } from '../../../../../../../environments/environment';


@Component({
  selector: 'app-base',
  templateUrl: './live-tv.component.html',
  styleUrls: ['./live-tv.component.scss']
})
export class LiveTvComponent implements OnInit, AfterViewInit {
  isBrowser: any;
  screenId: string;
  DMS: any;

  constructor(@Inject(PLATFORM_ID) private platformId, @Inject(DOCUMENT) private dom, private appUtilService: AppUtilService, private titleService: Title, private meta: Meta) {
    this.isBrowser = isPlatformBrowser(platformId);

  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    if (this.isBrowser) {
      this.titleService.setTitle("" + AppConstants.APP_NAME_CAPS + " Live TV - Keep up with your favourite TV shows online on " + AppConstants.APP_NAME_CAPS + "")
      this.DMS = this.appUtilService.getDmsConfig('cscf');
      this.screenId = environment.ENVEU.SCREEN_IDS.LIVE_TV;;
    } else {
      this.titleService.setTitle("Watch Live News, TV Shows and serials for free in HD on Watcho | Watcho Live TV")
      this.meta.updateTag({
        name: 'description',
        content: 'Enjoy free online streaming of popular TV channels including serials, regional movies, news, sports, music, english news and much more on Watcho Live TV.'
      })
    this.addCononicalSEOTags();
    }
  }

  addCononicalSEOTags() {
    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", "https://www.watcho.com/live-tv");
    this.dom.head.appendChild(link);

    let header = this.dom.createElement('h1');
    header.setAttribute('class', 'headerText');
    header.innerHTML = 'English and Regional News';
    this.dom.body.appendChild(header);
  }

}