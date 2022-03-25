import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { AppUtilService } from "../../theme/shared/services/app-util.service";

@Injectable()
export class AuthGuard implements CanActivate {
	authToken: string;
	removeAllSession: boolean;
	isBrowser: boolean;


	constructor(private _router: Router, @Inject(PLATFORM_ID) private platformId, private appUtilService: AppUtilService) {
		this.isBrowser = isPlatformBrowser(platformId);
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,): Observable<boolean> | boolean {
		let user;
		if (this.isBrowser) {
			if ((state.url.indexOf('user/') > 0) || (state.url.indexOf('ugc/my-uploads') > 0) || (state.url.indexOf('ugc/ugc-my-uploads') > 0)) {
				if (this.appUtilService.isUserLoggedIn()) {
					return true
				} else {
					if (state.url === '/user/quiz') {
						
					}
					else if (state.url === '/user/membershipandplans') {
					} else {
						this._router.navigate(['/']);
					}
					return true
				}
			} else {
				return true;
			}

		} else {
			return true;
		}
	}
}
