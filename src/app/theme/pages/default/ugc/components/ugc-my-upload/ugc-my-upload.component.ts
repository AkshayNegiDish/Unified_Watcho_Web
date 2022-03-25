import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppFormService } from '../../../../../shared/services/shared-form.service';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { VideoStatus } from '../../models/genres.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { Router } from '@angular/router';
import { PlaceholderImage } from '../../../../../shared/typings/common-constants';
import * as S3 from 'aws-sdk/clients/s3';
import { AWSServiceClients } from '../../../../../shared/typings/shared-typing';
import { MediaUploadConstants } from '../../../../../shared/typings/media-upload-constants';
import { environment } from '../../../../../../../environments/environment';
declare var $: any

@Component({
  selector: 'app-ugc-my-upload',
  templateUrl: './ugc-my-upload.component.html',
  styleUrls: ['./ugc-my-upload.component.scss']
})
export class UgcMyUploadComponent implements OnInit {

  awsS3 = new S3();


  @ViewChild('inReview')
  inReviewModalRef: ElementRef;

  @ViewChild('rejectedModal')
  rejectedModalRef: ElementRef;

  status: any[] = ["REJECTED", "IN_PROCESS", "PENDING", "FAILED"]
  userInfo: any;
  pageNo: number = 1;
  pageSize: number = 30;
  videos: any = [];
  VideoStatus = VideoStatus;
  kalturaAssetListResponse: any = [];
  loading: boolean = false;
  viewCountObject: any = [];
  noResultFound: boolean;
  DMS: any;
  placeholderImage: string;
  isPWA: boolean;
  myUploadsPageNo: number = 1;
  myUploadsPageSize: number = 30;
  image: string = null;
  keysArray: any = {};
  videoArray: any = {};
  showImage: boolean;
  awsServiceClients: AWSServiceClients;




  constructor(private appFormService: AppFormService, private appUtilService: AppUtilService,
    private modalService: NgbModal, private kalturaAppSevice: KalturaAppService,
    private snackbarUtilService: SnackbarUtilService, private platformIdentifierService: PlatformIdentifierService,
    private router: Router) {
    this.awsServiceClients = new AWSServiceClients(MediaUploadConstants.imageUploadS3Bucket, true);
    this.awsS3 = this.awsServiceClients.getS3Object();
  }

  ngOnInit() {
    if (this.appUtilService.checkIfPWA()) {
      this.isPWA = true;
    } else {
      this.isPWA = false;
    }
    this.placeholderImage = PlaceholderImage.NO_UPLOADS;
    this.DMS = this.appUtilService.getDmsConfig();
    this.userInfo = this.appUtilService.getLoggedInUserDetails();
    this.getPendingUgcVideos(false)

  }
  getPendingUgcVideos(clearValues: boolean) {
    this.noResultFound = false;
    if (this.platformIdentifierService.isBrowser()) {
      $(document).ready(() => {
        $("#pending-videos").css("pointer-events", "none");
      })
    }
    if (clearValues) {
      this.pageNo = 1;
    }
    this.loading = true;
    this.appFormService.getMyUploadVideos(this.userInfo.username, this.pageNo, this.pageSize, this.status).subscribe((res: any) => {
      if (res.code === 0) {
        if (clearValues) {
          this.videos = [];
        }
        $("#uploaded-videos").css("pointer-events", "auto");
        res.data.data.forEach((element) => {
          var videoModal: any = {
            genre: null,
            title: null,
            status: null,
            videoThumbnail: null
          }
          videoModal.genre = element.genre;
          videoModal.title = element.title;
          videoModal.status = element.status;
          videoModal.videoThumbnail = environment.IMAGES_CLOUDFRONT_URL + "/images/" + element.videoThumbnail;
          this.videos.push(videoModal);
        });
        if (this.videos.length > 0) {
          this.noResultFound = false;
        } else {
          this.noResultFound = true;
        }
        this.loading = false;
        return;
      }
      $("#uploaded-videos").css("pointer-events", "auto");
      this.loading = false;
      this.snackbarUtilService.showError();
    }, error => {
      $("#uploaded-videos").css("pointer-events", "auto");
      this.loading = false;
      this.snackbarUtilService.showError();
    })
  }

  getMoreVideos() {
    this.pageNo = this.pageNo + 1;
    this.getPendingUgcVideos(false);
  }

  handleImageError(event) {
    event.target.src = this.appUtilService.getDefaultThumbnail('LANDSCAPE')
  }

  showInfoModal(status) {
    if (status === VideoStatus[VideoStatus.REJECTED]) {
      this.modalService.open(this.rejectedModalRef);
    } else {
      this.modalService.open(this.inReviewModalRef);
    }
  }


  getMypload(clearValues: boolean) {
    // FIXME: Have to fix this when pagination starts

    this.noResultFound = false;
    this.loading = true
    if (this.appUtilService.isUserLoggedIn()) {
      if (this.platformIdentifierService.isBrowser()) {
        $(document).ready(() => {
          $("#uploaded-videos").css("pointer-events", "none");
        })
      }
      if (clearValues) {
        this.myUploadsPageNo = 1;
      }

      this.kalturaAppSevice.getAssetDetailBySeriesId('UGC_' + this.userInfo.username, +this.DMS.params.MediaTypes.UGCVideo, this.myUploadsPageNo, this.myUploadsPageSize).then(res => {
        if (res.totalCount > 0) {
          if (clearValues) {
            this.kalturaAssetListResponse = [];
          }
          $("#pending-videos").css("pointer-events", "auto");

          this.loading = false;
          let assetIdIn = '';
          if (res.objects) {
            this.kalturaAssetListResponse = [...this.kalturaAssetListResponse, ...res.objects];
            res.objects.forEach((element, index) => {
              assetIdIn += element.id + ',';
            })
            assetIdIn = assetIdIn.substr(0, assetIdIn.length - 1);
            this.kalturaAppSevice.getAssetStatistics(assetIdIn, 0, 0).then(res2 => {
              if (clearValues) {
                this.viewCountObject = [];
              }

              this.viewCountObject = [...this.viewCountObject, ...res2.objects];
              this.loading = false;
            }, reject => {
              this.loading = false;
              this.snackbarUtilService.showError(reject.message);
            });
          }

        } else {
          this.loading = false;
          this.noResultFound = true;
          $("#pending-videos").css("pointer-events", "auto");

        }
      }, reject => {
        this.loading = false;
        console.error(reject);
        $("#pending-videos").css("pointer-events", "auto");
      });
    } else {

    }
  }

  removeFromMyUploads(videoId: string, event) {
    event.stopPropagation();
    this.appFormService.removeFromMyUploads(videoId, this.userInfo.username).subscribe((res: any) => {
      if (res.code === 0 || res.code === 10) {
        this.snackbarUtilService.showSnackbar("Your Video delete request has been accepted, Video will soon be deleted");
      } else if (res.code === 7) {
        this.snackbarUtilService.showSnackbar("Your Video delete request already in process");
      } else {
        this.snackbarUtilService.showError(res.message);
      }
    });


  }

  watchAsset(name, mediaId, type) {
    this.appUtilService.getAssetRouteUrl(name, mediaId, null, null, type, null, null, null).subscribe((res: any) => {
      this.router.navigate([res.url]);
    }, error => {
      this.router.navigate(['/']);
    })
  }

  getMoreMyUploadsVideos() {
    this.myUploadsPageNo = this.myUploadsPageNo + 1;
    this.getMypload(false)
  }
}
