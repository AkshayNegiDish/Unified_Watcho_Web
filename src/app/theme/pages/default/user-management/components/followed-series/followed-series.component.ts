import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { PlaceholderImage } from '../../../../../shared/typings/common-constants';

declare var $: any

@Component({
  selector: 'app-followed-series',
  templateUrl: './followed-series.component.html',
  styleUrls: ['./followed-series.component.scss']
})
export class FollowedSeriesComponent implements OnInit {

  isBrowser: any;
  loading: boolean;
  kalturaPersonalListListResponse: any;
  kalturaFollowTvSeriesListResponse: any;
  kalturaAssetListResponse: any;
  kalturaAssetListResponseCreator: any;

  typeIn: string;

  noSeries: boolean;
  noSeriesPlaceholder: string;

  DMS: any;
  viewType: string = 'LANDSCAPE';
  isPwa: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId, private kalturaAppService: KalturaAppService, private snackbarUtilService: SnackbarUtilService,
    private router: Router, private appUtilService: AppUtilService, private platformIdentifierService: PlatformIdentifierService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loading = false;
    this.typeIn = null;
    this.noSeries = false;
    this.noSeriesPlaceholder = PlaceholderImage.NO_SERIES;
  }

  ngOnInit() {
    this.DMS = this.appUtilService.getDmsConfig('bgfgdf');

    this.getSeriesFollowing();
    if (this.platformIdentifierService.isBrowser()) {
      if (this.appUtilService.checkIfPWA()) {
        this.isPwa = true;
      } else {
        this.isPwa = false;
      }
    }
  }

  getSeriesFollowing() {
    this.loading = true;
    this.kalturaAppService.getFollowedSeries().then(res => {
      this.loading = false;
      this.kalturaAssetListResponse = null;
      if (res.totalCount > 0) {
        this.noSeries = false;
        let assetIds: string = '';
        res.objects.forEach((element, index) => {
          assetIds += element.assetId + ',';
        });
        assetIds = assetIds.substr(0, assetIds.length - 1);
        let ksql: string = 'media_id: \'' + assetIds + '\'';
        let typeIn = this.DMS.params.MediaTypes.WebSeries + ',' + this.DMS.params.MediaTypes.SpotlightSeries;
        this.typeIn = typeIn;
        this.loading = true;
        this.kalturaAppService.searchAsset(null, typeIn, ksql, 1, 50).then(response => {
          this.loading = false;
          this.kalturaAssetListResponse = response;
        }, reject => {
          this.loading = false;
          this.snackbarUtilService.showError(reject.message);
        });
      } else {
        this.noSeries = true;
      }
    }, reject => {
      this.loading = false;
      this.snackbarUtilService.showError(reject.message);
    });
  }

  unfollowTvSeries(assetId: number) {
    this.loading = true;
    this.kalturaAppService.unfollowTvSeries(assetId).then(response => {
      this.loading = false;
      this.snackbarUtilService.showSnackbar('You have unfollowed series successfully.');
      this.getSeriesFollowing();
    }, reject => {
      this.loading = false;
      this.snackbarUtilService.showError(reject.message);
    });
  }

  watchAsset(name, mediaId, mediaType?, mediaName?, mediaTypeId?) {
    this.appUtilService.getAssetRouteUrl(name, mediaId, null, null, mediaTypeId).subscribe((res: any) => {
      this.router.navigate([res.url]);
    })
  }

  imageLoadEvent(event) {
    let id = event.srcElement.id;
    if (this.platformIdentifierService.isBrowser()) {
      $("#" + id).parent().css('display', 'block');
      let shimmerId = $("#" + id).attr('data');
      $("#" + shimmerId).css('display', 'none');
    }
  }
}
