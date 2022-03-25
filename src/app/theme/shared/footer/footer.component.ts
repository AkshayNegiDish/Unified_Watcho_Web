import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AppUtilService } from '../services/app-util.service';
import { AppConstants } from '../typings/common-constants';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isBrowser: boolean;

  termsOfUse: string = AppConstants.TERMS_OF_USE;
  privacyPolicy: string = AppConstants.PRIVACY_POLICY;
  fAQ: string = AppConstants.FAQ;
  aboutUs: string = AppConstants.ABOUT_US;
  help: String = '/help';
  playStoreImage: string = "//d1f8xt8ufwfd45.cloudfront.net/web/statics/playStoreImage.png"
  appStoreImage: string = '//d1f8xt8ufwfd45.cloudfront.net/web/statics/AppStore.svg'
  pwaApp: boolean;
  app: any;
  removefooter: boolean;
  padding0: boolean;
  titlepadding0: boolean;
  apps: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId, private appUtilService: AppUtilService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.pwaApp = true;
        this.titlepadding0 = true;
        this.apps = true;
      } else {
        this.pwaApp = false;
        this.titlepadding0 = false;
        this.apps = false;
      }
    }

    if (this.isBrowser) {
      window.onscroll = () => { if (this.pwaApp) { this.scrollFunction() } };
    }
  }

  scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById("back2Top").style.display = "block";
    } else {
      document.getElementById("back2Top").style.display = "none";
    }
  }

  goToTop() {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.gtmTagOnGoToTop();
  }

  clickTermsAndUseMoengage() {
    this.appUtilService.moEngageEventTrackingWithNoAttribute("VISIT_TERMSANDCONDITIONS_PAGE");
  }


  gtmTagOnGoToTop() {
    let dataLayerJson = {
      'button_id': 'go_to_top_icon',
      'button_name': 'Go to Top ICON',
      'button_location': 'Footer_Section',
      'redirection_url': null,
      'button_image': null,
      'successful': 'successful'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'go_to_top_icon');
  }

  gtmtagOnSocialIcon(socialType: Number) {
    let dataLayerJson: any;

    if (socialType === 1) {
      dataLayerJson = {
        'button_id': 'fb_icon',
        'button_name': 'Facebook ICON',
        'button_location': 'Footer_Section',
        'redirection_url': null,
        'button_image': null,
        'successful': 'successful'
      };
    } else if (socialType === 2) {
      dataLayerJson = {
        'button_id': 'insta_icon',
        'button_name': 'Instagram ICON',
        'button_location': 'Footer_Section',
        'redirection_url': null,
        'button_image': null,
        'successful': 'successful'
      };
    } else if (socialType === 3) {
      dataLayerJson = {
        'button_id': 'twitter_icon',
        'button_name': 'Twitter ICON',
        'button_location': 'Footer_Section',
        'redirection_url': null,
        'button_image': null,
        'successful': 'successful'
      };
    } else {
      dataLayerJson = {
        'button_id': 'youtube_icon',
        'button_name': 'YouTube ICON',
        'button_location': 'Footer_Section',
        'redirection_url': null,
        'button_image': null,
        'successful': 'successful',
      };
    }

    this.appUtilService.getGTMTag(dataLayerJson, 'social_icons');
  }


}
