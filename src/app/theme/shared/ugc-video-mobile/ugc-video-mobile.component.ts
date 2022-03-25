import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppUtilService } from '../services/app-util.service';
import { PlatformIdentifierService } from '../services/platform-identifier.service';
import { KalturaAppService } from '../services/kaltura-app.service';
import { SnackbarUtilService } from '../services/snackbar-util.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LoginMessageService } from '../services/auth';
declare var $: any;
@Component({
  selector: 'app-ugc-video-mobile',
  templateUrl: './ugc-video-mobile.component.html',
  styleUrls: ['./ugc-video-mobile.component.scss']
})
export class UgcVideoMobileComponent implements OnInit {

  @Input() totalVideos: number;
  @Input() ugcVideosChangeEvent = new BehaviorSubject<any>(null);
  @Output() getMoreVideos: EventEmitter<any> = new EventEmitter();


  ugcVideos: any[] = [];
  index: number = 0;
  userAssetDetails: any;
  viewCountObject: any = null;
  DMS: any;
  isLogin: boolean;
  fromRoute: boolean = false;
  interval: any;
  isPWA: boolean = false;
  startLikes: number = 0;


  constructor(public appUtilService: AppUtilService, private activatedRoute: ActivatedRoute, private snackbarUtilService: SnackbarUtilService, private platformIdentifierService: PlatformIdentifierService, private kalturaAppService: KalturaAppService, private ugcPageVisidetService: LoginMessageService, private router: Router) { }

  ngOnInit() {

    if (this.appUtilService.checkIfPWA()) {
      this.isPWA = true;
    } else {
      this.isPWA = false;
    }
    this.ugcPageVisidetService.ugcPageEnteredMessage(true);
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      if (params.get('id')) {
        this.fromRoute = true;
        this.getAssetDetails(+params.get('id'))
      } else {
        this.fromRoute = false;
      }
    })
    this.ugcVideosChangeEvent.subscribe((res) => {
      if (res) {
        this.ugcVideos = res;
        console.log(this.ugcVideos)
        this.initializeComponent();
      };
    })

  }
  getAssetDetails(assetId: number) {
    this.kalturaAppService.getMediaAssetById(assetId.toString()).then((res) => {
      this.ugcVideos[0] = res;
      this.index = 0;
      this.initializeComponent();
    })
  }

  initializeComponent() {
    // this.getVideoFollowing(true);
    if (this.platformIdentifierService.isBrowser()) {
      this.interval = setInterval(() => {
        $(".icon-image").toggle();
        $(".home-icon").toggle();
      }, 5000)
      if (this.ugcVideos) {
        try {
          if (this.ugcVideos[this.index].metas.startLikes) {
            this.startLikes = this.ugcVideos[this.index].metas.startLikes.value;
          }

        } catch (e) {

        }
        this.DMS = this.appUtilService.getDmsConfig();
        this.getCreatorDetails();
      }
      $(document).ready(() => {
        $("body").addClass("no-scroll");
      })
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
      this.viewCountObject = null;
      this.getMoreVideos.emit(true);

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
        this.viewCountObject = res2.objects[0];
      }
    }, reject => {
      this.snackbarUtilService.showError();
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    $("body").removeClass("no-scroll");

    this.ugcPageVisidetService.ugcPageEnteredMessage(false);
    clearInterval(this.interval);
  }

  gotoCreatorProfile(id: any) {
    if (id) {
      this.router.navigateByUrl("/watch/creator/profile/" + id);
      return;
    }
    this.snackbarUtilService.showSnackbar("User not found");
  }

}
