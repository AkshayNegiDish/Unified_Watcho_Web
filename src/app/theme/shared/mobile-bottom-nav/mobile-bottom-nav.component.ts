import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { AppUtilService } from '../services/app-util.service';
import { LoginMessageService } from '../services/auth';

@Component({
  selector: 'app-mobile-bottom-nav',
  templateUrl: './mobile-bottom-nav.component.html',
  styleUrls: ['./mobile-bottom-nav.component.scss']
})
export class MobileBottomNavComponent implements OnInit {

  isHomeIsActive: boolean = false;
  ispremiumActive: boolean = false;
  isspotlightActive: boolean = false;
  isLiveTVActive: boolean = false;
  isMoreActive: boolean = false;
  isSwagActive: boolean = false;


  url: string;
  attribute: any;
  constructor(private router: Router, public appUtilService: AppUtilService, private ugcOpenMessageService: LoginMessageService) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.url = router.url;
        this.toggleActive();
      }
    })
  }

  ngOnInit() {
    this.toggleActive();
  }

  toggleActive() {
    this.url = this.router.url;
    this.resetControlFlags();
    if ((this.url.indexOf("premium") > 0) && (this.url.indexOf("search") < 0) && (this.url.indexOf("details") < 0)) {
      this.ispremiumActive = true;
    } else if ((this.url.indexOf("spotlight") > 0) && (this.url.indexOf("details") < 0) && (this.url.indexOf("search") < 0)) {
      this.isspotlightActive = true;
    } else if ((this.url.indexOf("live-tv") > 0)) {
      this.isLiveTVActive = true;
    } else if (this.url === '/') {
      this.isHomeIsActive = true;
    } else if ((this.url.indexOf("more-page") > 0)) {
      this.isMoreActive = true;
    } else if ((this.url.indexOf('ugc-videos') > 0) && (this.url.indexOf("details") < 0)) {
      this.isSwagActive = true;
    }
  }

  resetControlFlags() {
    this.isHomeIsActive = false;
    this.ispremiumActive = false;
    this.isspotlightActive = false;
    this.isLiveTVActive = false;
    this.isMoreActive = false;
    this.isSwagActive = false;
  }

  clickUserIconWebMoEngageEvent() {
    this.attribute = {
      nav_item_name: "user_icon_web"
    }
    this.appUtilService.moEngageEventTracking("NAVIGATION_BAR_CLICKED", this.attribute);
  }

  clickHomeMoEngageEvent() {
    this.attribute = {
      nav_item_name: "home_page"
    }
    this.appUtilService.moEngageEventTracking("NAVIGATION_BAR_CLICKED", this.attribute);
  }

  clickPremiumMoEngageEvent() {
    this.attribute = {
      nav_item_name: "exclusives"
    }
    this.appUtilService.moEngageEventTracking("NAVIGATION_BAR_CLICKED", this.attribute);
  }

  clickSpotlightMoEngageEvent() {
    this.attribute = {
      nav_item_name: "spotlight"
    }
    this.appUtilService.moEngageEventTracking("NAVIGATION_BAR_CLICKED", this.attribute);
  }

  clickLiveTvMoEngageEvent() {
    this.attribute = {
      nav_item_name: "live_tv"
    }
    this.appUtilService.moEngageEventTracking("NAVIGATION_BAR_CLICKED", this.attribute);
  }

  clickSwagMoEngageEvent() {
    this.attribute = {
      nav_item_name: "swag"
    }
    this.appUtilService.moEngageEventTracking("NAVIGATION_BAR_CLICKED", this.attribute);
  }

}
