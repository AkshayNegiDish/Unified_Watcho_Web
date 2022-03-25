import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { QuizService } from '../../services/quiz.service';
import { map } from 'rxjs/operators';
@Injectable()
export class AuthGuard1 implements CanActivate {
	isBrowser: boolean;
	constructor(private _router: Router, private quizService: QuizService, @Inject(PLATFORM_ID) private platformId) {
		this.isBrowser = isPlatformBrowser(platformId);
	}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, ): Observable<boolean> | boolean {
		let date: any = new Date();
		let tokenCreatedAt: any = localStorage.getItem("quiz_token") ? new Date(JSON.parse(localStorage.getItem("quiz_token")).createdAt) : '';
		if (this.isBrowser) {
			if (tokenCreatedAt && ((date - tokenCreatedAt) / (60 * 60 * 1000)) < 23) {
				return this.checkPlatform(state);
			} else {
				return this.quizService.validateUser()
				.pipe(map(data => {
					return this.checkPlatform(state);
				}));
			}
		} else {
			return true;
		}
	}
	checkPlatform(state) {
		if (state.url.includes('quiz')) {
			return true;
		} else {
			return false;
		}
	}
}