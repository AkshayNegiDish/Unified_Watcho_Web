import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppUtilService } from '../services/app-util.service';
import { KalturaAppService } from '../services/kaltura-app.service';
import { KalturaUtilService } from '../services/kaltura-util.service';
import { SnackbarUtilService } from '../services/snackbar-util.service';
import { PlatformIdentifierService } from '../services/platform-identifier.service';
import { BehaviorSubject } from 'rxjs';
import { ModalMessageService } from '../services/modal-message.service';

declare var $: any;

@Component({
  selector: 'ugc-video-popup',
  templateUrl: './ugc-video-popup.component.html',
  styleUrls: ['./ugc-video-popup.component.scss']
})
export class UgcVideoPopupComponent implements OnInit {

  @Input() ugcVideoChange: any = new BehaviorSubject<any>([]);
  @Input() index: number = 0;
  @Output() getMoreVideos: EventEmitter<any> = new EventEmitter();
  @Input() totalVideos: number = 0;
  @Input() fromRails?: boolean = false;
  startLikes: number = 0;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode == 37 && this.index != 0) {
      this.openPrevImage();
    } else if (event.keyCode == 39 && this.index != this.totalVideos - 1) {
      this.openNextImage();
    }
  }

  randomColor: string;
  solidColor: any;
  loading: boolean;
  isBrowser: any;
  assetId: any;
  isVideoFollowed: boolean = false;
  DMS: any;
  userAssetDetails: any;
  viewCountObject: any = null;
  isLogin: boolean = false;
  ugcVideos: any[] = [];

  constructor(public activeModal: NgbActiveModal, public platformIdentifierService: PlatformIdentifierService, public appUtilService: AppUtilService, private snackbarUtilService: SnackbarUtilService, private kalturaAppService: KalturaAppService, public kalturaUtilService: KalturaUtilService, private route: ActivatedRoute, private meta: Meta,
    private modalMessageService: ModalMessageService, private router: Router, private modalService: NgbModal) {

    this.randomColor = this.appUtilService.getRandomGreyScaleColor();
    this.solidColor = {
      'background': this.randomColor,
      'text-align': 'center',
      'vertical-align': 'middle',
    };

  }

  ngOnInit() {
    this.modalMessageService.sendCommonMessage(true);
    this.ugcVideoChange.subscribe((res) => {
      this.ugcVideos = res;
      this.initializeComponent();
    })
    $(document).ready(() => {
      $(".modal-backdrop").css({ "opacity": "0.8", "background-color": "#858585" })
    })
  }


  initializeComponent() {
    // this.getVideoFollowing(true);
    if (this.platformIdentifierService.isBrowser()) {
      if (this.ugcVideos) {
        this.DMS = this.appUtilService.getDmsConfig();
        this.getCreatorDetails();
      }
    }
    try {
      if (this.ugcVideos[this.index].metas.startLikes) {
        this.startLikes = this.ugcVideos[this.index].metas.startLikes.value;
      }

    } catch (e) {

    }
    this.isLogin = this.appUtilService.isUserLoggedIn();
    this.getViewAndLikeCount(this.index);
  }


  getCreatorDetails() {
    var assetId = this.ugcVideos[this.index].tags.SeriesId.objects[0].value;
    this.kalturaAppService.getNoOfSeasonInSeries(assetId, this.DMS.params.MediaTypes.UGCCreator, true).then(response => {
      if (response.objects) {
        this.userAssetDetails = response.objects[0];
      }
    }, reject => {
      this.snackbarUtilService.showError(reject.message);
    });
  }
  openNextImage() {
    this.index = this.index + 1;
    if (this.ugcVideos.length > this.index + 2) {
      this.userAssetDetails = null;
      this.getViewAndLikeCount(this.index);
      this.getCreatorDetails();
    } else {
      if (this.fromRails) {
        this.userAssetDetails = null;
        this.getViewAndLikeCount(this.index);
        this.getCreatorDetails();
      } else {
        this.viewCountObject = null;
        this.getMoreVideos.emit(true);
      }

    }
  }

  openPrevImage() {
    this.index = this.index - 1;
    this.userAssetDetails = null;
    this.getCreatorDetails();
    this.getViewAndLikeCount(this.index);
  }


  getViewAndLikeCount(index: number) {
    this.viewCountObject = null;
    this.kalturaAppService.getAssetStatistics(this.ugcVideos[index].id, 0, 0).then(res2 => {
      if (res2.objects) {
        this.viewCountObject = res2.objects[0]
      }
    }, reject => {
      this.snackbarUtilService.showError();
    });
  }

  ngOnDestroy(): void {
    this.modalMessageService.sendCommonMessage(false);
  }

  gotoCreatorProfile(id: any) {
    if (id) {
      this.modalService.dismissAll();
      this.router.navigateByUrl("/watch/creator/profile/" + id);
      return;
    }
    this.snackbarUtilService.showSnackbar("User not found");
  }
}
