import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { PlaceholderImage } from '../../../../../shared/typings/common-constants';
import { AssetList } from '../../../../../shared/typings/kaltura-response-typings';
import { UgcVideoPopupComponent } from '../../../../../shared/ugc-video-popup/ugc-video-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-more-search',
    templateUrl: './more-search.component.html',
    styleUrls: ['./more-search.component.scss']
})
export class MoreSearchComponent implements OnInit {
    isBrowser: any;

    assetList: AssetList;
    searchString: string;
    mediaTypeId: string;
    searchList: any;
    pageIndex: number;
    pageSize: number;

    showLoader: boolean;

    railViewType: string = 'LANDSCAPE';
    genres: string[] = [];
    shortBy: string;
    noResultFound: boolean;
    placeholderImage: any;
    isPwa: boolean;
    start_date: number;
    end_date: number;
    railTitle: string;
    isDesktop: boolean = true;
    DMS: any;
    modalRef: any;


    constructor(private activatedRoute: ActivatedRoute, private router: Router, private kalturaAppService: KalturaAppService,
        public kalturaUtilService: KalturaUtilService, @Inject(PLATFORM_ID) private platformId,
        private appUtilService: AppUtilService, private modalService: NgbModal) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.searchString = '';
        this.mediaTypeId = null;
        this.pageIndex = 1;
        this.pageSize = 25;
        this.searchList = {
            objects: [],
            relatedObjects: [],
            totalCount: 0
        };
        this.showLoader = false;

        let days = new Date();
        days.setDate(new Date().getDate() - 7);
        this.start_date = days.getTime();
        this.end_date = new Date().getTime();
    }

    ngOnInit() {
        this.DMS = this.appUtilService.getDmsConfig('sdvgdb');
        this.placeholderImage = PlaceholderImage.NO_RESULT;
        try {
            this.mediaTypeId = this.activatedRoute.snapshot.params['mediaTypeId'];
            if (this.mediaTypeId === "0") {
                this.railTitle = "Catchup"
            } else if (this.kalturaUtilService.getMediaTypeNameById(this.mediaTypeId) === "Linear") {
                this.railTitle = "Live Channel"
            } else {
                this.railTitle = this.kalturaUtilService.getMediaTypeNameById(this.mediaTypeId);
            }
            this.searchString = this.activatedRoute.snapshot.params['searchQuery'];
            if (this.mediaTypeId && this.searchString) {
                this.searchQuery();
            }
        } catch (error) {
            console.error(error);
        }

        if (this.appUtilService.checkIfPWA()) {
            this.isPwa = true;
        } else {
            this.isPwa = false;
        }
        if (matchMedia('(min-width: 993px)').matches) {
            this.isDesktop = true;
        } else {
            this.isDesktop = false;
        }
    }

    searchQuery(fromModal?: boolean) {
        this.showLoader = true;
        let genreList: string[] = [];
        let ksql: any;
        this.genres.forEach(element => {
            genreList.push("Genre='" + element + "'")
        })
        if (this.mediaTypeId === '0') {
            ksql = "(or (and name ~ '" + this.searchString.trim() + "' start_date>='" + (this.start_date / 1000).toFixed() + "' end_date<'" + (this.end_date / 1000).toFixed() + "' allowCatchup = true) Genre = 'Others')";
        } else {
            ksql = "(and name ~'" + this.searchString.trim() + "' (or " + genreList.toString().split(',').join(' ') + "))";
        }
        this.kalturaAppService.searchAsset(this.searchString.trim(), +this.mediaTypeId, ksql, this.pageIndex, this.pageSize, this.shortBy).then(response => {
            if (response.totalCount > 0) {
                this.noResultFound = false;
                this.searchList.totalCount = response.totalCount;
                response.objects.forEach((element, index) => {
                    this.searchList.objects.push(element);
                });
                if (fromModal) {
                    this.modalRef.componentInstance.ugcVideoChange.next(this.searchList.objects);
                }
            } else {
                this.noResultFound = true;
            }
            this.showLoader = false;
        }, reject => {
            this.showLoader = false;
            console.error(reject);
        });
    }

    onScroll(fromModal?: boolean) {
        if (this.searchList.totalCount > this.pageSize * this.pageIndex) {
            this.pageIndex += 1;
            this.searchQuery(fromModal);
        }
    }

    watchAsset(name: string, mediaId: number, type: number, startDate?: any, channelId?: any, index?: number) {
        if (this.isDesktop) {
            if (type == this.DMS.params.MediaTypes.UGCVideo) {
                this.modalRef = this.modalService.open(UgcVideoPopupComponent);
                this.modalRef.componentInstance.ugcVideoChange.next(this.searchList.objects);
                this.modalRef.componentInstance.index = index;
                this.modalRef.componentInstance.totalVideos = this.searchList.totalCount;
                this.modalRef.componentInstance.getMoreVideos.subscribe((receivedEntry) => {
                    if (receivedEntry) {
                        this.onScroll(true);
                    };
                })
                return;
            }

        }
        let url: string;
        this.appUtilService.getAssetRouteUrl(name, mediaId, null, null, type, null, startDate, channelId).subscribe((res: any) => {
            url = res.url;
            this.router.navigate([url]);
        })

    }

    getGenres(event: any) {
        this.genres = []
        this.genres = event;
    }

    getShorting(event: any) {
        if (event === "AtoZ") {
            this.shortBy = "NAME_ASC"
        } else if (event === "ZtoA") {
            this.shortBy = "NAME_DESC"
        } else {
            this.shortBy = ""
        }
    }

    addFilters(event: boolean) {
        if (event) {
            this.pageIndex = 1
            this.pageSize = 30
            this.searchList.objects = [];
            this.showLoader = true;
            setTimeout(() => {
                this.searchQuery();
            }, 500)
        }
    }
}
