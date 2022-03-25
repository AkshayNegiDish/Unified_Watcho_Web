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
declare var $: any

@Component({
  selector: 'app-leaderboard-current',
  templateUrl: './leaderboard-current.component.html',
  styleUrls: ['./leaderboard-current.component.scss']
})

export class LeaderboardCurrentComponent implements OnInit {

  awsS3 = new S3();
  awsServiceClients: AWSServiceClients;
  isPWA: boolean;

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
  }

  handleImageError(event) {
    event.target.src = this.appUtilService.getDefaultThumbnail('LANDSCAPE')
  }
}