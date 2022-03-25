import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RailViewType } from '../../../../../shared/models/rail.model';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { PlaceholderImage } from '../../../../../shared/typings/common-constants';


declare var $: any;

@Component({
  selector: 'app-my-watchlist',
  templateUrl: './my-watchlist.component.html',
  styleUrls: ['./my-watchlist.component.scss']
})
export class MyWatchlistComponent implements OnInit {

  kalturaAssetListResponse: any;
  loading: boolean;
  KalturaPersonalListListResponse: any;

  noResultFound: boolean;
  placeholderImage: string;
  personalListId: number;
  pageSize: number;
  pageIndex: number;
  railViewType: string;
  assetList: any[] = [];
  viewType: string = 'LANDSCAPE';
  KalturaPersonalListListResponseArray: any[] = [];
  assetDetails: any;
  assetListDetail: any;
  isPwa: boolean;

  constructor(private kalturaAppSevice: KalturaAppService, private snackbarUtilService: SnackbarUtilService,
    private appUtilService: AppUtilService, private router: Router, private platformIdentifierService: PlatformIdentifierService) {
    this.loading = false;
    this.noResultFound = false;
    this.placeholderImage = PlaceholderImage.NO_WATCHLIST;
    this.pageIndex = 1;
    this.pageSize = 40;
    this.railViewType = RailViewType[RailViewType.LANDSCAPE].toString();
  }

  ngOnInit() {
    this.getWatchlist();
    if (this.platformIdentifierService.isBrowser()) {
      if (this.appUtilService.checkIfPWA()) {
        this.isPwa = true;
      } else {
        this.isPwa = false;
      }
    }

  }

  getWatchlist() {
    this.loading = true;
    this.kalturaAppSevice.getPersonalList(1, this.pageSize, this.pageIndex).then(res => {
      if (res.totalCount > 0) {
        this.KalturaPersonalListListResponse = res;

        this.KalturaPersonalListListResponse.objects.forEach(element => {
          this.KalturaPersonalListListResponseArray.push(element);
        });
      }
      this.kalturaAssetListResponse = null;
      this.loading = false;
      let str = '';
      if (res.totalCount > 0) {
        res.objects.forEach((element, index) => {
          let media_id: string;
          media_id = element.ksql.split('=')[1];
          str += media_id.substr(1, media_id.length - 2) + ',';
        })
        str = str.substr(0, str.length - 1);
        let ksql: string = 'media_id:\'' + str + '\'';
        this.loading = true;
        this.kalturaAppSevice.searchAsset(null, null, ksql, 1, this.pageSize).then(res2 => {
          if (res2.totalCount > 0) {
            this.loading = false;
            this.kalturaAssetListResponse = res2;
            this.kalturaAssetListResponse.objects.forEach((element, index) => {
              this.assetList.push(element);
            });
          } else {
            this.loading = false;
            this.noResultFound = true;
          }
        }, reject => {
          this.loading = false;
          this.snackbarUtilService.showError(reject.message);
        });

      } else {
        this.noResultFound = true;
      }
    }, reject => {
      this.loading = false;
      this.snackbarUtilService.showError(reject.message);
    })
  }

  watchAsset(name, mediaId, mediaTypeId?) {
    this.appUtilService.getAssetRouteUrl(name, mediaId, null, null, mediaTypeId).subscribe((res: any) => {
      this.router.navigate([res.url]);
    })

    // this.router.navigate(['/watch/' + this.appUtilService.getSEOFriendlyURL(mediaType) + '/' + mediaTypeId + '/' + this.appUtilService.getSEOFriendlyURL(name) + '/' + mediaId]);
  }

  removeFromWatchlist(assetId: number) {
    // item already available on watchlist call api to remove from watchlist
    this.loading = true;
    this.kalturaAppSevice.personalListDeleteAction(this.getPersonalListId(assetId)).then(response => {
      this.loading = false;
      this.snackbarUtilService.showSnackbar('removed from your Watchlist');
      this.assetList = [];
      this.assetList.forEach(element => {
        if (element.id.toString() === assetId.toString()) {
          this.assetListDetail = element;
        }
      })
      this.pageIndex = 1;
      this.getWatchlist();
      this.removeWatchlistMoEngageEvent(this.assetListDetail.type);
    }, reject => {
      this.loading = false;
      this.snackbarUtilService.showError(reject.message);
      this.removeWatchlistErrorMoEngageEvent(this.assetListDetail.type);
    });
  }

  getPersonalListId(assetId: number): number {
    let personalListId: number;
    this.KalturaPersonalListListResponseArray.forEach(element => {
      let media_id: string;
      media_id = element.ksql.split('=')[1];
      media_id = media_id.substr(1, media_id.length - 2);
      if (assetId === +media_id) {
        personalListId = element.id;
      }
    });
    return +personalListId;
  }

  onScroll() {
    try {
      if (this.KalturaPersonalListListResponse.totalCount > this.pageIndex * this.pageSize) {
        this.pageIndex += 1;
        this.getWatchlist();
      }
    } catch (error) {

    }

  }
  imageLoadEvent(event) {
    let id = event.srcElement.id;
    if (this.platformIdentifierService.isBrowser()) {
      $("#" + id).parent().css('display', 'block');
      let shimmerId = $("#" + id).attr('data');
      $("#" + shimmerId).css('display', 'none');
    }
  }

  imageLoadError(event) {
    let id = event.srcElement.id;
    if (this.platformIdentifierService.isBrowser()) {
      $("#" + id).attr('src', this.appUtilService.getDefaultThumbnail(this.viewType));
    }
  }

  removeWatchlistMoEngageEvent(type: number) {
    let removeWatchlist: any;
    if (this.appUtilService.getMediaTypeNameById(type) === 'UGC Video') {
      removeWatchlist = {
        asset_ID: this.assetListDetail.id,
        asset_title: this.assetListDetail.name,
        asset_genre: this.assetListDetail.tags['Genre'] ? this.assetListDetail.tags['Genre'].objects[0].value : null,
        asset_mediatype: this.assetListDetail.type,
        asset_parental_rating: this.assetListDetail.tags['Parental Rating'] ? this.assetListDetail.tags['Parental Rating'].objects[0].value : null,
        asset_creator_name: this.assetListDetail.tags['Series Name'] ? this.assetListDetail.tags['Series Name'].objects[0].value : null,
        asset_episode_number: this.assetListDetail.metas['Episode number'] ? this.assetListDetail.metas['Episode number'].value : null,
        source: "removefromlist_video_page",
        status: "remove_successful"
      }
    } else if (this.appUtilService.getMediaTypeNameById(type) === 'Short Film' || this.appUtilService.getMediaTypeNameById(this.assetDetails.type) === 'Movie' || this.appUtilService.getMediaTypeNameById(this.assetDetails.type) === 'Spotlight Episode' || this.appUtilService.getMediaTypeNameById(this.assetDetails.type) === 'Web Episode') {
      removeWatchlist = {
        asset_ID: this.assetListDetail.id,
        asset_title: this.assetListDetail.name,
        asset_genre: this.assetListDetail.tags['Genre'] ? this.assetListDetail.tags['Genre'].objects[0].value : null,
        asset_mediatype: this.assetListDetail.type,
        asset_parental_rating: this.assetListDetail.tags['Parental Rating'] ? this.assetListDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: this.assetListDetail.tags['Series Name'] ? this.assetListDetail.tags['Series Name'].objects[0].value : null,
        asset_episode_number: this.assetListDetail.metas['Episode number'] ? this.assetListDetail.metas['Episode number'].value : null,
        source: "removefromlist_video_page",
        status: "remove_successful"
      }
    }
    this.appUtilService.moEngageEventTracking("REMOVE_FROM_WATCHLIST", removeWatchlist);
  }

  removeWatchlistErrorMoEngageEvent(type: number) {
    let removeWatchlistError: any;
    if (this.appUtilService.getMediaTypeNameById(type) === 'UGC Video') {
      removeWatchlistError = {
        asset_ID: this.assetListDetail.id,
        asset_title: this.assetListDetail.name,
        asset_genre: this.assetListDetail.tags['Genre'] ? this.assetListDetail.tags['Genre'].objects[0].value : null,
        asset_mediatype: this.assetListDetail.type,
        asset_parental_rating: this.assetListDetail.tags['Parental Rating'] ? this.assetListDetail.tags['Parental Rating'].objects[0].value : null,
        asset_creator_name: this.assetListDetail.tags['Series Name'] ? this.assetListDetail.tags['Series Name'].objects[0].value : null,
        asset_episode_number: this.assetListDetail.metas['Episode number'] ? this.assetListDetail.metas['Episode number'].value : null,
        source: "removefromlist_video_page",
        status: "remove_error"
      }
    } else if (this.appUtilService.getMediaTypeNameById(type) === 'Short Film' || this.appUtilService.getMediaTypeNameById(this.assetDetails.type) === 'Movie' || this.appUtilService.getMediaTypeNameById(this.assetDetails.type) === 'Spotlight Episode' || this.appUtilService.getMediaTypeNameById(this.assetDetails.type) === 'Web Episode') {
      removeWatchlistError = {
        asset_ID: this.assetListDetail.id,
        asset_title: this.assetListDetail.name,
        asset_genre: this.assetListDetail.tags['Genre'] ? this.assetListDetail.tags['Genre'].objects[0].value : null,
        asset_mediatype: this.assetListDetail.type,
        asset_parental_rating: this.assetListDetail.tags['Parental Rating'] ? this.assetListDetail.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: this.assetListDetail.tags['Series Name'] ? this.assetListDetail.tags['Series Name'].objects[0].value : null,
        asset_episode_number: this.assetListDetail.metas['Episode number'] ? this.assetListDetail.metas['Episode number'].value : null,
        source: "removefromlist_video_page",
        status: "remove_error"
      }
    }
    this.appUtilService.moEngageEventTracking("REMOVE_FROM_WATCHLIST", removeWatchlistError);
  }

}
