import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { CommonMessageService } from '../../../../../shared/services/common-message.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { SearchQueryCommand } from '../../../../../shared/typings/shared-typing';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { reject } from 'q';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UgcVideoPopupComponent } from '../../../../../shared/ugc-video-popup/ugc-video-popup.component';


declare var $: any;

@Component({
    selector: 'app-search-child',
    templateUrl: './search-child.component.html',
    styleUrls: ['./search-child.component.scss']
})
export class SearchChildComponent implements OnInit, OnDestroy, AfterViewInit {
    isBrowser: any;

    @Input()
    mediaType: number;

    // @Input()
    searchQuery: SearchQueryCommand = new SearchQueryCommand();

    @Input()
    showPopularSearch: boolean;

    @Output()
    noResultFoundEvent = new EventEmitter<any>()

    assetList: any;
    pageIndex: number;
    pageSize: number;

    railViewType: string = 'LANDSCAPE';

    loading: boolean;
    isImageLoaded: boolean = false;

    DMS: any;
    viewType: string = 'widescreen-landscape-item';
    railTitle: string;
    borderPadding: string = 'border-padding';
    MobBorderWidth: string = 'Mob-BorderWidth';
    isMobileTabletView: boolean = false;
    isTabletView: boolean = false;
    isDesktop: boolean = true;
    start_date: number;
    end_date: number;

    constructor(private router: Router,
        private commonMessageService: CommonMessageService, private kalturaAppService: KalturaAppService,
        public kalturaUtilService: KalturaUtilService, @Inject(PLATFORM_ID) private platformId,
        private appUtilService: AppUtilService, private platformIdentifierService: PlatformIdentifierService,
        private snackbarUtilService: SnackbarUtilService, private modalService: NgbModal) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.pageIndex = 1;
        this.pageSize = 10;
        this.loading = true;
        this.assetList = null;
        this.searchQuery.query = null;
        let days = new Date();
        days.setDate(new Date().getDate() - 7);
        this.start_date = days.getTime();
        this.end_date = new Date().getTime();
    }

    ngOnInit() {
        this.DMS = this.appUtilService.getDmsConfig('sdvgdb');
        if (this.showPopularSearch) {
            this.getPopularSearch();
        } else {
        }
        this.commonMessageService.searchQueryObj$.subscribe(query => {
            if (query) {
                this.searchQuery.query = query;
                this.search();
            }
        });
        if (matchMedia('(max-width: 768px)').matches) {
            this.isMobileTabletView = true;
            this.isDesktop = false;
        }
        if (matchMedia('(max-width: 992px)').matches) {
            this.isTabletView = true;
            this.isDesktop = false;
        }
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
    }

    search() {
        if ((this.mediaType || this.mediaType === 0) && this.searchQuery.query) {
            this.loading = true;
            this.assetList = null;
            let ksql: any;
            if (this.mediaType === +this.DMS.params.MediaTypes.Program) {
                ksql = "(and name ~ '" + this.searchQuery.query + "' start_date>='" + (this.start_date / 1000).toFixed() + "' end_date<'" + (this.end_date / 1000).toFixed() + "' allowCatchup = true)";
            } else {
                ksql = "name ~ '" + this.searchQuery.query + "'";
            }
            this.kalturaAppService.kalturaSearchAsset(ksql, this.mediaType, this.pageIndex, this.pageSize).then(response => {
                this.loading = false;
                if (response.totalCount > 0) {
                    this.railTitle = this.kalturaUtilService.getMediaTypeNameById(response.objects[0].type);
                    if (response.objects[0].type.toString() === this.appUtilService.getDmsConfig().params.MediaTypes.UGCCreator || response.objects[0].type.toString() === this.appUtilService.getDmsConfig().params.MediaTypes.Linear) {
                        if (response.objects[0].type.toString() === this.appUtilService.getDmsConfig().params.MediaTypes.Linear) {
                            this.railTitle = "LIVE CHANNELS"
                        }
                        this.viewType = 'circle-item';
                        this.borderPadding = 'circle-border-padding';
                        this.MobBorderWidth = 'circle-Mob-width';
                        this.railViewType = "CIRCLE";
                    } else {
                        if (response.objects[0].type.toString() === this.appUtilService.getDmsConfig().params.MediaTypes.Program) {
                            this.railTitle = "CATCHUPS";
                        }
                        this.viewType = 'widescreen-landscape-item';
                        this.railViewType = "LANDSCAPE";
                    }
                    this.assetList = response;
                } else {
                    this.noResultFoundEvent.emit(1);
                }
            }, reject => {
                this.loading = false;
            });
        }
    }

    showMoreResults(mediaTypeId) {
        let mediaTypeName = this.kalturaUtilService.getMediaTypeNameById(mediaTypeId);
        this.router.navigate(['/search/' + this.appUtilService.getSEOFriendlyURL(mediaTypeName) + '/' + mediaTypeId + '/' + this.searchQuery.query], { queryParams: { "sortable": true, "filter": true } });
    }

    watchAsset(name: string, mediaId: number, type: number, startDate?: any, channelId?: any, index? : number) {
        if (this.isDesktop) {
            if ((type.toString() === this.DMS.params.MediaTypes.Linear) && (mediaId === 804674 || mediaId === 804672 || mediaId === 804663 || mediaId === 804677)) {
                return this.blockedLinearChannel();
            }
            if (type == this.DMS.params.MediaTypes.UGCVideo) {
                const modalRef = this.modalService.open(UgcVideoPopupComponent);
                modalRef.componentInstance.ugcVideoChange.next(this.assetList.objects);
                modalRef.componentInstance.index = index;
                modalRef.componentInstance.fromRails = true;
                modalRef.componentInstance.totalVideos = this.assetList.objects.length;
                return;
            }
            
        }
        if (this.platformIdentifierService.isBrowser()) {
            this.appUtilService.getAssetRouteUrl(name, mediaId, null, null, type, null, startDate, channelId).subscribe((res: any) => {
                this.router.navigate([res.url]);
            })
        }
    }

    getPopularSearch() {
        this.loading = true;
        this.kalturaAppService.getAssetById(this.DMS.baseChannels.staticSearch, this.pageIndex, this.pageSize).then(response => {
            this.loading = false;
            this.assetList = response;
        }, reject => {
            this.loading = false;
            console.error(reject);
        });
    }

    imageLoadEvent(event) {
        this.isImageLoaded = true;
    }

    clickPopularSearchMoEngageEvent(name: string, id: number) {
        if (this.showPopularSearch) {
            let popularSearchAttribute = {
                asset_title: name,
                asset_ID: id,
                status: "redirection_successful"
            }
            this.appUtilService.moEngageEventTracking("POPULAR_SEARCH_CLICKED", popularSearchAttribute);
        }
    }

    clickSearchResultsMoEngageEvent(query: any, id: number, title: string, assetDetail: any, type: number) {
        if (!this.showPopularSearch) {
            let searchResults = {
                search_text: query,
                asset_ID: id,
                asset_title: title,
                asset_genre: assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
                asset_mediatype: type,
                status: "redirection_successful"
            }
            this.appUtilService.moEngageEventTracking("SEARCH_RESULT_CLICKED", searchResults);
        }
        if (type === 558) {
            this.gtmSearchResultCLickLive(query, id, title, assetDetail, type);
        }
    }

    clickMoreResultsMoEngage(query: any, type: number) {
        let moreResults = {
            search_text: query,
            asset_mediatype: type,
            status: "redirection_successful"
        }
        this.appUtilService.moEngageEventTracking("MORE_RESULTS_CLICKED", moreResults);
    }

    gtmSearchResultCLickLive(query: any, id: number, title: string, assetDetail: any, type: number) {

        let dataLayerJson: any;

        dataLayerJson = {
            'asset_id': id,
            'asset_title': title,
            'asset_genre': assetDetail.tags['Genre'] ? assetDetail.tags['Genre'].objects[0].value : assetDetail.tags['Genres'] ? assetDetail.tags['Genres'].objects[0].value : null,
            'asset_mediatype': 'Linear',
            'channel_name': title
        };
        this.appUtilService.getGTMTag(dataLayerJson, 'search_button_clicked');

    }

    blockedLinearChannel() {
        this.snackbarUtilService.showSnackbar("Channel Available Only On Watcho App");
    }
}
