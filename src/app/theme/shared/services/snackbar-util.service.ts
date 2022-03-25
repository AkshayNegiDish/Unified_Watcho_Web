import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';


declare var $: any;

@Injectable({
    providedIn: 'root',
})
export class SnackbarUtilService {


    isBrowser: any;

    constructor(@Inject(PLATFORM_ID) private platformId) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    showSnackbar(message) {
        if (this.isBrowser) {
            let div = '<div id="snackbar" class="show default-snackbar">' + message + '</div>';
            $("#snackbar-container").html('');
            $("#snackbar-container").html(div);
            setTimeout(() => {
                $("#snackbar-container").html('');
            }, 4000);
        }
    }

    showError(str?: string) {
        let message = 'Something went wrong, please try again.'
        if (str) {
            message = str;
        }
        if (this.isBrowser) {
            let div = '<div id="snackbar" class="show default-snackbar">' + message + '</div>';
            $("#snackbar-container").html('');
            $("#snackbar-container").html(div);
            setTimeout(() => {
                $("#snackbar-container").html('');
            }, 4000);
        }
    }

    like(str?: string) {
        let message = 'Added to liked videos'
        if (str) {
            message = str;
        }
        if (this.isBrowser) {
            let div = '<div id="snackbar" class="show default-snackbar">' + message + '</div>';
            $("#snackbar-container").html('');
            $("#snackbar-container").html(div);
            setTimeout(() => {
                $("#snackbar-container").html('');
            }, 2000);
        }
    }

    unlike(str?: string) {
        let message = 'Removed from liked videos'
        if (str) {
            message = str;
        }
        if (this.isBrowser) {
            let div = '<div id="snackbar" class="show default-snackbar">' + message + '</div>';
            $("#snackbar-container").html('');
            $("#snackbar-container").html(div);
            setTimeout(() => {
                $("#snackbar-container").html('');
            }, 2000);
        }
    }


}