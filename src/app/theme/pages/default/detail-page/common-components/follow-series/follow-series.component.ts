import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignInSignUpModalComponent } from '../../../../../shared/entry-component/signIn-signUp-modal.component';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';

@Component({
  selector: 'app-follow-series',
  templateUrl: './follow-series.component.html',
  styleUrls: ['./follow-series.component.scss']
})
export class FollowSeriesComponent implements OnInit {
  @Input()
  assetDetails: any;

  loading: boolean;
  kalturaPersonalListListResponse: any;
  kalturaFollowTvSeriesListResponse: any;
  kalturaAssetListResponse: any;
  kalturaAssetListResponseCreator: any;
  typeIn: string;
  isSeriesFollowed: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId, private kalturaAppService: KalturaAppService, private snackbarUtilService: SnackbarUtilService,
    private appUtilService: AppUtilService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.getSeriesFollowing(true);
  }

  getSeriesFollowing(onLoad?: boolean) {
    if (this.appUtilService.isUserLoggedIn()) {
      this.loading = true;
      this.kalturaAppService.getFollowedSeries().then(res => {

        this.loading = false;
        this.kalturaAssetListResponse = null;
        if (res.totalCount > 0) {
          let assetIds: string = '';

          res.objects.forEach((element, index) => {
            if (element.assetId === this.assetDetails.id) {
              this.isSeriesFollowed = true;
            }
          });

          // if(!onLoad) {
          //   if(this.isSeriesFollowed) {
          //     this.unfollowTvSeries(this.assetDetails.id);
          //   } else {
          //     this.followTvSeries(this.assetDetails.id);
          //   }
          // }
        }
      }, reject => {
        this.loading = false;
        this.snackbarUtilService.showError(reject.message);
      });
    }
  }

  unfollowTvSeries(assetId: number) {
    this.getSeriesFollowing();
    this.loading = true;
    this.kalturaAppService.unfollowTvSeries(assetId).then(response => {
      this.loading = false;
      this.snackbarUtilService.showSnackbar('You have unfollowed series successfully');
      this.isSeriesFollowed = false;
      this.getSeriesFollowing(true);
      this.unfollowMoEngageEvent(this.assetDetails.id, this.assetDetails.name, this.assetDetails.tags.Genre.objects[0].value, this.assetDetails.type, this.assetDetails.tags['Parental Rating'].objects[0].value);
    }, reject => {
      this.loading = false;
      if (reject.message === 'user is not following asset') {
        this.isSeriesFollowed = false;
      }
      this.snackbarUtilService.showError(reject.message);
      this.unfollowErrorMoEngageEvent(this.assetDetails.id, this.assetDetails.name, this.assetDetails.tags.Genre.objects[0].value, this.assetDetails.type, this.assetDetails.tags['Parental Rating'].objects[0].value);
    });
  }

  followTvSeries(assetId: number) {
    this.getSeriesFollowing();
    this.loading = true;
    this.kalturaAppService.followTvSeries(assetId).then(res => {
      this.loading = false;
      this.snackbarUtilService.showSnackbar('You have followed series successfully');
      this.isSeriesFollowed = true;
      this.getSeriesFollowing(true);
      this.followingMoEngageEvent(this.assetDetails.id, this.assetDetails.name, this.assetDetails.tags.Genre.objects[0].value, this.assetDetails.type, this.assetDetails.tags['Parental Rating'].objects[0].value);
    }, reject => {
      this.loading = false;
      if (reject.message === 'User already following') {
        this.isSeriesFollowed = true;
      } else
        this.snackbarUtilService.showError(reject.message);
      this.followingErrorMoEngageEvent(this.assetDetails.id, this.assetDetails.name, this.assetDetails.tags.Genre.objects[0].value, this.assetDetails.type, this.assetDetails.tags['Parental Rating'].objects[0].value);
    });

  }

  toggleSeriesFollowing() {
    if (this.appUtilService.isUserLoggedIn()) {
      if (this.isSeriesFollowed) {
        // series is follow by user add logic to unfollow
        this.unfollowTvSeries(this.assetDetails.id);
      } else {
        //TODO: logic for follow series
        this.followTvSeries(this.assetDetails.id);
      }
      // this.getSeriesFollowing(false);
    }
    else {
      const modalRef = this.modalService.open(SignInSignUpModalComponent);
      this.appUtilService.pausePlayer();
      modalRef.result.then((data) => {
        this.appUtilService.playPlayer();
      }, (reason) => {
        this.appUtilService.playPlayer();
      });
    }
  }

  unfollowMoEngageEvent(id: number, title: string, genre: string, type: number, parental_rating: string) {
    let unfollow = {
      asset_ID: id,
      asset_title: title,
      asset_genre: genre,
      asset_mediatype: type,
      asset_parental_rating: parental_rating,
      source: "unfollow_series_page",
      status: "unfollow_successful"
    }
    this.appUtilService.moEngageEventTracking("UNFOLLOW", unfollow);
  }

  unfollowErrorMoEngageEvent(id: number, title: string, genre: string, type: number, parental_rating: string) {
    let unfollow = {
      asset_ID: id,
      asset_title: title,
      asset_genre: genre,
      asset_mediatype: type,
      asset_parental_rating: parental_rating,
      source: "unfollow_series_page",
      status: "unfollow_error"
    }
    this.appUtilService.moEngageEventTracking("UNFOLLOW", unfollow);
  }

  followingMoEngageEvent(id: number, title: string, genre: string, type: number, parental_rating: string) {
    let following = {
      asset_ID: id,
      asset_title: title,
      asset_genre: genre,
      asset_mediatype: type,
      asset_parental_rating: parental_rating,
      source: "follow_series_page",
      status: "follow_successful"
    }
    this.appUtilService.moEngageEventTracking("FOLLOW", following);
  }

  followingErrorMoEngageEvent(id: number, title: string, genre: string, type: number, parental_rating: string) {
    let following = {
      asset_ID: id,
      asset_title: title,
      asset_genre: genre,
      asset_mediatype: type,
      asset_parental_rating: parental_rating,
      source: "follow_series_page",
      status: "other_error"
    }
    this.appUtilService.moEngageEventTracking("FOLLOW", following);
  }

}
