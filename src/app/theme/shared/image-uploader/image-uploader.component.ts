import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UUID } from 'angular2-uuid';
import * as S3 from 'aws-sdk/clients/s3';
import { Credentials } from 'aws-sdk/lib/credentials';
import { MessageService } from '../services/message.service';
import { ImageFileUploadState } from '../typings/common-interface-typings';
import { AWSConstants, AWSServiceClients, MessageServiceConstants } from '../typings/shared-typing';

declare var $: any;

@Component({
  selector: '[app-image-uploader]',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit, AfterViewInit {

  @Input()
  uploadStateHandler: ImageFileUploadState;

  @Input()
  fileBaseKey: string;

  @Input()
  cssClass: string;

  @Output()
  imageChangeEvent = new EventEmitter<any>();

  @Input()
  cropRatio: any;

  @Input()
  imageMaxSize: number; // input in MB

  @Input()
  uploadedImage: string;

  @Output()
  croppedImageEvent = new EventEmitter<any>();

  @Output()
  imageUploadedEvent = new EventEmitter<any>();


  selectedFile: string;
  awsServiceClients: AWSServiceClients;
  awsCredentials: Credentials;
  s3: S3;

  uploadCompleted: boolean;
  uploadFailed: boolean;
  hideUploadButton: boolean;
  hideCancelButton: boolean;
  showCroppedImage: boolean;

  imageChangedEvent: any = '';
  croppedImage: any;

  showImageMaxSizeError: boolean;
  imageMimeType: string[];

  constructor(private messageService: MessageService) {
    this.awsServiceClients = new AWSServiceClients(AWSConstants.SOURCE_BUCKET_NAME, false);
    this.awsCredentials = this.awsServiceClients.getCredentialsObject();

    this.s3 = this.awsServiceClients.getS3Object();
    this.selectedFile = '';
    this.showImageMaxSizeError = false;
    this.imageMimeType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  }

  ngOnInit() {

    this.messageService.messageCommonObj$.subscribe((messageArr: any[]) => {
      if (messageArr && messageArr.length > 0) {
        if (messageArr[0] === MessageServiceConstants.RESET_IMAGE_UPLOADER) {
          this.resetMediaUploader();
        }
        if (messageArr[0] === MessageServiceConstants.SHOW_UPLOADED_IMAGE) {
          if (messageArr[1]) {
            this.selectedFile = messageArr[1];
            this.showCroppedImage = true;
            this.uploadStateHandler.showUploadControls = true;
            this.hideUploadButton = true;
            this.uploadCompleted = true;
            this.croppedImage = "https://dcusr6ubyamsu.cloudfront.net/app/user/profilePicture/" + this.selectedFile;
          }
        }
      }
    });

    $(".custom-image-input").on('change', (e: any) => {
      let isValid: boolean = false;
      this.imageMimeType.forEach((element, index) => {
        if (e.currentTarget.files[0].type === element) {
          isValid = true;
        }
      });
      if (isValid) {
        $("#imageTypeErrorLabel, .imageTypeErrorLabel").hide();
        if (this.imageMaxSize) {
          if (e.currentTarget.files[0].size > (this.imageMaxSize * 1000000)) {
            this.showImageMaxSizeError = true;
            $("#imageSizeErrorLabel, .imageSizeErrorLabel").show();
            $("#imageRequiredErrorLabel,.imageRequiredErrorLabel, #addedImageErrorLabel,.addedImageErrorLabel").hide();
          } else {
            this.showImageMaxSizeError = false;
            $("#imageSizeErrorLabel, .imageSizeErrorLabel").hide();
          }
        }

        if (this.imageMaxSize) {
          if (!this.showImageMaxSizeError) {
            this.uploadStateHandler.showUploadControls = true;
            this.imageChangeEvent.emit(e);
            this.selectedFile = e.currentTarget.files[0].name;
            this.uploadStateHandler.selectedFile = e.currentTarget.files[0];
          } else {
            this.imageChangeEvent.emit(false);
          }
        } else {
          this.uploadStateHandler.showUploadControls = true;
          this.selectedFile = e.currentTarget.files[0].name;
          this.uploadStateHandler.selectedFile = e.currentTarget.files[0];
          this.imageChangeEvent.emit(e);
        }

      } else {
        $("#imageTypeErrorLabel, .imageTypeErrorLabel").show();
        $("#imageRequiredErrorLabel, .imageRequiredErrorLabel , #addedImageErrorLabel,.addedImageErrorLabel , #imageSizeErrorLabel, .imageSizeErrorLabel").hide();

      }

    });

    if (this.cssClass) {
      // $("#addMediaClass").addClass(this.cssClass);
    }
    this.showCroppedImage = false;

  }

  // ngAfterViewChecked() {

  // }

  ngAfterViewInit() {

  }


  cancelFileSelection() {
    this.uploadStateHandler.showUploadControls = false;
    this.uploadStateHandler.showUploadLoader = false;
    this.uploadStateHandler.disableFormControls = false;
    this.uploadStateHandler.uploadedFile = undefined;
    this.uploadStateHandler.selectedFile = undefined;
    this.uploadCompleted = false;
    this.uploadFailed = false;
    this.hideUploadButton = false;
    this.hideCancelButton = false
    this.imageChangeEvent.emit(false);
    this.showCroppedImage = false;
    this.showImageMaxSizeError = false;
    // this.uploadStateHandler.enableAutoTranscode = false;
    // this.uploadStateHandler.enablePreview = false;
    $(".custom-image-input").val('');
    $("#imageRequiredErrorLabel, .imageRequiredErrorLabel").hide();
    $("#imageSizeErrorLabel, .imageSizeErrorLabel").hide();
    $("#addedImageErrorLabel, .addedImageErrorLabel").hide();
  }

  startVideoUpload() {
    this.uploadStateHandler.showUploadLoader = true;
    this.uploadStateHandler.disableFormControls = true;

    this.uploadSelectedToS3();
  }

  private uploadSelectedToS3() {
    if (this.selectedFile != null && this.selectedFile !== undefined) {

      this.uploadFile(this.uploadStateHandler.selectedFile);
    } else {
      $(function () {
        alert('No file selected');
        // showNotification('bg-blue-grey', 'No files selected', 'bottom', 'center', 'animated fadeInUp', 'animated fadeOutUp');
      });
    }
  }

  public uploadFile(file: File) {
    this.hideCancelButton = true;
    this.showCroppedImage = true;
    $("#imageRequiredErrorLabel, .imageRequiredErrorLabel").hide();
    $("#imageSizeErrorLabel, .imageSizeErrorLabel").hide();
    $("#addedImageErrorLabel, .addedImageErrorLabel").hide();
    let fileUploadObject;
    if (this.fileBaseKey !== undefined && this.fileBaseKey !== null && this.fileBaseKey !== '') {
      const fileName = UUID.UUID() + '.png';
      this.uploadStateHandler.fileName = fileName;
      fileUploadObject = {
        Body: file,
        Bucket: AWSConstants.SOURCE_BUCKET_NAME,
        Key: this.fileBaseKey + '/' + fileName
      };
    } else {

    }

    this.s3.putObject(fileUploadObject, (error, data) => {
      if (error) {
        console.error(error, error.stack);
        // this.uploadStateHandler.enablePreview = false;
        this.uploadFailed = true;
        this.showCroppedImage = false;
      } else {
        // this.uploadStateHandler.enablePreview = true;
        this.uploadCompleted = true;
        this.showCroppedImage = true;
        this.hideCancelButton = false;

        // this.uploadStateHandler.enableAutoTranscode = true;
      }

      this.uploadStateHandler.disableFormControls = false;
      this.uploadStateHandler.showUploadLoader = false;
      this.uploadStateHandler.uploadedFile = file;
      this.uploadStateHandler.showUploadControls = true;


      this.hideUploadButton = true;

      if (error) {
        this.imageUploadedEvent.emit(false);
      } else {
        this.imageUploadedEvent.emit(true);
      }
    });
  }

  resetMediaUploader() {
    this.cancelFileSelection();
  }

  fileChangeEvent(event: any): void {
    $('.source-image').css('max-height', '200px');
    this.imageChangedEvent = event;
  }
  imageCropped(image: string) {
    this.croppedImage = image;
    const img: any = this.dataURItoBlob(image);
    if (this.imageMaxSize) {
      if (!this.showImageMaxSizeError) {
        this.uploadStateHandler.selectedFile = img;
      }
    } else {
      this.uploadStateHandler.selectedFile = img;
    }
    this.croppedImageEvent.emit(this.croppedImage);
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }

  dataURItoBlob(dataURI) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/jpg'
    });
  }
}
