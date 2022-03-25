import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileSystemFileEntry, UploadEvent } from 'ngx-file-drop';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import 'rxjs/add/observable/of';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { MediaUploadService } from '../../../../../shared/services/media-upload.service';
import { AppFormService } from '../../../../../shared/services/shared-form.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { ViewPortService } from '../../../../../shared/services/view.port.service';
import { AppConstants, PlaceholderImage } from '../../../../../shared/typings/common-constants';
import { OTTCategory } from '../../../../../shared/typings/kaltura-response-typings';
import { Genre, Genres } from '../../models/genres.model';
import { Instructions, VideoContentRequest, VideoContentRequestStatus } from '../../models/ugc.upload.model';
import { VideoUploadProgress, VideoUploadState } from '../../models/video.upload.model';
import { ContestType, ContestArray, ContestModal } from '../../models/contest.model';
import { UgcFormService } from '../../services/ugc-form.service';
import { environment } from '../../../../../../../environments/environment';

declare var $: any;
declare var document: any;

@Component({
  selector: 'app-my-upload',
  templateUrl: './my-upload.component.html',
  styleUrls: ['./my-upload.component.scss']
})
export class MyUploadComponent implements OnInit, AfterViewInit {
  isBrowser;

  showUploadsContainer: boolean;

  loading: boolean;
  // screenId: string;
  channel: any;

  categoryDetails: OTTCategory;

  noUploads: boolean;

  noUploadPlaceholder: string;

  newUploadsButton: string;

  selectedUploadFile: Blob;
  selectedUploadVideoFileName: string;

  // thumbnail control variables
  thumbnailSelected: boolean;
  thumbnailCropped: boolean;
  imageChangedEvent: any = '';
  selectedThumbnailFile: Blob;
  thumbnailImageType: string;
  thumbnailBase64Data: string;
  showThumbnailUploadLoader: boolean;

  // @ViewChild('uploadModal')
  // uploadModalRef: ElementRef;
  // uploadModalResultRef: Promise<any>;

  @ViewChild('ifpModal')
  ifpModalRef: ElementRef;
  ifpModalResultRef: Promise<any>;


  @ViewChild('downloadInAppModal')
  downloadInAppModalRef: ElementRef;
  downloadInAppModalResultRef: Promise<any>;

  // upload form inputs
  uploadVideoTitle: string;
  uploadVideoGenres: Genre[];
  uploadVideoDescription: string;
  selectedVideoGenre: Genre;

  // upload form control flags
  enableUploadButton: boolean = true;
  isUGCApiCalled: boolean;
  uploadProgress: number;

  // s3 upload variables
  videoUploadLink: string;
  videoThumbnailUploadLink: string;

  // user information
  userInfo: any;

  DMS: any;

  ifpMeta: any[] = [];
  metaTheme: any[] = [];
  festivalName: string = "Select Competition";
  festivalId: any;
  passcode: string;
  isIFP: boolean = false;

  videoContentRequest: VideoContentRequest;
  themeName: string = "Select Theme";
  instructions: Instructions = {
    instructionHeader: null,
    instructions: [],
    passcode: null
  }
  showInstruction: boolean = false;
  isTermsChecked: boolean = false;
  termsOfUse: string = AppConstants.UGC_CAMPUS_CONNECT_TERMS_OF_USE
  fileName: string;
  imageFileName: string;
  uploadButtonText: string = "Upload";
  shaowVideoUploadLoader: boolean = false;
  imageIsCropped: boolean = false;
  contestArray: ContestArray;
  contestsFound: boolean = false;
  contestId: number = null;
  showContestPlaceHolder: boolean = true;
  defaultUpload: boolean;
  showContest: boolean = false;


  constructor(@Inject(PLATFORM_ID) private platformId, private activateRoute: ActivatedRoute, private kalturaAppService: KalturaAppService, private modalService: NgbModal,
    private mediaUploadService: MediaUploadService, private sharedFormService: AppFormService, private viewPortService: ViewPortService,
    private appUtilService: AppUtilService, private titleService: Title, private snackbarUtilService: SnackbarUtilService, private activatedRoute: ActivatedRoute, private ugcFormService: UgcFormService) {
    this.uploadVideoGenres = Genres.getGenres();
    this.isBrowser = isPlatformBrowser(platformId);

    this.videoContentRequest = {
      creatorEmail: null,
      creatorId: null,
      creatorName: null,
      description: null,
      genre: null,
      subGenre: null,
      link: null,
      status: null,
      title: null,
      videoThumbnail: null,
      festivalId: null,
      themeId: null,
      passcode: null,
      creatorContact: null,
      videoId: null
    }
    this.contestArray = {
      contestModal: []
    }
  }

  ngOnInit() {
    this.getIFPMeta();
    this.titleService.setTitle("Upload your video | " + AppConstants.APP_NAME_CAPS + " Creators")
    this.DMS = this.appUtilService.getDmsConfig('dgdfg');
    // this.screenId = this.DMS.baseChannels.ifpChannel;
    if (this.isBrowser === true) {
      if (this.viewPortService.isMobile() === true || this.viewPortService.isTablet() === true) {
        this.showUploadsContainer = false;
        if (this.isBrowser) {
          setTimeout(() => this.downloadInAppModal());
        }
      } else {
        this.showUploadsContainer = true;
      }

      this.noUploads = true;
      //  this.kalturaGetIFPBanner(+this.screenId);
      this.noUploadPlaceholder = PlaceholderImage.NO_UPLOADS;
      this.newUploadsButton = PlaceholderImage.NEW_UPLOADS;

      if (this.isBrowser) {
        if (this.activateRoute.data["value"]["isIFP"]) {
          this.isIFP = true;
          setTimeout(() => this.openIfpModal());
        }
      }

      this.resetState();
      this.subscribeImageUploadStateHandler();
      this.subscribeVideoUploadStateHandler();

      this.userInfo = JSON.parse(localStorage.getItem('user-sms'));

      if (this.userInfo === null || this.userInfo === undefined) {
        // TODO: handle no user info
      }

    }
    this.showContest = this.appUtilService.getShowContestStatus();
    if (this.showContest) {
      this.getContestList();
    }
    this.activatedRoute.queryParamMap.subscribe((param: ParamMap) => {
      if (param.get("contestId")) {
        this.showContestPlaceHolder = false;
        this.contestId = +param.get("contestId");
        this.defaultUpload = false;
      } else {
        this.defaultUpload = true;
      }
    })
  }

  ngAfterViewInit() {

  }

  kalturaGetIFPBanner(id: number) {
    // alert(id);
    this.loading = true;
    this.kalturaAppService.getOTTChannel(id).then((response: any) => {
      this.channel = response;

      this.loading = false;
    }, reject => {
      this.categoryDetails = null;
      this.loading = false;
      console.error(reject);
    });

  }

  browseFile() {
    let browserDetails: any;
    browserDetails = this.appUtilService.getBrowserDetails()
    // if (browserDetails.browser === "MS-Edge") {
    //   this.modalService.open(EdgeErrorComponent, { size: 'lg' })
    //   // this.modalService.open(this.edgeErrorModalref)
    // } else {

    $('#file-selector').click();
    if (this.fileName !== "") {
      $(document).ready(() => {
        $('.upload-data').removeAttr("disabled", true);
      })
    } else {
      $(document).ready(() => {
        $('.upload-data').attr("disabled", true);
      })
    }
    // }
  }

  dropped(e: UploadEvent) {
    // only one file is allowed
    if (e.files.length > 1) {
      this.snackbarUtilService.showError('Please drop only one file');
    } else {
      var droppedFile = e.files[0];
      // check if dropped file is directory
      if (droppedFile.fileEntry.isDirectory) {
        this.snackbarUtilService.showError('Directory cannot be uploaded');
      } else {
        // check if dropped file is .mp4
        if (!droppedFile.fileEntry.name.endsWith('.mp4')) {
          this.snackbarUtilService.showError('Only .mp4 files can be uploaded');
        } else {
          // extract file and handle upload
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

          fileEntry.file((selectedFile: File) => {
            this.fileName = selectedFile.name;
            this.handleFileUpload(selectedFile);
          });
        }

      }
    }
    if (e.files[0].fileEntry.isFile) {
      $(document).ready(() => {
        $('.upload-data').removeAttr("disabled", true);
      })
    }

    console.log(e);
  }

  fileBrowsed(e) {
    if (e.target.files[0].type.lastIndexOf("mp4") > 0) {
      if (e.target.files.length > 0) {
        this.fileName = e.target.files[0].name;
        this.handleFileUpload(e.target.files[0]);
      }
    } else {
      this.snackbarUtilService.showError('Only .mp4 files can be uploaded');
      return;
    }
    if (e.target.files.length > 0) {
      $(document).ready(() => {
        $('.upload-data').removeAttr("disabled", true);
      })
    }

  }

  handleFileUpload(file: Blob) {
    this.selectedUploadFile = new Blob([file]);
    // this.uploadModalResultRef = this.modalService.open(this.uploadModalRef, { size: 'lg', windowClass: 'uploadModal' }).result;

    // this.uploadModalResultRef.then(fulfilled => {
    //   // this.resetState();
    // }, rejected => {
    //   // this.resetState();
    //   // console.error(err);
    // });
  }

  fileLeave(e) {

  }

  browseThumbnail() {
    $(".no-thumbnail-browse").removeClass("error-thumbnail");
    $('#uploadThumbnailFile').click();
  }

  videoThumbnailSelected(e) {
    if (e.target.files.length > 0) {
      this.imageChangedEvent = e;
      this.thumbnailSelected = true;

      var fileName: string = e.target.files[0].name;

      this.thumbnailImageType = fileName.slice(fileName.lastIndexOf('.'), fileName.length);
    }
  }

  cropImage(imageCropper: ImageCropperComponent) {
    $(".image-box").removeClass("error-thumbnail");
    this.imageIsCropped = true;
    imageCropper.crop();
  }

  cancelImageSelect(imageCropper: ImageCropperComponent) {
    this.thumbnailSelected = false;
    this.thumbnailImageType = null;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.thumbnailCropped = true;
    this.thumbnailBase64Data = event.base64;
    $('.thumbnail-img').attr('src', this.thumbnailBase64Data);
  }

  croppedImageLoaded() {
    this.showThumbnailUploadLoader = true;
    fetch(this.thumbnailBase64Data)
      .then(res => res.blob())
      .then(blob => {
        this.selectedThumbnailFile = new Blob([blob])
        this.imageFileName = new Date().getTime() + this.thumbnailImageType;
        // upload to s3
        this.uploadThumbnailToS3();
      })
  }

  uploadThumbnailToS3() {
    this.mediaUploadService.uploadImageToS3(null, null, this.selectedThumbnailFile, this.imageFileName);
  }

  subscribeImageUploadStateHandler() {
    this.mediaUploadService.imageUploadStateSubject$.subscribe((msgObserver: any) => {
      if (msgObserver !== null && msgObserver !== undefined) {
        this.showThumbnailUploadLoader = false;
        // this.enableUploadButton = true;
        this.videoThumbnailUploadLink = msgObserver.Location;
      }
    });
  }

  subscribeVideoUploadStateHandler() {
    this.mediaUploadService.videoUploadStateSubject$.subscribe((msgObserver: VideoUploadProgress) => {
      if (msgObserver !== null && msgObserver !== undefined) {
        if (msgObserver.state == VideoUploadState.UPLOADING) {
          this.uploadProgress = msgObserver.progress;
          this.uploadButtonText = "Uploading...";
          $(document).ready(() => {
            $('.upload-data').attr("disabled", true);
          })
        } else if (msgObserver.state === VideoUploadState.FAILED) {
          this.shaowVideoUploadLoader = false;
          console.error('Video upload failed with error : ' + msgObserver.failureMsg);
          this.uploadButtonText = "Upload";
          $(document).ready(() => {
            $('.upload-data').removeAttr("disabled", true);
          })

        } else if (msgObserver.state === VideoUploadState.COMPLETED) {
          this.imageIsCropped = false;
          this.uploadProgress = msgObserver.progress;
          this.uploadButtonText = "Upload";
          this.videoUploadLink = msgObserver.uploadedVideoLocation;
          this.shaowVideoUploadLoader = false;
          this.callUGCCreateApi(this.videoUploadLink);
          this.modalService.dismissAll();
          $(document).ready(() => {
            $('.upload-data').removeAttr("disabled", true);
          })
        }
      }
    });
  }

  ugcGenreSelect(e) {
    this.selectedVideoGenre = this.uploadVideoGenres[e - 1];
  }

  uploadVideo() {
    this.checkIfUserCanUploadVideo().then((res: boolean) => {
      if (!res) {
        if (this.validateUGCModal()) {
          this.uploadButtonText = "Uploading...";
          this.shaowVideoUploadLoader = true
          this.selectedUploadVideoFileName = new Date().getTime() + '.mp4';
          this.mediaUploadService.uploadVideoToS3(this.selectedUploadFile, this.selectedUploadVideoFileName);
          this.appUtilService.moEngageEventTrackingWithNoAttribute("UPLOAD_VIDEO_INITIATE");
          this.gtmTagOnUploadVideo();
        } else {
        }
      }
    })
  }

  callUGCCreateApi(videoLink) {
    let newUGCRequest: VideoContentRequest = null;
    this.isUGCApiCalled = true;
    try {
      newUGCRequest = {

        creatorEmail: this.userInfo.EmailID,
        creatorId: this.userInfo.OTTSubscriberID.toString(),
        creatorName: this.userInfo.Name,
        description: this.uploadVideoDescription,
        genre: this.selectedVideoGenre.name,
        subGenre: '',
        link: this.videoUploadLink.slice(this.videoUploadLink.lastIndexOf('/') + 1, this.videoUploadLink.length),
        status: VideoContentRequestStatus[VideoContentRequestStatus.PENDING],
        title: this.uploadVideoTitle,
        videoThumbnail: this.videoThumbnailUploadLink.slice(this.videoThumbnailUploadLink.lastIndexOf('/') + 1, this.videoThumbnailUploadLink.length),
        festivalId: '',
        themeId: '',
        passcode: '',
        creatorContact: '',
        videoId: '12345',
        contestID: this.contestId ? this.contestId : null
      }
    } catch (e) {

    }

    if (this.isIFP) {

      if (this.videoContentRequest.passcode) {
        newUGCRequest.passcode = this.videoContentRequest.passcode;
      }
      if (this.videoContentRequest.themeId) {
        newUGCRequest.themeId = this.videoContentRequest.themeId;
      }
      if (this.videoContentRequest.festivalId) {
        newUGCRequest.festivalId = this.videoContentRequest.festivalId;
      }

    }

    this.sharedFormService.uploadNewUGCVideo(newUGCRequest).subscribe((res: any) => {
      if (res.body.code === 0) {
        this.snackbarUtilService.showSnackbar("Your video has been uploaded and is being reviewed. You will see the video under 'My Uploads' once approved");
        this.resetState();
      } else {
        this.snackbarUtilService.showSnackbar(res.body.message);
      }

    }, reject => {
      console.error(reject);
    });


    setTimeout(() => {
      this.isUGCApiCalled = false;
    }, 2000);
  }

  resetState() {
    this.thumbnailSelected = false;
    this.thumbnailCropped = false;
    this.showThumbnailUploadLoader = false;
    this.enableUploadButton = true;
    this.imageIsCropped = false;
    this.isUGCApiCalled = false;
    this.fileName = '';
    $('#file-selector').val('');
    $('#uploadVideoGenreSelect').val('Genre');
    this.selectedUploadFile = null;
    this.selectedUploadVideoFileName = null;
    this.uploadProgress = 0;
    this.uploadVideoTitle = '';
    this.uploadVideoDescription = '';
    this.videoUploadLink = '';
    this.videoThumbnailUploadLink = '';
    if (this.fileName === "") {
      $(document).ready(() => {
        $('.upload-data').attr("disabled", true);
      })
    }
  }

  openIfpModal() {
    this.ifpModalResultRef = this.modalService.open(this.ifpModalRef, { size: 'lg', windowClass: 'ifpModal' }).result;

    this.ifpModalResultRef.then(fulfilled => {
    }, rejected => {
    });
  }

  getIFPMeta() {
    this.sharedFormService.getIFPMeta().subscribe((res: any) => {
      res.data.forEach((element) => {
        this.ifpMeta.push(element);
      });
    });
  }

  populateTheme(metaTheme: any) {
    this.metaTheme = [];
    this.festivalId = metaTheme.id;
    this.festivalName = metaTheme.festivalName;
    this.passcode = metaTheme.passcode;
    metaTheme.themes.forEach((element) => {
      this.metaTheme.push(element);

    })
    this.instructions = {
      instructionHeader: null,
      instructions: [],
      passcode: null
    }
    this.themeName = "Select Theme";
    this.showInstruction = false;
  }

  getValuesFromThemeDropDown(theme: any) {
    this.showInstruction = true;
    this.instructions = {
      instructionHeader: null,
      instructions: [],
      passcode: null
    }
    this.themeName = theme.themeName
    this.videoContentRequest.festivalId = this.festivalId;
    this.videoContentRequest.themeId = theme.id;
    this.instructions.instructionHeader = theme.instructionHeader;
    this.instructions.passcode = this.passcode;
    theme.instructions.forEach((element) => {
      this.instructions.instructions.push(element);
    })
  }

  submitIFPForm() {
    if (this.festivalName === 'Select Competition') {
      this.snackbarUtilService.showError('Please Select Competition');
    } else if (this.themeName === 'Select Theme') {
      this.snackbarUtilService.showError('Please Select Theme');
    } else if (!this.videoContentRequest.passcode || this.videoContentRequest.passcode.trim() === '') {
      this.snackbarUtilService.showError('Please enter correct passcode');
    } else if (!this.isTermsChecked) {
      this.snackbarUtilService.showError('Please accept Terms and Conditions');
    } else if (this.videoContentRequest.passcode != this.passcode) {
      this.snackbarUtilService.showError('Please enter correct passcode');
    } else {
      //this.modalService.dismissAll();
      this.browseFile();
    }
  }

  validateUGCModal(): boolean {
    if (!this.videoThumbnailUploadLink) {
      $(".no-thumbnail-browse").addClass("error-thumbnail");
      if (!this.imageIsCropped && this.thumbnailSelected) {
        $(".image-box").addClass("error-thumbnail");
        this.snackbarUtilService.showError('Please crop the image before uploading');
        return false;
      }
      this.snackbarUtilService.showError('Please upload video thumbnail');
      return false;
    } else if (this.uploadVideoTitle.trim() === '') {
      this.snackbarUtilService.showError('Title is required');
      return false;
    } else if (!this.selectedVideoGenre) {
      this.snackbarUtilService.showError('Genre is required');
      return false;
    } else if (this.uploadVideoDescription.trim() === '') {
      this.snackbarUtilService.showError('Description is required');
      return false;
    } else if (!this.videoThumbnailUploadLink) {
      this.snackbarUtilService.showError('Thumbnail is required');
      return false;
    } else {
      return true;
    }
  }

  downloadInAppModal() {
    this.downloadInAppModalResultRef = this.modalService.open(this.downloadInAppModalRef, { size: 'lg', windowClass: 'downloadInAppModal' }).result;

    this.downloadInAppModalResultRef.then(fulfilled => {
    }, rejected => {
    });
  }


  gtmTagOnUploadVideo() {
    let datalayerJson = {
      'button_id': 'upload_video',
      'button_name': 'Upload Video',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful',
      'button_location': 'Video_Upload_Details_Screen',
      'title': this.uploadVideoTitle ? this.uploadVideoTitle : null,
      'genre': this.selectedVideoGenre ? this.selectedVideoGenre.name : null,
      'description': this.uploadVideoDescription ? this.uploadVideoDescription : null
    };
    this.appUtilService.getGTMTag(datalayerJson, 'upload_video');
  }

  gtmTagOnSelectVideoForUpload() {
    let datalayerJson = {
      'button_id': 'Select_Video_for_Upload',
      'button_name': 'Select Video for Upload',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful',
      'button_location': 'Video_Upload_Page'
    };
    this.appUtilService.getGTMTag(datalayerJson, 'select_video_for_upload');
  }

  closeThumbnail() {
    this.thumbnailSelected = false;
    this.thumbnailCropped = false;
    this.videoThumbnailUploadLink = '';
  }
  cancelVideo(e: any) {
    this.fileName = '';
    $('#file-selector').val('');
    e.stopPropagation();
    $(document).ready(() => {
      $('.upload-data').attr("disabled", true);
    })
  }

  contestSelect(event: any) {
    this.contestId = +event;
  }

  getContestList() {
    this.contestsFound = false;
    this.ugcFormService.getContestListing(ContestType[ContestType.LIVE], 1, 100).subscribe((res: any) => {
      if (res.code === 0) {
        if (res.data.data.length > 0) {
          if (this.defaultUpload) {
            this.contestId = res.data.data[0].id;
          }
          res.data.data.forEach((element) => {
            var contestModal = new ContestModal();
            contestModal.id = element.id;
            contestModal.name = element.title;
            contestModal.description = element.description;
            contestModal.startDate = element.startDate;
            contestModal.endDate = element.endDate;
            contestModal.thumbnailUrl = environment.IMAGES_CLOUDFRONT_URL + "/contest/" + element.landscapeImage;
            this.contestArray.contestModal = [...this.contestArray.contestModal, contestModal]
          })
          this.contestsFound = true;
          return;
        }
        return;
      }
    }, error => {

    })
  }

  checkIfUserCanUploadVideo(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.contestId) {
        this.ugcFormService.checkForVideoinCotest(this.contestId.toString(), JSON.parse(localStorage.getItem("user-sms")).OTTSubscriberID).subscribe((res: any) => {
          if (res.code === 0) {
            if (res.data.length > 0) {
              this.snackbarUtilService.showSnackbar("You can upload only one video in a contest, Please select another contest.");
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        }, error => {
          resolve(false);
        });
      } else {
        resolve(false)
      }
    })
  }
}
