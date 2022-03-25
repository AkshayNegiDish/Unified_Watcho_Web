import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { environment } from '../../../../environments/environment';
import { AppConstants } from '../typings/common-constants';
import { LoginMessageService } from './auth-message.service';

declare var KalturaConfiguration, KalturaClient, KalturaOttUserService, KalturaOttCategoryService, KalturaChannelService,
    KalturaAssetService, KalturaProductPriceService, KalturaAppTokenService, KalturaHouseholdService, KalturaHouseholdDeviceService,
    KalturaPersonalListService, KalturaFollowTvSeriesService, KalturaPersonalListService, KalturaAssetHistoryService, KalturaUserAssetRuleService,
    KalturaAssetStatisticsService, KalturaInboxMessageService, KalturaParentalRuleService, KalturaPinService;

@Injectable({
    providedIn: 'root'
})
export class KalturaAppJSService {

    isBrowser: any;
    kalturaDMS: any;
    DMS: any;
    partnerId = "487";
    _kalturaClient: any;


    constructor(@Inject(PLATFORM_ID) public platformId, private loginMessageService: LoginMessageService) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            if (localStorage.getItem(AppConstants.DMS_KEY)) {
                this.initializeClient();
            }
            this.DMS = localStorage.getItem(AppConstants.DMS_KEY);
            if (!this.DMS) {
                this.DMS = null;
            }
            this.DMS = JSON.parse(this.DMS);
        }
    }

    initializeClient() {
        if (this.isBrowser) {
            this.kalturaDMS = JSON.parse(localStorage.getItem(AppConstants.DMS_KEY));
            this.partnerId = this.kalturaDMS.version.partnerid;
            var kconfig = new KalturaConfiguration(this.kalturaDMS.version.partnerid);
            kconfig.serviceUrl = this.kalturaDMS.params.Gateways.JsonGW;;
            this._kalturaClient = new KalturaClient(kconfig);
            this.setKs();
        }
    }

    kalturaClient(): any {
        this.initializeClient();
        return this._kalturaClient;
    }

    setKs() {
        if (this.isBrowser && localStorage.getItem(AppConstants.KS_KEY)) {
            this._kalturaClient.setKs(localStorage.getItem(AppConstants.KS_KEY));
        }
    }

    makeAnonymusLogin(): Promise<any> {
        return new Promise(
            (resolve, reject) => {
                KalturaOttUserService.anonymousLogin(this.partnerId, null).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.message);
                    localStorage.setItem(AppConstants.KS_KEY, entry.result.ks);
                    this.setKs();
                    // console.log(entry.result.ks);
                    resolve(entry.result.ks);
                });
            });
    }


    logoutUser(): Promise<any> {
        return this.logout().then(res => {
            return this.makeAnonymusLogin().then(ks => {
                this.loginMessageService.sendLoginMessage(false);
                if (this.isBrowser) {
                    localStorage.removeItem(AppConstants.AUTH_HEADER_KEY);
                    // localStorage.removeItem(AppConstants.KS_KEY);
                    localStorage.removeItem(AppConstants.USER_DETAILS);
                    localStorage.removeItem(AppConstants.USER_DETAILS_SMS)
                    localStorage.setItem(AppConstants.KS_KEY, ks);
                    localStorage.removeItem(AppConstants.IS_DISH_USER);
                    localStorage.removeItem(AppConstants.AUTOPLAY);
                    localStorage.removeItem(AppConstants.VIDEO_QUALITY);
                    localStorage.removeItem(AppConstants.USER_CATEGORY);
                }
            }, reject => {
                return reject;
            });
        }, reject => {
            return reject;
        });

    }

    logout(): Promise<boolean> {
        return new Promise(
            (resolve, reject) => {
                KalturaOttUserService.logout().execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(false);
                    resolve(true);
                });
            });
    }

    getOTTCategory(categoryId: string): Promise<any> {
        this.initializeClient();
        return new Promise(
            (resolve, reject) => {
                KalturaOttCategoryService.get(categoryId).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getOTTChannel(channelId: number): Promise<any> {
        return new Promise(
            (resolve, reject) => {
                KalturaChannelService.get(channelId).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getAssetById(assetId: number, pageIndex: number, pageSize: number, ksql?: string, orderBy?: string, ): Promise<any> {

        var filter: any
        if (orderBy) {
            filter = {
                objectType: "KalturaChannelFilter",
                orderBy: orderBy,
                idEqual: assetId,
                kSql: ksql
            };
        } else {
            filter = {
                objectType: "KalturaChannelFilter",
                idEqual: assetId
            };
        }

        var pager = {
            objectType: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        };

        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(filter, pager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });

    }


    searchAsset(query: string, id: any, ksql: string, pageIndex: number, pageSize: number, orderBy?: string): Promise<any> {
        //TODO:
        var filter: any;
        filter.objectType = "KalturaSearchAssetFilter";

        if (id) {
            filter.typeIn = id.toString();
        }
        if (orderBy) {
            filter.kSql = ksql;
            filter.orderBy = orderBy
        } else {
            filter.kSql = ksql;
        }

        let pager = {
            objectType: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        }

        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(filter, pager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }


    kalturaSearchAsset(ksql: string, mediaType: number, pageIndex: number, pageSize: number): Promise<any> {

        var filter: any;
        filter = {
            objectType: "KalturaSearchAssetFilter",
            typeIn: mediaType.toString(),
        }
        if (ksql) {
            filter.kSql = ksql;
        }

        var pager = {
            objectType: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        };

        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(filter, pager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getMediaAssetById(mediaId: string, assetReferenceType?: string): Promise<any> {
        var assetReference: string;
        if (assetReferenceType === "epg_internal") {
            assetReference = "epg_internal";
        } else {
            assetReference = "media"
        }
        // KalturaMediaAsset
        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.get(mediaId, assetReference).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getProductPriceList(fileIdIn: string): Promise<any> {
        var kalturaProductPriceFilter = {
            objectType: "KalturaProductPriceFilter",
            fileIdIn: fileIdIn
        };
        return new Promise(
            (resolve, reject) => {
                KalturaProductPriceService.listAction(kalturaProductPriceFilter).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getAssetDetailBySeriesId(seriesId: string, typeIn: number): Promise<any> {
        let ksql = "SeriesId='" + seriesId + "'";
        var kalturaSearchAssetFilter = {
            objectType: "KalturaSearchAssetFilter",
            typeIn: typeIn.toString(),
            orderBy: "NAME_ASC",
            kSql: ksql
        };

        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(kalturaSearchAssetFilter, null).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getNumberOfEpisodesInSeason(SeriesId: string, seasonNo: string, typeIn: string, pageIndex: number, pageSize: number): Promise<any> {

        var ksql = "(and SeriesId = '" + SeriesId + "' Season number='" + seasonNo + "')";

        var kalturaDynamicOrderBy = {
            objectType: "KalturaDynamicOrderBy",
            orderBy: "META_ASC",
            name: 'Episode number'
        };
        var filter = {
            objectType: "KalturaSearchAssetFilter",
            typeIn: typeIn,
            kSql: ksql,
            dynamicOrderBy: kalturaDynamicOrderBy
        };

        var pager = {
            c: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        };

        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(filter, pager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    userLogin(username: string, password: string): Promise<any> {
        var udid;
        if (this.isBrowser) {
            if (localStorage.getItem(AppConstants.UDID_KEY)) {
                udid = localStorage.getItem(AppConstants.UDID_KEY);
                udid += '_' + username;
            } else {
                udid = 'WEB-' + UUID.UUID();
                localStorage.setItem(AppConstants.UDID_KEY, udid);
                udid += '_' + username;
            }
        }
        return new Promise(
            (resolve, reject) => {
                KalturaOttUserService.login(this.kalturaDMS.version.partnerid, username, password, null, udid).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getAllChannelEPG(pageIndex: number, pageSize: number): Promise<any> {

        var pager = {
            objectType: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        };

        var filter = {
            objectType: "KalturaChannelFilter",
            idEqual: +environment.ALL_CHANNEL_ID
        };

        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(filter, pager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getChannelEpg(epgChannelId: number, startDate: number, endDate: number, pageIndex: number, pageSize: number): Promise<any> {
        var ksql = "(and epg_channel_id = '" + epgChannelId + "' start_date>='" + startDate + "' end_date<='" + endDate + "')";
        var filter = {
            objectType: "KalturaSearchAssetFilter",
            orderBy: "START_DATE_ASC",
            kSql: ksql
        };

        var pager = {
            objectType: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        };

        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(filter, pager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    addToken(): Promise<any> {

        var kalturaAppToken = {
            objectType: "KalturaAppToken",
            expiry: Math.ceil((new Date().setFullYear(new Date().getFullYear() + 1)) / 1000),
            sessionDuration: 604800,
            hashType: "SHA256"
        };
        return new Promise(
            (resolve, reject) => {
                KalturaAppTokenService.add(kalturaAppToken).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getHousehold(): Promise<any> {
        return new Promise(
            (resolve, reject) => {
                KalturaHouseholdService.get(null).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    deleteHousehold(deviceId: any): Promise<boolean> {
        return new Promise(
            (resolve, reject) => {
                KalturaHouseholdDeviceService.deleteAction(deviceId).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    addHouseholdDevice(browserDetail): Promise<any> {

        var udid: any = null;
        var user: any = null;
        if (this.isBrowser) {
            udid = localStorage.getItem(AppConstants.UDID_KEY);
            user = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS));
        }
        udid += '_' + user.username;
        var kalturaHouseholdDevice = {
            objectType: "KalturaHouseholdDevice",
            brandId: 22,
            udid: udid,
            name: browserDetail.browser + ' ' + browserDetail.os + ' ' + browserDetail.browser_version
        };
        return new Promise(
            (resolve, reject) => {
                KalturaHouseholdDeviceService.add(kalturaHouseholdDevice).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getHouseholdList(): Promise<any> {
        return new Promise(
            (resolve, reject) => {
                KalturaHouseholdDeviceService.listAction(null).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getOttUser(): Promise<any> {
        return new Promise(
            (resolve, reject) => {
                KalturaOttUserService.get().execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    contentPreferencesList(pageSize: number, pageIndex: number): Promise<any> {
        var filter = {
            objectType: "KalturaSearchAssetFilter",
            typeIn: this.kalturaDMS.params.MediaTypes.Genre,
            orderBy: "NAME_DESC"
        };

        var pager = {
            objectType: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        };

        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(filter, pager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    updateContentPrefrences(content: string): Promise<any> {
        var kalturaStringValue = {
            objectType: "KalturaStringValue",
            value: content
        };
        return new Promise(
            (resolve, reject) => {
                KalturaOttUserService.get('ContentPrefrences', kalturaStringValue).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getPersonalList(id: number, pageSize: number, pageIndex: number): Promise<any> {
        var kalturaPersonalListFilter = {
            objectType: "KalturaPersonalListFilter",
            partnerListTypeIn: id.toString()
        };

        var kalturaFilterPager = {
            objectType: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        };
        return new Promise(
            (resolve, reject) => {
                KalturaPersonalListService.listAction(kalturaPersonalListFilter, kalturaFilterPager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getFollowedSeries(): Promise<any> {
        let kalturaFollowTvSeriesFilter = {
            objectType: "KalturaFollowTvSeriesFilter"
        };
        return new Promise(
            (resolve, reject) => {
                KalturaFollowTvSeriesService.listAction(kalturaFollowTvSeriesFilter, null).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });

    }

    unfollowTvSeries(assetId: number): Promise<boolean> {
        return new Promise(
            (resolve, reject) => {
                KalturaFollowTvSeriesService.listAction(assetId, null).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    personalListDeleteAction(personalListId: number): Promise<void> {
        return new Promise(
            (resolve, reject) => {
                KalturaPersonalListService.deleteAction(personalListId, null).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    personalListAddAction(name: string, ksql: string, partnerListType: number): Promise<any> {
        var kalturaPersonalList = {
            objectType: "KalturaPersonalList",
            name: name,
            ksql: ksql,
            partnerListType: partnerListType
        };
        return new Promise(
            (resolve, reject) => {
                KalturaPersonalListService.add(kalturaPersonalList).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    followTvSeries(assetId: number): Promise<any> {
        var kalturaFollowTVSeries = {
            objectType: "KalturaFollowTvSeries",
            assetId: assetId
        };
        return new Promise(
            (resolve, reject) => {
                KalturaFollowTvSeriesService.add(kalturaFollowTVSeries).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getAssetHistory(daysLessThanOrEqual: number, statusEqual: string, pageSize: number, pageIndex: number): Promise<any> {
        var kalturaAssetHistoryFilter = {
            objectType: "KalturaAssetHistoryFilter",
            daysLessThanOrEqual: daysLessThanOrEqual,
            statusEqual: statusEqual
        };

        var kalturaFilterPager = {
            objectType: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        };
        // assetHistoryListAction.respo
        return new Promise(
            (resolve, reject) => {
                KalturaAssetHistoryService.listAction(kalturaAssetHistoryFilter, kalturaFilterPager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getGeoLocationUserAssetRule(assetIdEqual: number): Promise<any> {
        var filter = {
            objectType: "KalturaUserAssetRuleFilter",
            assetIdEqual: assetIdEqual,
            assetTypeEqual: 1
        };

        return new Promise(
            (resolve, reject) => {
                KalturaUserAssetRuleService.listAction(filter).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getHouseHoldDevice(udid: any): Promise<any> {
        return new Promise(
            (resolve, reject) => {
                KalturaHouseholdDeviceService.add(udid).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getYouMayAlsoLike(assetId: number, ksql: string, pageIndex: number, pageSize: number): Promise<any> {
        let kalturaRelatedFilter = {
            objectType: "KalturaRelatedFilter",
            idEqual: assetId,
            kSql: ksql,
            orderBy: 'NAME_ASC'
        };

        let kalturaFilterPager = {
            objectType: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        };

        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(kalturaRelatedFilter, kalturaFilterPager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getSimilarMovies(assetId: number, ksql: string, pageIndex: number, pageSize: number): Promise<any> {
        let kalturaRelatedFilter = {
            objectType: "KalturaRelatedFilter",
            idEqual: assetId,
            kSql: ksql
        };

        let kalturaFilterPager = {
            objectType: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        };
        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(kalturaRelatedFilter, kalturaFilterPager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    //Function for get the no of season in particular series
    //and get more Videos from creator
    getNoOfSeasonInSeries(seriesId: string, typeIn: string): Promise<any> {
        let ksql = "SeriesId='" + seriesId + "'";
        let kalturaAssetMetaOrTagGroupBy = {
            objectType: "KalturaAssetMetaOrTagGroupBy",
            value: 'Season number'
        };

        let kalturaSearchAssetFilter = {
            objectType: "KalturaSearchAssetFilter",
            typeIn: typeIn,
            orderBy: "NAME_ASC",
            kSql: ksql,
            groupBy: [
                kalturaAssetMetaOrTagGroupBy
            ]
        };

        var relatedProfilesArray: any[];
        let relatedProfiles = {
            objectType: "KalturaDetachedResponseProfile",
            name: 'Episodes_In_Season',
            filter: {
                objectType: "KalturaAggregationCountFilter"
            }
        };

        relatedProfilesArray.push(relatedProfiles);
        let kalturaDetachedResponseProfile = {
            objectType: "KalturaDetachedResponseProfile",
            relatedProfiles: relatedProfilesArray
        };

        return new Promise(
            (resolve, reject) => {
                var kRequestBuilder = KalturaAssetService.listAction(kalturaSearchAssetFilter, null);
                kRequestBuilder.setResponseProfile(kalturaDetachedResponseProfile);
                kRequestBuilder.execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }


    getLiveNowRail(pageIndex: number, pageSize: number): Promise<any> {


        let ksql = "(and start_date<'0' end_date>'0')";

        let filter = {
            objectType: "KalturaSearchAssetFilter",
            "typeIn": "0",
            kSql: ksql
        };

        let pager = {
            objectType: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        };

        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(filter, pager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getChannelSpecificLiveNow(externalId: number, pageIndex: number, pageSize: number): Promise<any> {


        let ksql = "(and epg_channel_id = '" + externalId + "' start_date<'0' end_date>'0')";

        let filter = {
            objectType: "KalturaSearchAssetFilter",
            "typeIn": "0",
            kSql: ksql
        };

        let pager = {
            objectType: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        };

        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(filter, pager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getSimilarChannel(pageIndex: number, pageSize: number, assetType: number): Promise<any> {


        let ksql = "(and start_date<'0' end_date>'0' asset_type='" + assetType + "')";

        let filter = {
            objectType: "KalturaSearchAssetFilter",
            orderBy: "START_DATE_ASC",
            kSql: ksql
        };

        let pager = {
            objectType: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        };

        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(filter, pager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    searchHistoryCleanAction(assetId: string): Promise<any> {
        let kalturaAssetHistoryFilter = {
            objectType: "KalturaAssetHistoryFilter",
            assetIdIn: assetId,
            daysLessThanOrEqual: 30
        };

        return new Promise(
            (resolve, reject) => {
                KalturaAssetHistoryService.clean(kalturaAssetHistoryFilter).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getAssetStatistics(assetIdIn: string, startDateGreaterThanOrEqual: number, endDateGreaterThanOrEqual: number): Promise<any> {

        let query:any = {
            objectType: "KalturaAssetStatisticsQuery",
            assetTypeEqual: "media",
            assetIdIn: assetIdIn
        };
        if (startDateGreaterThanOrEqual) {
            query.startDateGreaterThanOrEqual = startDateGreaterThanOrEqual;
        }

        if (endDateGreaterThanOrEqual) {
            query.endDateGreaterThanOrEqual = endDateGreaterThanOrEqual;
        }

        if (startDateGreaterThanOrEqual) {
            query.startDateGreaterThanOrEqual = startDateGreaterThanOrEqual;
        }

        if (endDateGreaterThanOrEqual) {
            query.endDateGreaterThanOrEqual = endDateGreaterThanOrEqual;
        }


        return new Promise(
            (resolve, reject) => {
                KalturaAssetStatisticsService.query(query).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getEpisodeCountInSeries(seriesId: string, typeIn: string): Promise<any> {
        let ksql = "SeriesId='" + seriesId + "'";

        let kalturaSearchAssetFilter = {
            objectType: "KalturaSearchAssetFilter",
            typeIn: typeIn,
            orderBy: "NAME_ASC",
            kSql: ksql,
        };

        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(kalturaSearchAssetFilter, null).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getInAppNotificationList(pageIndex: number, pageSize: number) {
        let filter = {
            objectType: "KalturaInboxMessageFilter"
        };

        let pager = {
            objectType: "KalturaFilterPager",
            pageIndex: pageIndex,
            pageSize: pageSize
        };

        return new Promise(
            (resolve, reject) => {
                KalturaInboxMessageService.listAction(filter, pager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    deleteNotification(id: string) {
        let status = {
            objectType: "InboxMessageUpdateStatusAction",
            id: id,
            status: "Deleted"
        };

        return new Promise(
            (resolve, reject) => {
                KalturaInboxMessageService.updateStatus(id, status).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    getMovieDetailFromTrailer(type: string, AssetRefId: string) {

        let ksql: string;
        if (type === this.DMS.params.MediaTypes.Movie) {
            ksql = "(and asset_type='" + this.DMS.params.MediaTypes.Trailer + "' TrailerParentRefId~'" + AssetRefId + "')";
        } else {
            ksql = "(or Ref Id ~'" + AssetRefId + "')"
        }

        let filter = {
            objectType: "KalturaSearchAssetFilter",
            kSql: ksql,
        };

        let pager = {
            objectType: "KalturaFilterPager",
            pageIndex: 1,
            pageSize: 1
        };
        return new Promise(
            (resolve, reject) => {
                KalturaAssetService.listAction(filter, pager).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    enableParentalRule(ruleId: number) {
        return new Promise(
            (resolve, reject) => {
                KalturaParentalRuleService.enable(ruleId, "user").execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    setParentalPin(userPin: string, ruleId: number) {
        let pin = {
            objectType: "KalturaPin",
            pin: userPin,
            origin: "user",
            type: "parental"
        };

        return new Promise(
            (resolve, reject) => {
                KalturaPinService.update("user", "parental", pin, ruleId).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    activateDeactivateParentalRestrictions(status: string) {
        let value = {
            objectType: "KalturaStringValue",
            description: '',
            value: status
        };

        return new Promise(
            (resolve, reject) => {
                KalturaOttUserService.updateDynamicData('ParentalRestrictions', value).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    validateParentalPin(pin: string, ruleId: number) {
        return new Promise(
            (resolve, reject) => {
                KalturaPinService.validate(pin, 'parental', ruleId).execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

    disableParentalRule(ruleId: number) {
        return new Promise(
            (resolve, reject) => {
                KalturaParentalRuleService.disable(ruleId, 'user').execute(this.kalturaClient(), function (success, entry) {
                    if (!success) reject(entry.result);
                    resolve(entry.result);
                });
            });
    }

}