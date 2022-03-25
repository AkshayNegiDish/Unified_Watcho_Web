import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { AppConstants } from '../../../../../shared/typings/common-constants';
import { environment } from '../../../../../../../environments/environment';


@Component({
  selector: 'app-base',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit, AfterViewInit {
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
      this.titleService.setTitle("" + AppConstants.APP_NAME_CAPS + " Movies - Watch trending movies across genres on " + AppConstants.APP_NAME_CAPS + "!")
      this.DMS = this.appUtilService.getDmsConfig('csvdbvg');
      this.screenId = environment.ENVEU.SCREEN_IDS.MOVIE;;
    } else {
      this.titleService.setTitle("Watch Movies Online in Hindi, Kannada, Tamil, Telugu, Malayalam | Watcho Movies")
      this.meta.updateTag({
        name: 'description',
        content: 'Watch bollywood movies online on Watcho movies. Get streaming of superhit movies and short films in Hindi, Kannada, Tamil, Telugu, Malayalam on Watcho movies'
      })
      this.addCononicalSEOTags();
    }
  }

  addCononicalSEOTags() {
    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", "https://www.watcho.com/movies");
    this.dom.head.appendChild(link);

    let header = this.dom.createElement('h1');
    header.setAttribute('class', 'headerText');
    header.innerHTML = 'Hindi Dubbed South Movies';
    this.dom.body.appendChild(header);
  }

}