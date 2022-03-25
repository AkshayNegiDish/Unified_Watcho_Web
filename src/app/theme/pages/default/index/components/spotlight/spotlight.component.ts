import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { AppConstants } from '../../../../../shared/typings/common-constants';
import { environment } from '../../../../../../../environments/environment';


@Component({
  selector: 'app-base',
  templateUrl: './spotlight.component.html',
  styleUrls: ['./spotlight.component.scss']
})
export class SpotlightComponent implements OnInit, AfterViewInit {
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
      this.titleService.setTitle("" + AppConstants.APP_NAME_CAPS + " Spotlight - catch your favourite influencers in action only on " + AppConstants.APP_NAME_CAPS + "!")
      this.DMS = this.appUtilService.getDmsConfig('sfsfsf');
      this.screenId = environment.ENVEU.SCREEN_IDS.SPOTLIGHT;;
    } else {
      this.titleService.setTitle("Watch TV Series, Comedy shows, drama online in Hindi, Telugu, Kannada on Watcho | Watcho Spotlight")
      this.meta.updateTag({
        name: 'description',
        content: 'Watch latest TV Series, Comedy shows, drama, food recipes and other Indian serials online in Hindi, Telugu, Kannada on Watcho spotlight.'
      })
    this.addCononicalSEOTags();
    }
  }

  addCononicalSEOTags() {
    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", "https://www.watcho.com/spotlight");
    this.dom.head.appendChild(link);

    let header = this.dom.createElement('h1');
    header.setAttribute('class', 'headerText');
    header.innerHTML = 'Romantic Short Films';
    this.dom.body.appendChild(header);
  }

}