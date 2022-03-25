import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { PlatformIdentifierService } from './theme/shared/services/platform-identifier.service';
import { AppUtilService } from './theme/shared/services/app-util.service';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { NotificationService } from './theme/shared/services/notification.service';
import { AppConstants } from './theme/shared/typings/common-constants';

declare var initMoengage: any
declare var initGTM: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Welcome to app ' + environment.env;
  pwaApp: boolean;


  constructor(private platformIdentifierService: PlatformIdentifierService, private appUtilService: AppUtilService, private swUpdate: SwUpdate, public swPush: SwPush, private notificationService: NotificationService) {
    if (this.platformIdentifierService.isBrowser()) {
      let DMS = this.appUtilService.getDmsConfig();
      // initMoengage(DMS.extServices.moengageAppID);
      initGTM(window, document, 'script', 'dataLayer', environment.GTM_ID);
    }
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe((evt) => {

        console.log('current version is', evt.current);
        console.log('available version is', evt.available);
        console.log('service worker updated');
      });

      this.swUpdate.checkForUpdate().then(() => {
        // noop
        console.log("Update found")
      }).catch((err) => {
        console.error('error when checking for update', err);
      });
    }
    if (this.platformIdentifierService.isBrowser()) {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.pwaApp = true;
      } else {
        this.pwaApp = false;
      }
      if (localStorage.getItem(AppConstants.AUTOPLAY)) {
        if (localStorage.getItem(AppConstants.AUTOPLAY) === 'true') {
          localStorage.setItem(AppConstants.AUTOPLAY, 'true');
        } else {
          localStorage.setItem(AppConstants.AUTOPLAY, 'false');
        }
      } else {
        localStorage.setItem(AppConstants.AUTOPLAY, 'true');
      }
      setInterval(() => {
        var notificationArray = [];
        notificationArray = JSON.parse(localStorage.getItem("n11s"));
        if (notificationArray.length > 0) {
          var currentTime = new Date().getTime();
          notificationArray = notificationArray.filter(e => e.endDate > currentTime)
          notificationArray.forEach((element, idx) => {
            if (element.startDate <= currentTime && element.endDate > currentTime && !element.notified) {
              this.notificationService.generateNotification(element);
              notificationArray[idx].notified = true;
            }
          })
          localStorage.setItem("n11s", JSON.stringify(notificationArray));
        }
      }, 300000)
    }
  }
}
