import { Component, OnInit, Input } from '@angular/core';
import { LayoutConfig } from '../typings/enveu-responce-typing';
import { ImageSource, HeroLandingPage, PreDefinedLandingTarget } from '../typings/enveu-constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AppUtilService } from '../services/app-util.service';
import { SnackbarUtilService } from '../services/snackbar-util.service';
import { SignInSignUpModalComponent } from '../entry-component/signIn-signUp-modal.component';
import { KalturaAppService } from '../services/kaltura-app.service';
import { KalturaUtilService } from '../services/kaltura-util.service';
import { AppConstants } from '../typings/common-constants';
import { PlatformIdentifierService } from '../services/platform-identifier.service';
import { UgcFormService } from '../../pages/default/ugc/services/ugc-form.service';
import { ContestStatus, ContestType } from '../../pages/default/ugc/models/contest.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {

  @Input()
  channelDetails: LayoutConfig;

  thumbnailUrl: string;
  assetDetail: any;
  DMS: any;
  isMobileTabletView: any;
  isTabletView: any;
  channelName: any;
  channelId: any;
  isMobileView: boolean;
  url: any;
  PreDefinedLandingTarget = PreDefinedLandingTarget;
  browserDetails: any;

  constructor(private kalturaAppService: KalturaAppService, private kalturaUtilService: KalturaUtilService, private modalService: NgbModal, private router: Router, public appUtilService: AppUtilService, private snackbarService: SnackbarUtilService, private platformIdentifierService: PlatformIdentifierService, private ugcFormService: UgcFormService) {
    this.browserDetails = this.appUtilService.getBrowserDetails();
  }

  ngOnInit() {
    this.getHeroDetails()

    if (matchMedia('(max-width: 768px)').matches) {
      this.isMobileView = true;
    }
    this.openHeroDetails("default")
  }
  getHeroDetails() {
    if (this.channelDetails.imageSource === ImageSource[ImageSource.MNL]) {
      let supportWebpCluodFrontUrl: string = this.browserDetails.browser !== "Safari" ? environment.WEBP_JPEG_CLOUDFRONT_URL + environment.WEBP_CLOUDFRONT_URL : environment.WEBP_JPEG_CLOUDFRONT_URL + environment.JPEG_CLOUDFRONT_URL;
      this.thumbnailUrl = supportWebpCluodFrontUrl + this.channelDetails.thumbnailUrl;
    } else {
      this.openHeroDetails("default");
    }
  }

  openHeroDetails(hitType?: string) {
    if (hitType === "default") {
      switch (this.channelDetails.landingPage.type) {
        case HeroLandingPage[HeroLandingPage.DEF]: {
          if (this.channelDetails.isProgram) {
            this.getMediaAssetDetails(this.channelDetails.heroAssetId);
          } else {
            this.getAssetDetails(this.channelDetails.heroAssetId, this.channelDetails.assetType);
          }
          break;
        }
        case HeroLandingPage[HeroLandingPage.PDF]: {
          if (this.channelDetails.isProgram) {
            this.getMediaAssetDetails(this.channelDetails.heroAssetId);
          } else {
            this.getAssetDetails(this.channelDetails.heroAssetId, this.channelDetails.assetType);
          }
          break;
        }
        case HeroLandingPage[HeroLandingPage.HTM]: {
          if (this.channelDetails.isProgram) {
            this.getMediaAssetDetails(this.channelDetails.heroAssetId);
          } else {
            this.getAssetDetails(this.channelDetails.heroAssetId, this.channelDetails.assetType);
          }
          break;
        }
        case HeroLandingPage[HeroLandingPage.AST]: {
          if (this.channelDetails.landingPage.isProgram) {
            this.getMediaAssetDetails(this.channelDetails.landingPage.assetId);
          } else {
            this.getAssetDetails(this.channelDetails.landingPage.assetId, this.channelDetails.landingPage.assetType)
          }
          break;
        }
        case HeroLandingPage[HeroLandingPage.PLT]: {
          if (this.channelDetails.isProgram) {
            this.getMediaAssetDetails(this.channelDetails.heroAssetId);
          } else {
            this.getAssetDetails(this.channelDetails.heroAssetId, this.channelDetails.landingPage.assetType)
          }
        }
      }
    } else {
      switch (this.channelDetails.landingPage.type) {
        case HeroLandingPage[HeroLandingPage.HTM]:
          window.open(this.channelDetails.landingPage.link, "_blank");
          break;
        case HeroLandingPage[HeroLandingPage.DEF]:
          this.goToAsset();
          break;
        case HeroLandingPage[HeroLandingPage.AST]:
          this.goToAsset();
          break;
        case HeroLandingPage[HeroLandingPage.PDF]:
          switch (this.channelDetails.landingPage.target) {
            case PreDefinedLandingTarget[PreDefinedLandingTarget.LGN]:
              this.modalService.open(SignInSignUpModalComponent);
              break;

            case PreDefinedLandingTarget[PreDefinedLandingTarget.SRH]:
              this.router.navigate(["search"], { queryParams: { q: '' } })
              break;
            case PreDefinedLandingTarget[PreDefinedLandingTarget.IFP]:
              if (this.appUtilService.isUserLoggedIn()) {
                this.router.navigate(['/ugc/my-uploads/ifp']);
              } else {
                this.modalService.open(SignInSignUpModalComponent);
              }
              break;
            case PreDefinedLandingTarget[PreDefinedLandingTarget.QUZ]:
              if (this.appUtilService.isUserLoggedIn()) {
                this.router.navigate(['user/quiz']);
              } else {
                this.modalService.open(SignInSignUpModalComponent);
              }
              break;
            case PreDefinedLandingTarget[PreDefinedLandingTarget.CDT]:
              this.getContestTypeAndRoute();
              break;
            case PreDefinedLandingTarget[PreDefinedLandingTarget.CLT]:
              this.router.navigate(["/ugc/my-contest"]);
              break;
            case PreDefinedLandingTarget[PreDefinedLandingTarget.RCG]:
              if (this.appUtilService.isUserLoggedIn()) {
                if (this.platformIdentifierService) {
                  const user_category = Number(localStorage.getItem(AppConstants.USER_CATEGORY));
                  if (user_category === 3) {
                    this.router.navigateByUrl('/user/membershipandplans');
                  } else {
                    this.router.navigateByUrl('/user/rechargedetail');
                  }
                }
              } else {
                this.router.navigateByUrl('/user/membershipandplans');
              }
              break;
          }
          break;
        case HeroLandingPage[HeroLandingPage.PLT]:
          this.router.navigate(['/list/' + this.appUtilService.getSEOFriendlyURL(this.channelDetails.landingPage.playlist.playlistName) + "/k-" + this.channelDetails.landingPage.playlist.kalturaChannelId + "_0"], { queryParams: { "name": this.channelDetails.landingPage.playlist.playlistName, "viewType": this.channelDetails.imageType, "listingLayout": "GRD" } });
          break;
        default:
      }
    }

  }

  getContestTypeAndRoute() {
    this.ugcFormService.getContestById(+this.channelDetails.landingPage.assetId).subscribe((res: any) => {
      if (res.code === 0 && res.data) {
        if (res.data.status == ContestStatus[ContestStatus.PUBLISHED]) {
          if (res.data.state === ContestType[ContestType.COMPLETED]) {
            this.router.navigate(["/ugc/completed-contest"], { queryParams: { "id": res.data.id } });
            return;
          } else if (res.data.state === ContestType[ContestType.LIVE]) {
            this.router.navigate(["/ugc/live-contest"], { queryParams: { "id": res.data.id } });
            return;
          } else if (res.data.state === ContestType[ContestType.UPCOMING]) {
            this.router.navigate(["/ugc/upcoming-contest"], { queryParams: { "id": res.data.id } });
            return;
          } else {
            this.router.navigate(["/ugc/my-contest"]);
            return;
          }
        } else {
          this.router.navigate(["/ugc/my-contest"]);
          return;
        }
      }
      this.router.navigate(["/ugc/my-contest"]);
    }, error => {
      this.snackbarService.showSnackbar("Contest Not Available")
    })
  }

  getAssetDetails(mediaId, type) {
    this.kalturaAppService.getMediaAssetById(mediaId).then((res: any) => {
      var assetDetail = res;
      if (this.channelDetails.imageSource !== ImageSource[ImageSource.MNL]) {
        this.thumbnailUrl = assetDetail.images ? assetDetail.images.length > 0 ? this.kalturaUtilService.getImageByOrientation(assetDetail.images, this.channelDetails.imageType, null, null, null, null) : null : null;
      }
      this.appUtilService.getAssetRouteUrl(assetDetail.name, assetDetail.id, this.channelName, this.channelId, assetDetail.type, assetDetail.externalIds, assetDetail.startDate, assetDetail.linearAssetId).subscribe((res: any) => {
        if (res.url) {
          this.url = res.url
        }
      });
    }, reject => {
      console.error(reject)
    })
  }
  goToAsset() {
    this.router.navigateByUrl(this.url);
  }

  getMediaAssetDetails(programId: string) {
    this.kalturaAppService.getMediaAssetById(programId, "epg_internal").then(response => {
      var assetDetail = response;
      if (this.channelDetails.imageSource !== ImageSource[ImageSource.MNL]) {
        this.thumbnailUrl = assetDetail.images ? assetDetail.images.length > 0 ? this.kalturaUtilService.getImageByOrientation(assetDetail.images, this.channelDetails.imageType, null, null, null, null) : null : null;
      }
      this.appUtilService.getAssetRouteUrl(assetDetail.name, assetDetail.id, this.channelName, this.channelId, assetDetail.type, assetDetail.externalIds, assetDetail.startDate, assetDetail.linearAssetId).subscribe((res: any) => {
        if (res.url) {
          this.url = res.url
        }
      });
    }, reject => {
      // console.error(reject);
    })
  }

}
