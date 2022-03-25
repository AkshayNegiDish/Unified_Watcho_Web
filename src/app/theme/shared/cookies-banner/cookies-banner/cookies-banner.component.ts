import { Component, OnInit } from '@angular/core';
import { PlatformIdentifierService } from '../../services/platform-identifier.service';
import { AppConstants } from '../../typings/common-constants';
declare var $: any;

@Component({
  selector: 'app-cookies-banner',
  templateUrl: './cookies-banner.component.html',
  styleUrls: ['./cookies-banner.component.scss']
})
export class CookiesBannerComponent implements OnInit {
  hideCookiesBanner: boolean = false;
  privacyPolicy: string = AppConstants.PRIVACY_POLICY;
  isDesktopView: boolean = false;

  constructor(private platformIdentifierService: PlatformIdentifierService) { }

  ngOnInit() {
    if (this.platformIdentifierService.isBrowser()) {
      if (matchMedia('(min-width: 992px)').matches) {
        this.isDesktopView = true;
      } else {
        this.isDesktopView = false;
      }
      $(window).bind("orientationchange", () => {
        setTimeout(() => {
          if (matchMedia('(min-width: 992px)').matches) {
            this.isDesktopView = true;
          } else {
            this.isDesktopView = false;
          }
        },400)
      });
    }

    this.isCookiesAllowed();
  }

  isCookiesAllowed() {
    if (this.platformIdentifierService.isBrowser()) {
      if (localStorage.getItem('cookies-allowd')) {
        this.hideCookiesBanner = true;
      }
    }

  }

  cookiesAllowed() {
    localStorage.setItem('cookies-allowd', 'true');
    this.isCookiesAllowed();
  }

}
