import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable()
export class PlatformIdentifierService {
    _isBrowser;

    constructor(@Inject(PLATFORM_ID) private platformId) {
        this._isBrowser = isPlatformBrowser(platformId);
    }

    isBrowser() {
        return this._isBrowser;
    }
}