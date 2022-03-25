import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignInSignUpModalComponent } from '../../../../../shared/entry-component/signIn-signUp-modal.component';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';

@Component({
  selector: 'app-follow-creator',
  templateUrl: './follow-creator.component.html',
  styleUrls: ['./follow-creator.component.scss']
})
export class FollowCreatorComponent implements OnInit {

  @Input()
  assetDetails: any;

  @Input()
  hideFollowButton?: boolean = false;

  loading: boolean;
  isBrowser: any;
  personalListAsset: any;
  kalturaAssetListResponse: any;
  kalturaAssetListResponseCreator: any;
  isCreatorFollowed: boolean = false;
  personalListId: number;
  partnerListType: number = 2;
  pageSize: number;
  pageIndex: number;

  typeIn: string;

  constructor(private kalturaAppService: KalturaAppService,
    private snackbarUtilService: SnackbarUtilService,
    private appUtilService: AppUtilService,
    private modalService: NgbModal) {
    this.pageIndex = 1;
    this.pageSize = 40;
  }

  ngOnInit() {

    this.getCreatorsFollowing();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes) {
      this.isCreatorFollowed = false;
      this.assetDetails = changes.assetDetails.currentValue;
      this.getCreatorsFollowing();
    }

  }

  getCreatorsFollowing() {
    if (this.appUtilService.isUserLoggedIn()) {
      this.loading = true;
      this.kalturaAppService.getPersonalList(2, this.pageSize, this.pageIndex).then(res => {
        this.loading = false;
        this.kalturaAssetListResponseCreator = null;
        this.personalListAsset = res;
        if (res.totalCount > 0) {
          let assetIds: string = '';
          res.objects.forEach((element, index) => {
            let media_id = element.ksql.split('=')[1];
            media_id = media_id.substr(1, media_id.length - 2);
            let meedia_id = +media_id;
            if (this.assetDetails !== undefined) {
              if (this.assetDetails.id === meedia_id) {
                this.personalListId = element.id;
                this.isCreatorFollowed = true;
              }
            } else {
              if (meedia_id) {
                this.personalListId = element.id;
                this.isCreatorFollowed = true;
              }
            }
          });
        }
      }, reject => {
        this.loading = false;
        this.snackbarUtilService.showError(reject.message);
      });
    }
  }

  toggleFollowing() {
    if (this.appUtilService.isUserLoggedIn()) {
      if (this.isCreatorFollowed) {
        this.unfollowCreator(this.personalListId, this.assetDetails.name);
      } else {
        //follow creator logic
        this.followCreator();
      }
    } else {
      const modalRef = this.modalService.open(SignInSignUpModalComponent);
      this.appUtilService.pausePlayer();
      modalRef.result.then((data) => {
        this.appUtilService.playPlayer();
      }, (reason) => {
        this.appUtilService.playPlayer();
      });
    }
  }

  unfollowCreator(personalListId, name) {
    this.loading = true;
    this.getCreatorsFollowing();
    this.kalturaAppService.personalListDeleteAction(personalListId).then(response => {
      this.loading = false;
      this.snackbarUtilService.showSnackbar('You have unfollowed ' + this.appUtilService.getTitleCase(name) + ' successfully.');
      this.getCreatorsFollowing();
      this.unfollowMoEngageEvent(this.assetDetails.id, this.assetDetails.name, this.assetDetails.type);
      this.isCreatorFollowed = false;
    }, reject => {
      this.loading = false;
      if (reject.message === "User not following") {
        this.isCreatorFollowed = false;
      } else {
        this.snackbarUtilService.showError(reject.message);
        this.unfollowMoEngageEventWithError(this.assetDetails.id, this.assetDetails.name, this.assetDetails.type);
      }
    });
  }

  followCreator() {
    this.getCreatorsFollowing();
    // item not in watchlist call api to add item to watchlist
    this.loading = true;
    let ksql = "media_id='" + this.assetDetails.id + "'";
    let name = "name='" + this.assetDetails.name + "'"
    this.isCreatorFollowed = true;
    this.kalturaAppService.personalListAddAction(name, ksql, this.partnerListType).then(res => {
      this.loading = false;
      this.snackbarUtilService.showSnackbar('You have followed ' + this.appUtilService.getTitleCase(this.assetDetails.name) + ' successfully');
      this.getCreatorsFollowing();
      this.followingMoEngageEvent(this.assetDetails.id, this.assetDetails.name, this.assetDetails.type);
    }, reject => {
      if (reject.message === "User already following") {
        this.isCreatorFollowed = true;
      } else if (reject.message === "User not following") {
        this.isCreatorFollowed = true;
      } else {
        this.loading = false;
        this.snackbarUtilService.showError(reject.message);
        this.followingMoEngageEventWithError(this.assetDetails.id, this.assetDetails.name, this.assetDetails.type);
      }
    })

  }

  unfollowMoEngageEvent(id: number, title: string, type: number) {
    let unfollow = {
      asset_ID: id,
      asset_title: title,
      asset_mediatype: type,
      source: "unfollow_series_page",
      status: "unfollow_successful"
    }
    this.appUtilService.moEngageEventTracking("UNFOLLOW", unfollow);
  }

  unfollowMoEngageEventWithError(id: number, title: string, type: number) {
    let unfollowWithError = {
      asset_ID: id,
      asset_title: title,
      asset_mediatype: type,
      source: "unfollow_series_page",
      status: "unfollow_error"
    }
    this.appUtilService.moEngageEventTracking("UNFOLLOW", unfollowWithError);
  }

  followingMoEngageEvent(id: number, title: string, type: number) {
    let following = {
      asset_ID: id,
      asset_title: title,
      asset_mediatype: type,
      source: "follow_series_page",
      status: "follow_successful"
    }
    this.appUtilService.moEngageEventTracking("FOLLOW", following);
  }

  followingMoEngageEventWithError(id: number, title: string, type: number) {
    let followingWithError = {
      asset_ID: id,
      asset_title: title,
      asset_mediatype: type,
      source: "follow_series_page",
      status: "other_error"
    }
    this.appUtilService.moEngageEventTracking("FOLLOW", followingWithError);
  }
}
