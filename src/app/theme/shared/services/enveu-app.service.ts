import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';

declare var EnveuConfiguration, EnveuClient, EnveuLayoutManagerService;

@Injectable({
  providedIn: 'root'
})
export class EnveuAppService {
  isBrowser: boolean;
  isMobileView: boolean;
  _enveuClient: any;

  constructor(@Inject(PLATFORM_ID) public platformId, ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.initializeClient();
    }
  }
  checkDeviceType() {
    if (this.isBrowser) {
      if (matchMedia('(max-width: 992px)').matches) {
        this.isMobileView = false;
        if (matchMedia('(max-width: 768px)').matches) {
          this.isMobileView = true;
        }
      }
    }
  }

  initializeClient(): any {
    if (this.isBrowser) {
      this.checkDeviceType();
      let config = new EnveuConfiguration();
      if (this.isMobileView) {
        config.setApiKey(environment.ENVEU.MOBILE.API_KEY);
        config.setDebug(false);
        config.setDevice("mobile");
        config.setPlatform("web");
        config.setServiceUrl(environment.ENVEU.MOBILE.SERVICE_URL);
        config.setServiceEnvironment(environment.ENVEU.MOBILE.SERVICE_ENVIRONMENT);
      } else {
        config.setApiKey(environment.ENVEU.DESKTOP.API_KEY);
        config.setDebug(false);
        config.setDevice("desktop");
        config.setPlatform("web");
        config.setServiceUrl(environment.ENVEU.DESKTOP.SERVICE_URL);
        config.setServiceEnvironment(environment.ENVEU.DESKTOP.SERVICE_ENVIRONMENT);
      }
      this._enveuClient = new EnveuClient(config);
    }
  }
  getEnveuClient(): any {
    this.initializeClient();
    return this._enveuClient;
  }

  getLayoutByScreenId(screenId: String): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        EnveuLayoutManagerService.listAction(screenId).execute(this.getEnveuClient(), function (success, entry) {
          if (!success) reject(entry);
          resolve(entry);
        });
      }
    );

  }
}
