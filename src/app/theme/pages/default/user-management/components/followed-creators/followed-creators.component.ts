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
  selector: 'app-followed-creators',
  templateUrl: './followed-creators.component.html',
  styleUrls: ['./followed-creators.component.scss']
})
export class FollowedCreatorsComponent implements OnInit {

  isBrowser: any;
  loading: boolean;
  kalturaPersonalListListResponse: any;
  kalturaAssetListResponse: any;
  kalturaAssetListResponseCreator: any;

  typeIn: string;

  noCreator: boolean;
  noCreatorPlaceholder: string;
  noCreatorFoundPlaceholder: string;

  viewType: string = 'CIRCLE';
  randomColor: string;
  solidColor: any;
  pageSize: number;
  pageIndex: number;
  isPwa: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId, private kalturaAppService: KalturaAppService, private snackbarUtilService: SnackbarUtilService,
    private router: Router, private appUtilService: AppUtilService, private platformIdentifierService: PlatformIdentifierService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loading = false;
    this.typeIn = null;
    this.noCreator = false;
    this.noCreatorPlaceholder = PlaceholderImage.MALE1;
    this.noCreatorFoundPlaceholder = PlaceholderImage.NO_CREATOR;
    this.randomColor = this.appUtilService.getRandomGreyScaleColor();
    this.solidColor = {
      'background': this.randomColor,
      'text-align': 'center',
      'vertical-align': 'middle',
    };
    this.pageIndex = 1;
    this.pageSize = 40;
  }

  ngOnInit() {
    this.getCreatorsFollowing();
    if (this.platformIdentifierService.isBrowser()) {
      if (this.appUtilService.checkIfPWA()) {
        this.isPwa = true;
      } else {
        this.isPwa = false;
      }
    }
  }

  getCreatorsFollowing() {
    this.loading = true;
    this.kalturaAppService.getPersonalList(2, this.pageSize, this.pageIndex).then((res: any) => {
      this.loading = false;
      this.kalturaAssetListResponseCreator = null;
      this.kalturaPersonalListListResponse = res;
      if (res.totalCount > 0) {
        this.noCreator = false;
        let assetIds: string = '';
        res.objects.forEach((element, index) => {
          let mediaId = element.ksql.split('=')[1];
          mediaId = mediaId.substr(1, mediaId.length - 2);
          assetIds += mediaId + ',';
        });
        assetIds = assetIds.substr(0, assetIds.length - 1);
        let ksql = 'media_id:\'' + assetIds + '\'';
        this.loading = true;
        this.kalturaAppService.searchAsset(null, null, ksql, 1, 50).then(response => {
          this.loading = false;
          this.kalturaAssetListResponseCreator = response;
        }, reject => {
          this.loading = false;
          this.snackbarUtilService.showError(reject.message);
        });
      } else {
        this.noCreator = true;
      }
    }, reject => {
      this.loading = false;
      this.snackbarUtilService.showError(reject.message);
    });
  }

  unfollowCreator(mediaId, name) {
    this.loading = true;
    this.kalturaAppService.getPersonalList(2, this.pageSize, this.pageIndex).then((res: any) => {
      this.loading = false;
      let isFollowed: boolean = false;
      if (res.objects) {
        res.objects.forEach((element, index) => {
          let mId = element.ksql.split('=')[1];
          mId = mId.substr(1, mId.length - 2);
          if (mId === mediaId.toString()) {
            isFollowed = true;
            mediaId = element.id;
            this.unFollowCreator(mediaId, name);
          }
        });
      }
    }, reject => {
      this.loading = false;
    })
  }


  unFollowCreator(mediaId: number, name: string) {
    this.loading = true;
    this.kalturaAppService.personalListDeleteAction(mediaId).then(response => {
      this.loading = false;
      this.snackbarUtilService.showSnackbar('You have unfollowed ' + this.appUtilService.getTitleCase(name) + ' successfully.');
      this.getCreatorsFollowing();
    }, reject => {
      this.loading = false;
      this.snackbarUtilService.showError(reject.message);
    });
  }

  watchAsset(name, mediaId, type, mediaType, mediaTypeId?) {
    this.appUtilService.getAssetRouteUrl(name, mediaId, null, null, mediaTypeId).subscribe((res: any) => {
      this.router.navigate([res.url]);
    })
  }

  getPersonalListId(assetId) {

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
