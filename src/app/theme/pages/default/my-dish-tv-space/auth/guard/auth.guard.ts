import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { MyDishTvSpaceService } from '../../services/mydishtvspace.service';
import { map } from 'rxjs/operators';
@Injectable()
export class AuthGuard1 implements CanActivate {
	isBrowser: boolean;
	constructor(private _router: Router, private myDishTvSpaceService: MyDishTvSpaceService, @Inject(PLATFORM_ID) private platformId) {
		this.isBrowser = isPlatformBrowser(platformId);
	}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, ): Observable<boolean> | boolean {
		let date: any = new Date();
		let tokenCreatedAt: any = localStorage.getItem("mydishtv_token") ? new Date(JSON.parse(localStorage.getItem("mydishtv_token")).createdAt) : '';
		if (this.isBrowser) {
			if (tokenCreatedAt && ((date - tokenCreatedAt) / (60 * 60 * 1000)) < 23) {
				return this.checkPlatform(state);
			} else {
				return this.myDishTvSpaceService.getDishTvSpaceToken()
					.pipe(map(data => {
						return this.checkPlatform(state);
					}));
			}
		} else {
			return true;
		}
	}
	checkPlatform(state) {
		if (this.isBrowser) {
			if (localStorage.getItem("user-category") == '1' && state.url.includes('mydishtvspace')) {
				return true;
			} else if (localStorage.getItem("user-category") == '2' && state.url.includes('myd2hspace')) {
				return true;
			} else {
				return false;
			}
		}
	}
}