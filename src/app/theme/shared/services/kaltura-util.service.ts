import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { KalturaDeviceStatus, KalturaPurchaseStatus } from 'kaltura-ott-typescript-client/api/types';
import { Observable } from 'rxjs/Observable';
import { RailViewType } from "../models/rail.model";
import { ParentalPinValidatorComponent } from '../parental-pin-validator/parental-pin-validator.component';
import { AppConstants, EntitlementConstants } from "../typings/common-constants";
import { Images, TagsObject } from "../typings/kaltura-response-typings";
import { AppUtilService } from './app-util.service';
import { KalturaAppService } from './kaltura-app.service';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class KalturaUtilService {

    isBrowser: any
    DMS: any;
    screenName: string[] = ["catchUpDetail",
        "exclusive",
        "forwardedEPGDetail",
        "home",
        "ifpChannel",
        "liveTVDetail",
        "moreLiveTV",
        "moreTrending",
        "movieDetail",
        "shortFilmDetail",
        "spotlight",
        "spotlightEpisodeDetail",
        "spotlightSeriesDetail",
        "staticSearch",
        "sunburn",
        "ugcCreatorProfileDetail",
        "ugcVideoDetail",
        "webEpisodeDetail",
        "webSeriesDetail"
    ]
    browserDetails: any;


    constructor(private appUtilService: AppUtilService, private kalturaAppService: KalturaAppService,
        @Inject(PLATFORM_ID) private platformId, public modalService: NgbModal) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.browserDetails = this.appUtilService.getBrowserDetails();
    }

    transformImage(url: string, width: number, height: number, quality: number): string {
        let supportWebpCluodFrontUrl: string = this.browserDetails.browser !== "Safari" ? environment.WEBP_JPEG_CLOUDFRONT_URL + width + 'x' + height + '/' + environment.WEBP_CLOUDFRONT_URL : environment.WEBP_JPEG_CLOUDFRONT_URL + width + 'x' + height +  '/' + environment.JPEG_CLOUDFRONT_URL;
        let imgUrl: string = url
        imgUrl += '/width/' + width
        imgUrl += '/height/' + height
        imgUrl += '/quality/' + quality
        return supportWebpCluodFrontUrl+imgUrl;
    }

    getImageByOrientation(imagesAsset: Images[], viewType: string, width?: number, height?: number, quality?: number, isMobile?: boolean) {
        let thumbnailURL: string = ''

        if (!viewType) {
            viewType = RailViewType[RailViewType.LANDSCAPE].toString()
        }
        viewType = viewType.toUpperCase();

        if (imagesAsset && viewType && imagesAsset.length > 0) {

            imagesAsset.forEach((element, index) => {
                if (viewType === RailViewType[RailViewType.LANDSCAPE].toString().toUpperCase()) {
                    if (element.ratio === '16:9') {
                        let w, h, q
                        if (isMobile) {
                            w = 315
                            h = 177
                            q = 80
                        } else {
                            w = 315
                            h = 177
                            q = 80
                        }
                        if (width) {
                            w = width
                        }
                        if (height) {
                            h = height
                        }
                        if (quality) {
                            q = quality
                        }
                        thumbnailURL = this.transformImage(element.url, w, h, q)
                    }
                } else if (viewType === RailViewType[RailViewType.CIRCLE].toString().toUpperCase()) {
                    if (element.ratio === '1:1') {
                        let w, h, q
                        if (isMobile) {
                            w = 250
                            h = 250
                            q = 80
                        } else {
                            w = 108
                            h = 108
                            q = 80
                        }
                        if (width) {
                            w = width
                        }
                        if (height) {
                            h = height
                        }
                        if (quality) {
                            q = quality
                        }
                        thumbnailURL = this.transformImage(element.url, w, h, q)
                    }
                } else if (viewType === RailViewType[RailViewType.PORTRAIT_2_3].toString().toUpperCase()) {
                    if (element.ratio === '2:3') {
                        let w, h, q
                        if (isMobile) {
                            w = 180
                            h = 270
                            q = 80
                        } else {
                            w = 220
                            h = 330
                            q = 80
                        }
                        if (width) {
                            w = width
                        }
                        if (height) {
                            h = height
                        }
                        if (quality) {
                            q = quality
                        }
                        thumbnailURL = this.transformImage(element.url, w, h, q)
                    }
                } else if (viewType === RailViewType[RailViewType.SQUARE].toString().toUpperCase()) {
                    if (element.ratio === '1:1') {
                        let w, h, q
                        if (isMobile) {
                            w = 240
                            h = 240
                            q = 80
                        } else {
                            w = 210
                            h = 210
                            q = 80
                        }
                        if (width) {
                            w = width
                        }
                        if (height) {
                            h = height
                        }
                        if (quality) {
                            q = quality
                        }
                        thumbnailURL = this.transformImage(element.url, w, h, q)
                    }
                } else if (viewType === RailViewType[RailViewType.PORTRAIT].toString().toUpperCase()) {
                    if (element.ratio === '9:16') {
                        let w, h, q
                        if (isMobile) {
                            w = 180
                            h = 320
                            q = 80
                        } else {
                            w = 220
                            h = 391
                            q = 80
                        }
                        if (width) {
                            w = width
                        }
                        if (height) {
                            h = height
                        }
                        if (quality) {
                            q = quality
                        }
                        thumbnailURL = this.transformImage(element.url, w, h, q)
                    }
                } else if (viewType === RailViewType[RailViewType.Linear].toString().toUpperCase()) {
                    // this has been done to ensure that this app works for streaming stick app
                    if (element.ratio === '1:1') {
                        let w, h, q
                        if (isMobile) {
                            w = 315
                            h = 177
                            q = 80
                        } else {
                            w = 315
                            h = 177
                            q = 80
                        }
                        if (width) {
                            w = width
                        }
                        if (height) {
                            h = height
                        }
                        if (quality) {
                            q = quality
                        }
                        thumbnailURL = this.transformImage(element.url, w, h, q)
                    }
                } else if (viewType === RailViewType[RailViewType.ContinueWatching].toString().toUpperCase()) {
                    if (element.ratio === '16:9') {
                        let w, h, q
                        if (isMobile) {
                            w = 315
                            h = 177
                            q = 80
                        } else {
                            w = 315
                            h = 177
                            q = 80
                        }
                        if (width) {
                            w = width
                        }
                        if (height) {
                            h = height
                        }
                        if (quality) {
                            q = quality
                        }
                        thumbnailURL = this.transformImage(element.url, w, h, q)
                    }
                } else if (viewType === RailViewType[RailViewType.Recommended].toString().toUpperCase()) {
                    if (element.ratio === '16:9') {
                        let w, h, q
                        if (isMobile) {
                            w = 315
                            h = 177
                            q = 80
                        } else {
                            w = 315
                            h = 177
                            q = 80
                        }
                        if (width) {
                            w = width
                        }
                        if (height) {
                            h = height
                        }
                        if (quality) {
                            q = quality
                        }
                        thumbnailURL = this.transformImage(element.url, w, h, q)
                    }
                } else if (viewType === RailViewType[RailViewType.VOD].toString().toUpperCase()) {
                    if (element.ratio === '16:9') {
                        let w, h, q
                        if (isMobile) {
                            w = 315
                            h = 177
                            q = 80
                        } else {
                            w = 315
                            h = 177
                            q = 80
                        }
                        if (width) {
                            w = width
                        }
                        if (height) {
                            h = height
                        }
                        if (quality) {
                            q = quality
                        }
                        thumbnailURL = this.transformImage(element.url, w, h, q)
                    }
                } else if (viewType === RailViewType[RailViewType.CAROUSEL].toString().toUpperCase()) {
                    if (element.ratio === '120:37') {
                        let w, h, q
                        if (isMobile) {
                            w = 320
                            h = 180
                            q = 80
                        } else {
                            w = 1170
                            h = 362
                            q = 80
                        }
                        if (width) {
                            w = width
                        }
                        if (height) {
                            h = height
                        }
                        if (quality) {
                            q = quality
                        }
                        thumbnailURL = this.transformImage(element.url, w, h, q)
                    }
                } else if (viewType === RailViewType[RailViewType.SERIESBANNER].toString().toUpperCase()) {
                    if (element.ratio === '120:37' || element.ratio === '16:9') {
                        let w, h, q
                        if (isMobile) {
                            w = 320
                            h = 180
                            q = 80
                        } else {
                            w = 1170
                            h = 362
                            q = 80
                        }
                        if (width) {
                            w = width
                        }
                        if (height) {
                            h = height
                        }
                        if (quality) {
                            q = quality
                        }
                        thumbnailURL = this.transformImage(element.url, w, h, q)
                    }

                } else if (viewType === "MEMBERSHIP") {
                    if (element.ratio === '120:37') {
                        let w, h, q
                        if (isMobile) {
                            w = 344
                            h = 164
                            q = 80
                        } else {
                            w = 1170
                            h = 362
                            q = 80
                        }
                        if (width) {
                            w = width
                        }
                        if (height) {
                            h = height
                        }
                        if (quality) {
                            q = quality
                        }
                        thumbnailURL = this.transformImage(element.url, w, h, q)
                    }
                }
                else if (viewType === RailViewType[RailViewType.UGCIFP].toString().toUpperCase()) {
                    if (!isMobile && element.ratio === '120:37') {
                        let w, h, q
                        if (isMobile) {
                            w = 300
                            h = 167
                            q = 80
                        } else {
                            w = 1170
                            h = 200
                            q = 80
                        }
                        if (width) {
                            w = width
                        }
                        if (height) {
                            h = height
                        }
                        if (quality) {
                            q = quality
                        }
                        thumbnailURL = this.transformImage(element.url, w, h, q)
                    }
                    if (isMobile && element.ratio === '16:9') {
                        let w, h, q
                        if (isMobile) {
                            w = 300
                            h = 167
                            q = 80
                        } else {
                            w = 1170
                            h = 200
                            q = 80
                        }
                        if (width) {
                            w = width
                        }
                        if (height) {
                            h = height
                        }
                        if (quality) {
                            q = quality
                        }
                        thumbnailURL = this.transformImage(element.url, w, h, q)
                    }
                }
            })

        }

        if (!thumbnailURL) {
            imagesAsset.forEach((element, index) => {
                if (element.ratio === '16:9') {
                    let w, h, q
                    if (isMobile) {
                        w = 315
                        h = 177
                        q = 80
                    } else {
                        w = 315
                        h = 177
                        q = 80
                    }
                    if (width) {
                        w = width
                    }
                    if (height) {
                        h = height
                    }
                    if (quality) {
                        q = quality
                    }
                    thumbnailURL = this.transformImage(element.url, w, h, q)
                }
            })
        }

        if (!thumbnailURL) {
            thumbnailURL = this.appUtilService.getDefaultThumbnail(viewType)
        }



        return thumbnailURL
    }

    getGenre(genreObject: TagsObject): string {
        let genreStr = ''

        if (genreObject) {

            genreObject.objects.forEach((element, index) => {
                genreStr += element.value + ', '
            })

            genreStr = genreStr.substr(0, genreStr.length - 2)

        }
        return genreStr
    }

    getTagsObjectValue(object: TagsObject | any): string {
        let str = ''

        if (object) {

            object.objects.forEach((element, index) => {
                str += element.value + ', '
            })

            str = str.substr(0, str.length - 2)

        }
        return str
    }

    getMetasObjectValue(object: any, key: string) {
        return object[key].value
    }

    getMediaTypeNameById(id): string {
        this.DMS = this.appUtilService.getDmsConfig('kal app');

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
        else if (id.toString() === this.DMS.params.MediaTypes.SERIESBANNER)
            return 'SERIESBANNER'
        else
            return null;
    }

    getMediaTime(val: number) {
        var hrs = Math.floor(val / 3600);
        var mins = Math.floor((val % 3600) / 60);
        var secs = val % 60;
        var ret = "";

        if (hrs > 0) {
            ret = " " + hrs + "h " + mins + "m " + secs + "s";
        } else {
            if (mins > 0) {
                ret = " " + mins + "m " + secs + "s";
            } else if (secs > 0) {
                ret = " " + secs + "s";
            } else {
                ret = "";
            }
        }
        return ret;
    }

    checkIsKsExpired(error) {
        if (error.code === '500016') {
            this.kalturaAppService.makeAnonymusLogin().then(ks => {
                if (this.isBrowser) {
                    localStorage.setItem(AppConstants.KS_KEY, ks)
                }
            }, reject => {
                console.error(reject)
            })
        }
    }


    checkIfUserCanWatchAsset(assetId: number, fileIdIn: string, parentalPassedValue: boolean): Observable<any> {
        return new Observable((observer) => {
            let play = EntitlementConstants.PLAY;
            let forPurchaseSubscriptionOnly = EntitlementConstants.NOT_SUBSCRIBED;
            let error = EntitlementConstants.ERROR;
            let geoError = EntitlementConstants.GEO_LOCATION_BLOCKED_ERROR;
            let deviceNotActiveError = EntitlementConstants.DEVICE_NOT_ACTIVE;
            let userNotLoggedInError = EntitlementConstants.USER_NOT_LOGGED_IN;
            let parentalError = EntitlementConstants.PARENTAL_ERROR;
            let parentalPassed = EntitlementConstants.PARENTAL_PASSED

            this.kalturaAppService.getGeoLocationUserAssetRule(assetId).then(responseGeo => {
                if (responseGeo.totalCount > 0 && !parentalPassedValue) {
                    let geoErrorFound: boolean = false;
                    let parentalErrorFound: boolean = false;
                    responseGeo.objects.forEach(element => {
                        if (element.ruleType === 'geo') {
                            geoErrorFound = true
                            observer.next(geoError);
                        } else if (element.ruleType === 'parental') {
                            parentalErrorFound = true
                        }
                    })
                    if (this.appUtilService.isUserLoggedIn() && !geoErrorFound) {
                        return this.kalturaAppService.getProductPriceList(fileIdIn).then(responseProductPrice => {
                            if (responseProductPrice.totalCount > 0) {
                                // if free and subscriptionPurchased then  allow play
                                if (responseProductPrice.objects[0].purchaseStatus === "free"
                                    || responseProductPrice.objects[0].purchaseStatus === "subscription_purchased") {
                                    // entitlement passed then check for parental
                                    if (parentalErrorFound) {
                                        // if (sessionStorage.getItem('parental-allowed') != 'true') {
                                        const modalRef = this.modalService.open(ParentalPinValidatorComponent, { backdrop: 'static', size: 'sm' });
                                        modalRef.componentInstance.name = 'Enter PIN for watching this video';
                                        modalRef.componentInstance.pinOptions = 'validate';
                                        modalRef.componentInstance.buttonName = "Validate";
                                        modalRef.componentInstance.playerValidation = true;
                                        modalRef.result.then(() => {
                                            // sessionStorage.setItem('parental-allowed', "true");
                                            observer.next(parentalPassed)
                                        }, () => { observer.next(parentalError); })
                                        // }
                                        // else {
                                        //     observer.next(parentalPassed)
                                        // }
                                    }
                                } else if (responseProductPrice.objects[0].purchaseStatus === "for_purchase_subscription_only") {
                                    observer.next(forPurchaseSubscriptionOnly);
                                } else {
                                    observer.next(forPurchaseSubscriptionOnly);
                                }
                            }
                        }, rejectProductPrice => {
                            observer.next(error);
                        });
                    }
                }
                else {
                    // Geo Location passed now check if user is  logged in
                    if (this.appUtilService.isUserLoggedIn()) {
                        // Check House hold
                        return this.kalturaAppService.getHouseholdList().then(responseHouseHold => {
                            // Check If device active
                            let isDeviceActive = false;
                            if (responseHouseHold.objects.length > 0) {
                                responseHouseHold.objects.forEach(kalturaHouseholdDevice => {
                                    const udid = this.appUtilService.getDeviceId();
                                    if (kalturaHouseholdDevice.udid === udid
                                        && kalturaHouseholdDevice.status === "ACTIVATED") {
                                        isDeviceActive = true;
                                    }
                                })
                            }
                            if (!isDeviceActive) {
                                observer.next(deviceNotActiveError);
                            } else {
                                // If  Device active then call house hold
                                // Check Product  Price
                                return this.kalturaAppService.getProductPriceList(fileIdIn).then(responseProductPrice => {
                                    if (responseProductPrice.totalCount > 0) {
                                        // if free and subscriptionPurchased then  allow play
                                        if (responseProductPrice.objects[0].purchaseStatus === "free"
                                            || responseProductPrice.objects[0].purchaseStatus === "subscription_purchased") {
                                            observer.next(play);
                                        } else if (responseProductPrice.objects[0].purchaseStatus === "for_purchase_subscription_only") {
                                            observer.next(forPurchaseSubscriptionOnly);
                                        } else {
                                            observer.next(forPurchaseSubscriptionOnly);
                                        }
                                    }
                                }, rejectProductPrice => {
                                    observer.next(error);
                                });

                            }
                        }, rejectHouseHold => {
                            observer.next(error);
                        });
                    } else {
                        // check Product Price
                        return this.kalturaAppService.getProductPriceList(fileIdIn).then(responseProductPrice => {
                            if (responseProductPrice.totalCount > 0) {
                                // if free and subscriptionPurchased then  allow play
                                if (responseProductPrice.objects[0].purchaseStatus === "free") {
                                    observer.next(play);
                                } else {
                                    observer.next(userNotLoggedInError);
                                }
                            }
                        }, rejectProductPrice => {
                            observer.next(error);
                        });
                    }
                }
            }, rejectGeo => {
                observer.next(error);
            });
        });
    }

    // isLiveAsset(assetId: string, channelId: string, startTime: number): Observable<any> {
    //     return new Observable((observer) => {
    //         let channelName: string
    //         let ksql = "media_id:'" + channelId + "'";
    //         this.kalturaAppService.searchAsset(null, null, ksql, 1, 1).then((res: any) => {
    //             channelName = res.objects[0].name;
    //             return this.kalturaAppService.getChannelSpecificLiveNow(res.objects[0].externalIds, 1, 1).then((res: any) => {
    //                 let observerData = new ObserverData();
    //                 observerData = {
    //                     isLive: false,
    //                     channelName: null
    //                 }
    //                 if (assetId === res.objects[0].id) {
    //                     observerData.isLive = true;
    //                     observerData.channelName = channelName;
    //                     observer.next(observerData);
    //                 } else if (startTime === res.objects[0].startDate) {
    //                     observerData.isLive = true;
    //                     observerData.channelName = channelName;
    //                     observer.next(observerData);
    //                 } else if (startTime < res.objects[0].startDate) {
    //                     observerData.isLive = false;
    //                     observerData.channelName = null;
    //                     observer.next(observerData);
    //                 }
    //             }, reject => {
    //                 console.error(reject)
    //             })

    //         }, reject => {
    //             console.error("error");
    //         })
    //     })
    // }


    isScreen(screenId: string): boolean {
        let status: boolean;
        let statusFound: boolean = false;
        this.DMS = this.appUtilService.getDmsConfig('kal app');

        Object.keys(environment.ENVEU.SCREEN_IDS).forEach((element) => {
            if (!statusFound) {
                if (+environment.ENVEU.SCREEN_IDS[element] === +screenId) {
                    status = true;
                    statusFound = true;
                } else {
                    status = false
                }
            }
        });
        return status
    }

}