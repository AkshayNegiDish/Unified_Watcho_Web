import { Injectable } from "@angular/core";
import { PlatformIdentifierService } from "./platform-identifier.service";

@Injectable()
export class ViewPortService {
    private _isTablet: boolean;
    private _isMobile: boolean;

    constructor(private platformIdentifierService: PlatformIdentifierService) {
        if (platformIdentifierService.isBrowser() === true) {
            if (matchMedia('(max-width: 768px)').matches) {
                this._isMobile = true;
                this._isTablet = false;
            } else if (matchMedia('(max-width: 899px)').matches) {
                this._isMobile = true;
                this._isTablet = true;
            } else {
                this._isMobile = false;
                this._isTablet = false;
            }
        }
    }

    isTablet() {
        return this._isTablet;
    }

    isMobile() {
        return this._isMobile;
    }
}