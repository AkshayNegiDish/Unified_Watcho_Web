import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { AppFormService } from '../../../../../shared/services/shared-form.service';
import { PlaceholderImage } from '../../../../../shared/typings/common-constants';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';


declare var $: any;

@Component({
  selector: 'app-my-uploads',
  templateUrl: './my-uploads.component.html',
  styleUrls: ['./my-uploads.component.scss']
})
export class MyUploadsComponent implements OnInit {


  kalturaAssetListResponse: any;
  DMS: any;
  noResultFound: boolean;
  loading: boolean;
  viewCountObject: any[] = [];
  userInfo: any;
  placeholderImage: string;
  thumbnailURL: string;
  isImageLoaded: boolean = false;
  viewType: string = 'LANDSCAPE';
  showBackButton: boolean;


  constructor(private router: Router, private kalturaAppSevice: KalturaAppService,
    private appUtilService: AppUtilService, private snackbarUtilService: SnackbarUtilService,
    private sharedFormService: AppFormService, private platformIdentifierService: PlatformIdentifierService) {
    this.noResultFound = false;
    this.placeholderImage = PlaceholderImage.NO_UPLOADS;
    // this.isImageLoaded = false;
  }

  ngOnInit() {
    this.DMS = this.appUtilService.getDmsConfig();
    this.getUserDetail();
    this.getMypload();

    if (this.appUtilService.checkIfPWA()) {
      this.showBackButton = true;
      $(document).ready(() => {
        $(".page-title").css("text-align", "center")
      })
    } else {
      this.showBackButton = false;
    }


  }
  openpage() {
    this.router.navigate(['/user/videouploadform']);
  }

  getUserDetail() {
    this.loading = true;
    this.userInfo = this.appUtilService.getLoggedInUserDetails();
    this.loading = false;
  }
  //Get the list of ugc upload
  getMypload() {
    if (this.appUtilService.isUserLoggedIn()) {
      this.kalturaAppSevice.getAssetDetailBySeriesId('UGC_' + this.userInfo.username, +this.DMS.params.MediaTypes.UGCVideo).then(res => {
        if (res.totalCount > 0) {
          let assetIdIn = '';
          this.kalturaAssetListResponse = res;
          res.objects.forEach((element, index) => {
            assetIdIn += element.id + ',';
          })
          assetIdIn = assetIdIn.substr(0, assetIdIn.length - 1);
          this.loading = true;
          this.kalturaAppSevice.getAssetStatistics(assetIdIn, 0, 0).then(res2 => {
            this.loading = false;
            res2.objects.forEach((element: any) => {
              this.viewCountObject.push(element)
            });
          }, reject => {
            this.loading = false;
            this.snackbarUtilService.showError(reject.message);
          });

        } else {
          this.noResultFound = true;
        }
      }, reject => {
        console.error(reject);
      });
    } else {

    }
  }

  removeFromMyUploads(videoId: string, event) {
    event.stopPropagation();
    this.sharedFormService.removeFromMyUploads(videoId, this.userInfo.username).subscribe((res: any) => {
      if (res.code === 0) {
        this.snackbarUtilService.showSnackbar("Your Video delete request has been accepted, Video will soon be deleted");
      } else if (res.code === 7) {
        this.snackbarUtilService.showSnackbar("Your Video delete request already in process");
      } else {
        this.snackbarUtilService.showError(res.message);
      }
    });


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

  watchAsset(name, mediaId, type) {
    this.appUtilService.getAssetRouteUrl(name, mediaId, null, null, type, null, null, null).subscribe((res: any) => {
      this.router.navigate([res.url]);
    }, error => {
      this.router.navigate(['/']);
    })
  }



}
