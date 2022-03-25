import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { KalturaAppService } from '../shared/services/kaltura-app.service';
import { AppFormService } from '../shared/services/shared-form.service';
import { AppConstants } from '../shared/typings/common-constants';
import { UUID } from 'angular2-uuid';


@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  isBrowser: any;

  hrs_1: number;
  dmsExpiryTime: number;
  ksExpiryTime: number;

  constructor(@Inject(PLATFORM_ID) private platformId,
    private kalturaAppService: KalturaAppService, private appFormService: AppFormService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.hrs_1 = 3600000;
    this.dmsExpiryTime = this.hrs_1 * 8;
    this.ksExpiryTime = this.hrs_1 * 24;
  }

  load(): Promise<any> {

    if (this.isBrowser) {

      // this.setExpiry();

      return this.handleDMSCall().then(res => {
        return this.handleKSCall().then(ksRes => {
          let udid;
          if (this.isBrowser) {
            if (!localStorage.getItem(AppConstants.UDID_KEY)) {
              udid = 'WEB-' + UUID.UUID();
              localStorage.setItem(AppConstants.UDID_KEY, udid);
            }
          }
        });
      });
    } else {
      return;
    }
  }

  handleDMSCall() {
    let callDms: boolean = false;
    if (localStorage.getItem(AppConstants.DMS_KEY) === undefined
      || localStorage.getItem(AppConstants.DMS_KEY) === null
      || localStorage.getItem(AppConstants.DMS_KEY).trim() === '') {
      callDms = true;
    } else {
      let expiryTime: any = sessionStorage.getItem(AppConstants.DMS_EXPIRY_KEY);
      if (expiryTime) {
        expiryTime = Number.parseInt(expiryTime);
        let currentTime = new Date().getTime();
        if ((currentTime - expiryTime) > this.dmsExpiryTime) {
          callDms = true;
        } else {
          callDms = false;
        }
      } else {
        this.setExpiry(true, false);
        callDms = true;
      }
    }
    if (callDms) {
      return this.appFormService.getDms().toPromise().then(dms => {
        this.setExpiry(true, false);
        localStorage.setItem(AppConstants.DMS_KEY, JSON.stringify(dms.body));
        return;
      });
    } else {
      return Promise.resolve();
    }
  }

  handleKSCall(): any {
    let callKs: boolean = false;
    if (localStorage.getItem(AppConstants.KS_KEY) === undefined
      || localStorage.getItem(AppConstants.KS_KEY) === null
      || localStorage.getItem(AppConstants.KS_KEY).trim() === '') {
      callKs = true;
    } else {
      if (localStorage.getItem(AppConstants.AUTH_HEADER_KEY) && localStorage.getItem(AppConstants.USER_DETAILS)) {
        callKs = false;
      } else {
        let expiryTime: any = localStorage.getItem(AppConstants.DMS_EXPIRY_KEY);
        if (expiryTime) {
          expiryTime = Number.parseInt(expiryTime);
          let currentTime = new Date().getTime();
          if ((currentTime - expiryTime) > this.ksExpiryTime) {
            callKs = true;
          } else {
            callKs = false;
          }
        } else {
          this.setExpiry(false, true);
          callKs = true;
        }
      }
    }
    if (callKs) {
      return this.kalturaAppService.makeAnonymusLogin().then(resolve => {
        this.setExpiry(false, true);
        return Promise.resolve();
      }, rej => {

      });
    } else {
      return Promise.resolve();
    }
  }

  setExpiry(setDMS?: boolean, setKS?: boolean) {
    if (!sessionStorage.getItem(AppConstants.DMS_EXPIRY_KEY) || setDMS) {
      sessionStorage.setItem(AppConstants.DMS_EXPIRY_KEY, new Date().getTime().toString());
    }
    if (!localStorage.getItem(AppConstants.KS_EXPIRY_KEY) || setKS) {
      localStorage.setItem(AppConstants.KS_EXPIRY_KEY, new Date().getTime().toString());
    }
  }
}
