import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { CommonMessageService } from '../../../../../shared/services/common-message.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { AssetList } from '../../../../../shared/typings/kaltura-response-typings';
import { SearchQueryCommand, MessageServiceConstants } from '../../../../../shared/typings/shared-typing';
import { SearchChildComponent } from '../search-child/search-child.component';
declare var $: any;


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
    isBrowser: any;


    assetList: AssetList;
    searchQuery = new SearchQueryCommand();
    mediaTypesIds: number[];
    searchList: AssetList[];
    allSearchAsset: any[][];
    pageIndex: number;
    pageSize: number;

    // webSeriesSearch: any[];
    // spotlightSeriesSearch: any[];
    // shortFilmSearch: any[];
    // movieSearch: any[];
    // ugcVideoSearch: any[];
    // linearSearch: any[];
    // webEpisodeSearch: any[];
    // spotlightEpisodeSearch: any[];

    webSeriesSearch: any[];
    spotlightSeriesSearch: any[];
    shortFilmSearch: any[];
    movieSearch: any[];
    ugcVideoSearch: any[];
    linearSearch: any[];
    webEpisodeSearch: any[];
    spotlightEpisodeSearch: any[];

    noResultFound: boolean;
    noResultFoundCount: number = 0;

    railViewType: string = 'LANDSCAPE';

    loading: boolean;
    showPopularSearch: boolean;
    mobileSearchQuery: string;

    @ViewChild(SearchChildComponent)
    searchChildComponent: SearchChildComponent;

    DMS: any;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private commonMessageService: CommonMessageService, private kalturaAppService: KalturaAppService,
        public kalturaUtilService: KalturaUtilService, @Inject(PLATFORM_ID) private platformId,
        public appUtilService: AppUtilService) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.searchQuery.query = '';
        this.mediaTypesIds = [];
        this.allSearchAsset = [[], [], [], [], [], [], [], [], []];
        this.pageIndex = 1;
        this.pageSize = 10;

        this.noResultFound = false;
        this.showPopularSearch = false;
        this.loading = true;
        // override the route reuse strategy
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        }
    }

    ngOnInit() {

        this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
            this.searchQuery.query = params.get('q');
            if (this.searchQuery.query) {
                this.search();
            }
        })

        this.DMS = this.appUtilService.getDmsConfig('bfbhb');
        this.mediaTypesIds.push(+this.DMS.params.MediaTypes.WebSeries);
        this.mediaTypesIds.push(+this.DMS.params.MediaTypes.SpotlightSeries);
        this.mediaTypesIds.push(+this.DMS.params.MediaTypes.ShortFilm);
        this.mediaTypesIds.push(+this.DMS.params.MediaTypes.Movie);
        this.mediaTypesIds.push(+this.DMS.params.MediaTypes.UGCVideo);
        this.mediaTypesIds.push(+this.DMS.params.MediaTypes.Linear);
        this.mediaTypesIds.push(+this.DMS.params.MediaTypes.Program);
        this.mediaTypesIds.push(+this.DMS.params.MediaTypes.WebEpisode);
        this.mediaTypesIds.push(+this.DMS.params.MediaTypes.SpotlightEpisode);
        this.mediaTypesIds.push(+this.DMS.params.MediaTypes.UGCCreator);
    }

    search() {
        this.noResultFound = false;
        this.showPopularSearch = false;
        this.noResultFoundCount = 0;
        this.commonMessageService.searchString(this.searchQuery.query);
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

    noResultFoundEvent(event) {
        this.noResultFoundCount += event;
        if (this.noResultFoundCount > 9) {
            this.noResultFound = true;
            this.showPopularSearch = true;
        } else {

        }
    }

    showMoreResults(mediaTypeId) {
        let mediaTypeName = this.kalturaUtilService.getMediaTypeNameById(mediaTypeId);
        this.router.navigate(['/search/' + this.appUtilService.getSEOFriendlyURL(mediaTypeName) + '/' + mediaTypeId + '/' + this.searchQuery.query]);
    }

    ngOnDestroy() {
        this.commonMessageService.sendcommonMessageArray([MessageServiceConstants.RESET_SEARCH_QUERY]);
    }

    mobileViewSearch(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            event.target.blur()
        }
        this.searchQuery.query = this.mobileSearchQuery
        this.search();
    }

    clearSearchQuery() {
        this.mobileSearchQuery = null;
        this.searchQuery.query = null;
    }

}
