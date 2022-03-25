import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { AppConstants } from '../../../../../shared/typings/common-constants';
import { environment } from '../../../../../../../environments/environment';



@Component({
  selector: 'app-base',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  isBrowser: any;
  screenId: string;
  DMS: any;

  constructor(@Inject(PLATFORM_ID) private platformId, @Inject(DOCUMENT) private dom,
    private appUtilService: AppUtilService, private titleService: Title, private meta: Meta) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    // this.snackbarUtilService.showSnackbar('hello world hello world hello world hello world hello world hello world hello world ')
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.titleService.setTitle("" + AppConstants.APP_NAME_CAPS + " - Watch Web Series, Short Films, TV and Much More! Let's " + AppConstants.APP_NAME_CAPS + ".")
      this.DMS = this.appUtilService.getDmsConfig('home');
      this.screenId = environment.ENVEU.SCREEN_IDS.HOME;
    } else {
      this.titleService.setTitle("Watch Free Online Movies, TV Shows, Web Series, Shortfilms & News | Watcho")
      this.meta.updateTag({
        name: 'description',
        content: 'Watch free online streaming of your favourite TV Shows, Live News updates, web series, movies in Tamil, Telugu, Kannada, Malayalam and much more on Watcho'
      })
      this.addCononicalSEOTags();
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.titleService.setTitle("")
  }

  addCononicalSEOTags() {
    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", "https://www.watcho.com/");
    this.dom.head.appendChild(link);

    let header = this.dom.createElement('h1');
    header.setAttribute('class', 'headerText');
    header.innerHTML = 'Watcho Originals';
    this.dom.body.appendChild(header);
  }

}