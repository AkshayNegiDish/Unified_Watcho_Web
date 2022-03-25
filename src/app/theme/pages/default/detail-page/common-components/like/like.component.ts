import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { SignInSignUpModalComponent } from '../../../../../shared/entry-component/signIn-signUp-modal.component';

declare var $;
@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.scss']
})
export class LikeComponent implements OnInit {


  @Input()
  assetDetails: any;

  isLiked: boolean = false;
  loading: boolean = false;
  likeCount: number = 0;
  assetSocialActionId: any;
  likeCountValue: string;

  constructor(private snackbarUtilService: SnackbarUtilService, private kalturaAppService: KalturaAppService, public kalturaUtilService: KalturaUtilService,
    private platformIdentifierService: PlatformIdentifierService, private appUtilService: AppUtilService, private modalService: NgbModal) {
    this.isLiked = false;
  }

  ngOnInit() {
    this.getAssetLike();
    this.isAssetLikedByUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes) {
      this.isLiked = false;
      this.loading = false;
      this.assetDetails = changes.assetDetails.currentValue;
      this.getAssetLike();
      this.isAssetLikedByUser();

    }
  }

  getAssetLike() {
    this.kalturaAppService.getAssetStatistics(this.assetDetails.id, null, null).then((res: any) => {
      if (res && res.objects && res.objects.length > 0) {
        if (this.assetDetails.metas.startLikes) {
          if (this.assetDetails.metas.startLikes.value) {
            this.likeCount = res.objects[0].likes + this.assetDetails.metas.startLikes.value;
            return;
          }
          this.likeCount = res.objects[0].likes;
          return;
        }
        this.likeCount = res.objects[0].likes;
        // this.likeCount = 999999;
      } else {
        this.snackbarUtilService.showError();
      }
    }).catch((err: any) => {
      console.error(err);
      this.snackbarUtilService.showError();
    });
  }

  isAssetLikedByUser() {
    this.kalturaAppService.getIsAssetLikedByUser(this.assetDetails.id, "LIKE").then((res: any) => {

      if (res && res.objects && res.objects.length > 0) {
        if (res.objects[0].actionType === "LIKE") {
          this.isLiked = true;
          this.assetSocialActionId = res.objects[0].id;
        } else {
          this.isLiked = false;
        }
      }

    }).catch((err: any) => {
      console.error(err);
      this.snackbarUtilService.showError();
    });
  }

  likeAsset() {
    this.kalturaAppService.socialActionAddByUser(this.assetDetails.id, "LIKE").then((res: any) => {
      if (res && res.socialAction) {
        this.isLiked = true;
        this.likeCount += 1;
        this.assetSocialActionId = res.socialAction.id;
        this.snackbarUtilService.like();
      }

    }).catch((err: any) => {
      console.error(err);
      this.snackbarUtilService.showError();
    });
  }

  disLikeAsset() {
    this.kalturaAppService.socialActionDeleteByUser(this.assetSocialActionId).then((res: any) => {
      if (this.assetSocialActionId) {
        this.likeCount -= 1;
        this.isLiked = false;
        this.snackbarUtilService.unlike();
      }

    }).catch((err: any) => {
      console.error(err);
      this.snackbarUtilService.showError();
    });
  }

  toggleLike() {
    $(".heart-icon").css("pointer-events", "none");
    if (this.appUtilService.isUserLoggedIn()) {
      if (this.isLiked) {
        if (this.likeCount > 0) {
          this.disLikeAsset();
        }
      } else {
        this.likeAsset();
      }
      // if(this.isLiked === false){
      //   this.likeAsset();
      // }
    } else {
      this.modalService.open(SignInSignUpModalComponent);
    }
    setTimeout(() => {
      $(".heart-icon").css("pointer-events", "auto")
    }, 1000);
  }


}
