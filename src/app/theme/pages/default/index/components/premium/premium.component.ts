import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { AppConstants } from '../../../../../shared/typings/common-constants';
import { environment } from '../../../../../../../environments/environment';



@Component({
  selector: 'app-base',
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss']
})
export class PremiumComponent implements OnInit, AfterViewInit {

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
      this.titleService.setTitle("" + AppConstants.APP_NAME_CAPS + " Exclusives - watch premium films and series only on " + AppConstants.APP_NAME_CAPS + "!")
      this.DMS = this.appUtilService.getDmsConfig('premium');
      this.screenId = environment.ENVEU.SCREEN_IDS.ORIGINALS;;
    } else {
      this.titleService.setTitle("Watch Premium TV Shows, Standup comedy show, Short Films & Plays exclusive on Watcho | Watcho Premium")
      this.meta.updateTag({
        name: 'description',
        content: 'Watch latest Indian TV Shows, shandup comedy shows, blockbuster movies, short fims and south Indian series in HD on Watcho'
      })
    this.addCononicalSEOTags();
    }
  }

  addCononicalSEOTags() {
    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", "https://www.watcho.com/premium");
    this.dom.head.appendChild(link);

    let header = this.dom.createElement('h1');
    header.setAttribute('class', 'headerText');
    header.innerHTML = 'Chill Out Comedies';
    this.dom.body.appendChild(header);
  }

}
