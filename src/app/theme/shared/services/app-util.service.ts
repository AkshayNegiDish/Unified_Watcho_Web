import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs/Observable';
import { RailViewType } from "../models/rail.model";
import { AppConstants, AppPages } from "../typings/common-constants";
import { ContentPrefencesObserverData, ObserverData, UrlObserverDate } from '../typings/shared-typing';
import { KalturaAppService } from './kaltura-app.service';
import { SnackbarUtilService } from './snackbar-util.service';
import { ImageType, ImageTypeNames } from '../typings/enveu-constants';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

declare var dataLayer: any
declare var Moengage: any;
declare var KalturaPlayer: any;
declare var branch: any;

@Injectable({
    providedIn: 'root'
})
export class AppUtilService {

    isBrowser: any;
    DMS: any;
    isDesktop: boolean = true;

    constructor(@Inject(PLATFORM_ID) private platformId, private httpClient: HttpClient,
        private snackbarUtilService: SnackbarUtilService, private router: Router,
        private deviceService: DeviceDetectorService, private kalturaAppService: KalturaAppService) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            if (matchMedia('(min-width: 993px)').matches) {
                this.isDesktop = true;
            } else {
                this.isDesktop = false;
            }
        }
    }

    getDefaultThumbnail(viewType: string): string {
        viewType = viewType.toUpperCase();
        let thumbnailURL: string;
        if (viewType === RailViewType[RailViewType.LANDSCAPE].toString().toUpperCase()) {
            thumbnailURL = AppConstants.IMAGE_CLOUD_FRONT_URL + AppConstants.PLACEHOLDER_IMAGES_KEY + 'landscape.png';
        } else if (viewType === RailViewType[RailViewType.CIRCLE].toString().toUpperCase()) {
            thumbnailURL = AppConstants.IMAGE_CLOUD_FRONT_URL + AppConstants.PLACEHOLDER_IMAGES_KEY + 'circle.png';
        } else if (viewType === RailViewType[RailViewType.SQUARE].toString().toUpperCase()) {
            thumbnailURL = AppConstants.IMAGE_CLOUD_FRONT_URL + AppConstants.PLACEHOLDER_IMAGES_KEY + 'square.png';
        } else if (viewType === RailViewType[RailViewType.PORTRAIT_2_3].toString().toUpperCase()) {
            thumbnailURL = AppConstants.IMAGE_CLOUD_FRONT_URL + AppConstants.PLACEHOLDER_IMAGES_KEY + 'portrait.png';
        } else if (viewType === RailViewType[RailViewType.PORTRAIT_9_16].toString().toUpperCase()) {
            thumbnailURL = AppConstants.IMAGE_CLOUD_FRONT_URL + AppConstants.PLACEHOLDER_IMAGES_KEY + 'portrait.png';
        } else if (viewType === RailViewType[RailViewType.PORTRAIT].toString().toUpperCase()) {
            thumbnailURL = AppConstants.IMAGE_CLOUD_FRONT_URL + AppConstants.PLACEHOLDER_IMAGES_KEY + 'portrait.png';
        } else if (viewType === RailViewType[RailViewType.CAROUSEL].toString().toUpperCase()) {
            thumbnailURL = AppConstants.IMAGE_CLOUD_FRONT_URL + AppConstants.PLACEHOLDER_IMAGES_KEY + 'banner.png';
        } else {
            thumbnailURL = AppConstants.IMAGE_CLOUD_FRONT_URL + AppConstants.PLACEHOLDER_IMAGES_KEY + 'landscape.png';
        }
        return thumbnailURL;
    }

    getPageNameById(screenId: string): AppPages {
        this.DMS = this.getDmsConfig();

        if (screenId === this.DMS.baseChannels.home) {
            return AppPages.HOME_SCREEN;
        } else if (screenId === this.DMS.baseChannels.exclusive) {
            return AppPages.PREMIUM;
        } else if (screenId === this.DMS.baseChannels.spotlight) {
            return AppPages.SPOTLIGHT;
        } else if (screenId === this.DMS.baseChannels.moreLiveTV) {
            return AppPages.LIVETV;
        } else if (screenId === this.DMS.baseChannels.moreTrending) {
            return AppPages.TRENDING;
        }
        return AppPages.HOME_SCREEN;
    }

    getSEOFriendlyURL(val: string): string {
        let url: string = val.trim().toLowerCase();
        for (let i = 0; i < url.length; i++) {
            // if (url.charAt(i) === ')' || url.charAt(i) === '(') {
            //     url = url.replace(url.charAt(i), '');
            // }

            if (!url.charAt(i).match('[a-z 0-9]')) {
                url = url.replace(url.charAt(i), ' ');
            }

            if (url.charAt(i) === ' ') {
                url = url.replace(url.charAt(i), '-');
            }
        }
        url = encodeURI(url);
        return url;
    }

    replaceAt(index: number, replacement: string, value: string) {
        return value.substr(0, index) + replacement + value.substr(index + 1, value.length);
    }

    stringTrim(str: string, length?: number): string {
        if (length) {
            if (str.length > length) {
                return str.substr(0, length) + '...';
            } else {
                return str;
            }
        } else {
            if (str.length > 20) {
                return str.substr(0, 20) + '...';
            } else {
                return str;
            }
        }
    }

    stringReplace(content: string, toBeReplaced: string, replacedBy: string): string {
        content = content.trim().toLowerCase();

        for (let i = 0; i < content.length; i++) {
            if (content.charAt(i) === toBeReplaced) {
                content = content.replace(content.charAt(i), replacedBy);
            }
        }

        return content;
    }

    getBrowserDetails(): any {
        return this.deviceService.getDeviceInfo()
    }

    isUserLoggedIn(): boolean {
        if (this.isBrowser) {
            if (localStorage.getItem(AppConstants.AUTH_HEADER_KEY)) {
                return true;
            } else {
                return false;
            }
        }
    }

    getAuthKey(): string {
        if (this.isBrowser) {
            if (localStorage.getItem(AppConstants.AUTH_HEADER_KEY)) {
                return localStorage.getItem(AppConstants.AUTH_HEADER_KEY);
            }
        }
    }

    getInitialFromName(name: string): string { //for eg ajay juyal :AJ
        let initials: string = ''
        if (name) {
            let parts: any = name.split(' ');
            if (parts.length === 1) {
                initials = name.substr(0, 2);
            } else {
                for (let i = 0; i < 2; i++) {
                    if (parts[i].length > 0 && parts[i] !== '') {
                        initials += parts[i][0]
                    }
                }
            }
        }
        return initials.toUpperCase();
    }

    getRandomGreyScaleColor(): string {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    logoutUser() {
        this.kalturaAppService.logoutUser().then((ks: any) => {
            if (ks) {
                // Logsout the current branch session and replaces it with the new one
                branch.logout(
                    (err) => {
                    }
                );
                this.snackbarUtilService.showSnackbar('Logged out successfully');
                this.router.navigateByUrl('/');
            }
        }, (reject) => {
            this.snackbarUtilService.showError();
        });
    }

    getDmsConfig(calledFrom?: string): any {
        if (this.isBrowser) {
            let dms = localStorage.getItem(AppConstants.DMS_KEY);
            if (!dms) {
                return null;
            }
            dms = JSON.parse(dms);
            return dms;
        }
    }

    getDeviceId() {
        if (this.isBrowser) {
            let udid = localStorage.getItem(AppConstants.UDID_KEY);
            let user = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS));
            udid = udid + '_' + user.username;
            return udid;
        }
    }

    getLoggedInUserDetails() {
        if (this.isBrowser) {
            let user = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS));
            return user;
        }
    }

    getLoggedInUserSMSDetails() {
        if (this.isBrowser) {
            let user = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
            return user;
        }
    }

    removeElementFromList(list: any[], index: number): any[] {
        list.splice(index, 1);
        return list;
    }

    getAssetRouteUrl(name?, mediaId?, mediaType?, mediaTypeId?, type?, externalId?, startTime?: number, channelId?: string): Observable<any> {
        return new Observable((observer) => {
            let observerData = new UrlObserverDate();
            observerData = {
                url: '/',

            }
            try {
                if (this.getMediaTypeNameById(type) === "Movie" || this.getMediaTypeNameById(type) === "Trailer") {
                    observerData.url = '/watch/movie/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId;
                    observer.next(observerData);

                } else if (this.getMediaTypeNameById(type) === "Web Series") {
                    observerData.url = '/watch/webSeries/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId;
                    observer.next(observerData);

                } else if (this.getMediaTypeNameById(type) === "Web Episode") {
                    observerData.url = '/watch/webEpisode/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId;
                    observer.next(observerData);

                } else if (this.getMediaTypeNameById(type) === "UGC Video") {
                    if (this.isDesktop) {
                        observerData.url = '/watch/ugcVideo/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId;
                        observer.next(observerData);
                    } else {
                        observerData.url = '/mobile-ugc-listing/' + this.getSEOFriendlyURL(name) + '/' + mediaId;
                        observer.next(observerData);
                    }
                } else if (this.getMediaTypeNameById(type) === "Spotlight Series") {
                    observerData.url = '/watch/spotlightSeries/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId;
                    observer.next(observerData);

                } else if (this.getMediaTypeNameById(type) === "Spotlight Episode") {
                    observerData.url = '/watch/spotlightEpisode/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId;
                    observer.next(observerData);

                } else if (this.getMediaTypeNameById(type) === "Short Film") {
                    observerData.url = '/watch/short-films/' + this.getSEOFriendlyURL(name) + '/' + mediaId;
                    observer.next(observerData);

                } else if (this.getMediaTypeNameById(type) === "Linear") {
                    observerData.url = '/watch/channel/' + this.getSEOFriendlyURL(name) + '/' + mediaId;
                    observer.next(observerData);

                } else if (this.getMediaTypeNameById(type) === "Clips") {
                    observerData.url = '/watch/clip/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId;
                    observer.next(observerData);

                } else if (this.getMediaTypeNameById(type) === "UGC Creator") {
                    observerData.url = '/watch/creator/profile/' + mediaId;
                    observer.next(observerData);

                } else if (this.getMediaTypeNameById(type) === "Program") {
                    this.isLiveAsset(mediaId, channelId, startTime).subscribe((res: any) => {
                        if (res.isLive) {
                            observerData.url = '/watch/channel/' + this.getSEOFriendlyURL(res.channelName) + '/' + channelId;
                            observer.next(observerData);
                        } else {
                            observerData.url = '/watch/catchup/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId;
                            observer.next(observerData);
                        }
                    }, error => {
                        observerData.url = '/';
                        console.log(error);
                    });

                } else if (this.getMediaTypeNameById(type) === "UGCIFPImage") {
                    if (this.isUserLoggedIn()) {
                        observerData.url = '/ugc/my-uploads/ifp';
                        observer.next(observerData);

                    } else {
                        observerData.url = null;
                        observer.next(observerData);

                    }
                } else {
                    observerData.url = '/';
                    observer.next(observerData);

                }
            } catch (error) {
                observerData.url = '/';
                observer.next(observerData);

            }
        })
    }

    getMediaTypeNameById(id): string {
        this.DMS = this.getDmsConfig();

        if (id.toString() === this.DMS.params.MediaTypes.Clips)
            return 'Clips'
        // if (id.toString() === DMS.params.MediaTypes.CreatorVideo)
        //     return 'Creator Video';
        else if (id.toString() === this.DMS.params.MediaTypes.Genre)
            return 'Genre'
        else if (id.toString() === this.DMS.params.MediaTypes.Linear)
            return 'Linear'
        else if (id.toString() === this.DMS.params.MediaTypes.Program)
            return 'Program'
        else if (id.toString() === this.DMS.params.MediaTypes.ShortFilm)
            return 'Short Film'
        else if (id.toString() === this.DMS.params.MediaTypes.SpotlightEpisode)
            return 'Spotlight Episode'
        else if (id.toString() === this.DMS.params.MediaTypes.SpotlightSeries)
            return 'Spotlight Series'
        else if (id.toString() === this.DMS.params.MediaTypes.Trailer)
            return 'Trailer'
        // if (id.toString() === DMS.params.MediaTypes.TVEpisode)
        //     return 'TV Episode';
        // if (id.toString() === DMS.params.MediaTypes.TVShowSeries)
        //     return 'TV Show Series';
        else if (id.toString() === this.DMS.params.MediaTypes.UGCCreator)
            return 'UGC Creator'
        else if (id.toString() === this.DMS.params.MediaTypes.UGCVideo)
            return 'UGC Video'
        else if (id.toString() === this.DMS.params.MediaTypes.WebEpisode)
            return 'Web Episode'
        else if (id.toString() === this.DMS.params.MediaTypes.WebSeries)
            return 'Web Series'
        else if (id.toString() === this.DMS.params.MediaTypes.Movie)
            return 'Movie'
        else if (id.toString() === this.DMS.params.MediaTypes.UGCIFPImage)
            return 'UGCIFPImage'
        else
            return null;
    }

    getUserFriendlyMediaTypeNameById(id): string {
        this.DMS = this.getDmsConfig();

        if (id.toString() === this.DMS.params.MediaTypes.Clips)
            return 'Video'
        else if (id.toString() === this.DMS.params.MediaTypes.Linear)
            return 'Channel'
        else if (id.toString() === this.DMS.params.MediaTypes.Program)
            return 'Program'
        else if (id.toString() === this.DMS.params.MediaTypes.ShortFilm)
            return 'Movie'
        else if (id.toString() === this.DMS.params.MediaTypes.SpotlightEpisode)
            return 'Episode'
        else if (id.toString() === this.DMS.params.MediaTypes.SpotlightSeries)
            return 'Series'
        else if (id.toString() === this.DMS.params.MediaTypes.Trailer)
            return 'Trailer'
        else if (id.toString() === this.DMS.params.MediaTypes.UGCCreator)
            return 'UGC Creator'
        else if (id.toString() === this.DMS.params.MediaTypes.UGCVideo)
            return 'Video'
        else if (id.toString() === this.DMS.params.MediaTypes.WebEpisode)
            return 'Episode'
        else if (id.toString() === this.DMS.params.MediaTypes.WebSeries)
            return 'Series'
        else if (id.toString() === this.DMS.params.MediaTypes.Movie)
            return 'Movie'
        else
            return null;
    }

    isLiveAsset(assetId: string, channelId: string, startTime: number): Observable<any> {
        return new Observable((observer) => {
            let channelName: string
            let ksql = "media_id:'" + channelId + "'";
            this.kalturaAppService.searchAsset(null, null, ksql, 1, 1).then((res: any) => {
                if (res.objects) {
                    channelName = res.objects[0].name;
                    return this.kalturaAppService.getChannelSpecificLiveNow(res.objects[0].externalIds, 1, 1).then((res: any) => {
                        let observerData = new ObserverData();
                        observerData = {
                            isLive: false,
                            channelName: null
                        }
                        if (assetId === res.objects[0].id) {
                            observerData.isLive = true;
                            observerData.channelName = channelName;
                            observer.next(observerData);
                        } else if (startTime === res.objects[0].startDate) {
                            observerData.isLive = true;
                            observerData.channelName = channelName;
                            observer.next(observerData);
                        } else if (startTime < res.objects[0].startDate) {
                            observerData.isLive = false;
                            observerData.channelName = null;
                            observer.next(observerData);
                        }
                    }, reject => {
                        console.error(reject)
                    })
                }


            }, reject => {
                console.error("error");
            })
        })
    }

    getUserType(): string {
        if (this.isBrowser) {
            let userDetails: any
            let userType: string;
            userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
            userType = userDetails.UserType;
            return userType
        }
    }

    getContentPrefrenceList(): Observable<any> {

        return new Observable((observer: any) => {
            let observerresData = new ContentPrefencesObserverData();
            observerresData = {
                res: null,

            }
            this.kalturaAppService.contentPreferencesList(20, 1).then(res => {
                observerresData.res = res;
                observer.next(observerresData.res);
            }, reject => {
                observer.next("error")
                this.snackbarUtilService.showError(reject.message);
            });
        })

    }

    //moengageEventTracking with attribute
    moEngageEventTracking(eventName: string, attribute: any) {
        // Moengage.track_event(eventName, {
        //     attribute
        // });
    }

    //moEngageEventTracking with No Attribute
    moEngageEventTrackingWithNoAttribute(eventName: string) {
        // Moengage.track_event(eventName);

    }

    getGTMTag(dataLayerJson: any, eventName: string) {
        // console.log(dataLayer);
        if (this.isUserLoggedIn()) {
            dataLayerJson.user_type = this.getUserTypeAsName();
        }
        dataLayerJson.event = eventName;
        dataLayer.push(dataLayerJson);
    }


    getTitleCase(str: string): string { //for name first letter in capital eg nishant gera - Nishant Gera

        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    }

    getTimeStamp() {
        return new Date().getTime();
    }

    getLogginType() {
        if (this.isBrowser) {
            let user = JSON.parse(localStorage.getItem(AppConstants.IS_DISH_USER));
            return user;
        }
    }

    getGTMUserID() {
        let udid;
        if (this.isBrowser) {
            if (localStorage.getItem(AppConstants.GTM_UDID)) {
                return udid = +localStorage.getItem(AppConstants.GTM_UDID);
            } else {
                let getTimeStamp = this.getTimeStamp();
                localStorage.setItem(AppConstants.GTM_UDID, getTimeStamp.toString());
                return udid = getTimeStamp;
            }
        }
    }

    checkIfPWA(): boolean {
        if (this.isBrowser) {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                return true;
            } else {
                return false;
            }
        }
    }

    pausePlayer() {
        try {
            if (KalturaPlayer.getPlayer("kalturaPlayerTargetId")) {
                KalturaPlayer.getPlayer("kalturaPlayerTargetId").pause()
            }
        } catch (e) {

        }

    }

    playPlayer() {
        try {
            if (KalturaPlayer.getPlayer("kalturaPlayerTargetId")) {
                KalturaPlayer.getPlayer("kalturaPlayerTargetId").play()
            }
        } catch (e) {

        }

    }

    getHeroImageType(imageType: string) {
        switch (imageType) {
            case ImageType[ImageType.CIR]:
                return ImageTypeNames[ImageTypeNames.CIRCLE].toString();
            case ImageType[ImageType.CST]:
                return "CUSTOM";
            case ImageType[ImageType.LDS]:
                return ImageTypeNames[ImageTypeNames.LANDSCAPE_16_9].toString();
            case ImageType[ImageType.LDS2]:
                return "LANDSCAPE";
            case ImageType[ImageType.PR1]:
                return ImageTypeNames[ImageTypeNames.PORTRAIT_9_16].toString()
            case ImageType[ImageType.PR2]:
                return ImageTypeNames[ImageTypeNames.PORTRAIT_2_3].toString()
            case ImageType[ImageType.SQR]:
                return ImageTypeNames[ImageTypeNames.SQUARE].toString()
            default:
                return "LANDSCAPE"

        }
    }

    getUserTypeAsName(): string {
        let userCategory = localStorage.getItem(AppConstants.USER_CATEGORY);
        if (userCategory === '1') {
            userCategory = 'Dish';
        } else if (userCategory === '2') {
            userCategory = 'D2H';
        } else if (userCategory === '3') {
            userCategory = 'Watcho';
        }
        return userCategory;
    }

    getHeaders() {
        let header = new HttpHeaders();
        header.set('Username', 'admin@watcho.com/token');
        header.set('Password', environment.ZENDESK_API_TOKEN);
        header.set("Content-Type", "application/json");
        header.set("Access-Control-Allow-Origin", "*");
        return header;
    }

    getSectionList(): Observable<any> {
        let url = 'https://watcho.zendesk.com/api/v2/help_center/sections.json';
        return this.httpClient.get(url, { headers: this.getHeaders() });
    }

    getArticleListById(id: any): Observable<any> {
        let url = 'https://watcho.zendesk.com/api/v2/help_center/sections/' + id + '/articles.json';
        return this.httpClient.get(url, { headers: this.getHeaders() });
    }

    createTicket(request: any): Observable<any> {
        let url = 'https://watcho.zendesk.com/api/v2/requests';
        return this.httpClient.post(url, request, { headers: this.getHeaders() });
    }

    uploadImageonZD(fileName: any, base64: any) {
        let header = new HttpHeaders().append("Content-Type", "application/binary")
            .append('Authorization', 'admin@watcho.com/token:' + environment.ZENDESK_API_TOKEN);

        let url = 'https://watcho.zendesk.com/api/v2/uploads.json?filename=' + fileName;
        return this.httpClient.post(url, base64, { headers: header });
    }

    getTicketListingById(email: any): Observable<any> {
        let url = environment.ZENDESK_LAMBDA.getTickets + '?email=' + email;
        return this.httpClient.get(url, { headers: this.getHeaders() });
    }

    getTicketComment(ticketId: any): Observable<any> {
        let url = environment.ZENDESK_LAMBDA.getTicketsComments + '?ticketId=' + ticketId + '&sort_order=desc';
        return this.httpClient.get(url, { headers: this.getHeaders() });
    }

    updateTicket(ticketId: any, body: any): Observable<any> {
        let url = environment.ZENDESK_LAMBDA.addComment + '?ticketId=' + ticketId;
        return this.httpClient.put(url, body, { headers: this.getHeaders() });
    }

    getCountParsedValue(count: number): string {
        if (count >= 1000 && count <= 999999) { // thousands
            let likeCountValue = ((count / 1000)).toString();
            let likeValue: string[] = likeCountValue.split('.');
            if (likeValue.length > 1) {
                if (likeValue[1].substr(0, 1) === "0") {
                    return (likeValue[0]) + 'K';
                } else {
                    return (likeValue[0] + '.' + likeValue[1].substr(0, 1) + 'K');
                }
            } else {
                return (likeValue[0]) + 'K';
            }

        } else if (count >= 1000000 && count <= 999999999) { // millions
            let likeCountValue = ((count / 1000000)).toString();
            let likeValue: string[] = likeCountValue.split('.');
            if (likeValue.length > 1) {
                if (likeValue[1].substr(0, 1) === "0") {
                    return (likeValue[0]) + 'M';
                } else {
                    return (likeValue[0] + '.' + likeValue[1].substr(0, 1) + 'M');
                }
            } else {
                return (likeValue[0]) + 'M';
            }
        } else if (count >= 1000000000 && count <= 999999999999) { // billions
            let likeCountValue = ((count / 1000000000)).toString();
            let likeValue: string[] = likeCountValue.split('.');
            if (likeValue.length > 1) {
                if (likeValue[1].substr(0, 1) === "0") {
                    return (likeValue[0]) + 'B';
                } else {
                    return (likeValue[0] + '.' + likeValue[1].substr(0, 1) + 'B');
                }
            } else {
                return (likeValue[0]) + 'B';
            }
        } else {
            return count.toString();
        }
    }

    getNameInitials(element, seriesNameInitials: boolean, name?: string) {
        if (name) {
            return name.split(" ").length > 1 ? name.split(" ").map((n, i, a) => i === 0 || i + 1 === a.length ? n[0] : null).join("").toUpperCase() : name.substring(0, 2).toUpperCase();
        } else {
            if (seriesNameInitials) {
                return element.tags["Series Name"] ? element.tags["Series Name"].objects ? element.tags["Series Name"].objects[0].value.split(" ").length > 1 ? element.tags["Series Name"].objects[0].value.split(" ").map((n, i, a) => i === 0 || i + 1 === a.length ? n[0] : null).join("").toUpperCase() : element.tags["Series Name"].objects[0].value.substring(0, 2).toUpperCase() : null : null;
            } else {
                return element.name.split(" ").length > 1 ? element.name.split(" ").map((n, i, a) => i === 0 || i + 1 === a.length ? n[0] : null).join("").toUpperCase() : element.name.substring(0, 2).toUpperCase();
            }
        }
    }

    getShowContestStatus(): boolean {
        if (this.getDmsConfig().params.showContest) {
            return this.getDmsConfig().params.showContest;
        }
        return false;
    }

    multiRequestForAddAndDeleteGenres(userInterest: any): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient.post(environment.MULTIREQUEST_API_URL, userInterest, { headers }).pipe((res: Observable<HttpResponse<any>>) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    getUserInterestList(): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        var ks = this.isBrowser ? localStorage.getItem(AppConstants.KS_KEY) : '';
        let command = {
            "apiVersion": "5.2.8.14099",
            "ks": ks
        }
        return this.httpClient.post(environment.USERINTEREST_API_URL, command, { headers }).pipe((res: Observable<HttpResponse<any>>) => {
            return res;
        }, (error) => {
            return error;
        });
    }
}