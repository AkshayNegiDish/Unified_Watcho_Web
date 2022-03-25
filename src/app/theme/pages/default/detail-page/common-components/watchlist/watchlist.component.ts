import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignInSignUpModalComponent } from '../../../../../shared/entry-component/signIn-signUp-modal.component';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {

  @Input()
  assetDetails: any;

  @Input()
  videoId: number;

  @Output()
  isInWatchlist = new EventEmitter<any>()

  isUserLoggedIn: boolean = false;
  personalListAsset: any;
  personalListId: number;
  isAddedToWatchList: boolean = false;
  assetId: number;
  partnerListType: number = 1;
  loading: boolean = false;
  pageSize: number;
  pageIndex: number;

  constructor(private snackbarUtilService: SnackbarUtilService, private kalturaAppService: KalturaAppService, public kalturaUtilService: KalturaUtilService,
    private modalService: NgbModal, private appUtilService: AppUtilService) {
    this.pageIndex = 1;
    this.pageSize = 40;
  }

  ngOnInit() {
    this.assetId = this.videoId;
    this.getWatchlist();
  }

  getWatchlist() {
    if (this.appUtilService.isUserLoggedIn()) {
      this.kalturaAppService.getPersonalList(1, this.pageSize, this.pageIndex).then(res => {
        this.personalListAsset = res;
        if (this.personalListAsset.totalCount > 0) {
          this.personalListAsset.objects.forEach((element, index) => {
            let media_id = element.ksql.split('=')[1];
            media_id = media_id.substr(1, media_id.length - 2);
            if (this.assetId.toString() === media_id) {
              this.personalListId = element.id;
              this.isAddedToWatchList = true;
              this.isInWatchlist.emit(true);
            }
          })
        }

      }, reject => {
        console.error(reject);
        this.snackbarUtilService.showError(reject.message);
      })
    }

  }

  getPersonalListId(assetId): number {
    this.personalListAsset.objects.forEach((element, index) => {
      let media_id = element.ksql.split('=')[1];
      media_id = media_id.substr(1, media_id.length - 2);
      if (assetId === media_id) {
        this.personalListId = element.id;
      }
    });
    return this.personalListId;
  }


  toggleWatchlist() {
    if (this.appUtilService.isUserLoggedIn()) {
      if (this.isAddedToWatchList) {
        // item already available on watchlist call api to remove from watchlist
        this.removeFromWatchlist();
      } else {
        this.addToWatchlist();
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

  removeFromWatchlist() {
    this.getWatchlist();
    //  if (this.isAddedToWatchList) {
    // item already available on watchlist call api to remove from watchlist
    this.loading = true;
    this.personalListId = this.getPersonalListId(this.assetId);
    this.kalturaAppService.personalListDeleteAction(this.personalListId).then(response => {
      this.loading = false;
      this.RemoveWatchListSnakeBarMessage();
      // this.snackbarUtilService.showSnackbar('Video removed from Watchlist');
      this.isAddedToWatchList = false;
      this.getWatchlist();
      this.removeWatchlistMoEngageEvent(this.assetDetails.type);
    }, reject => {
      if (reject.message === "user is not following asset") {
        this.isAddedToWatchList = false;
      } else {
        this.loading = false;
        this.snackbarUtilService.showError(reject.message);
        this.removeWatchlistErrorMoEngageEvent(this.assetDetails.type);
      }
    });
    //  }
  }

  addToWatchlist() {
    this.getWatchlist();
    // item not in watchlist call api to add item to watchlist
    this.loading = true;
    let ksql = "media_id='" + this.assetId + "'";
    let name = "name='" + this.assetDetails.name + "'"

    this.kalturaAppService.personalListAddAction(name, ksql, this.partnerListType).then(res => {
      this.loading = false;
      this.AddWatchListSnakeBarMessage();
      //  this.snackbarUtilService.showSnackbar('Video added in your Watchlist');
      this.isAddedToWatchList = true;
      this.getWatchlist();
      this.addWatchlistMoEngageEvent(this.assetDetails.type);
    }, reject => {
      if (reject.message === "User already following") {
        this.isAddedToWatchList = true;
      } else {
        this.loading = false;
        this.snackbarUtilService.showError(reject.message);
        this.addWatchlistErrorMoEngageEvent(this.assetDetails.type);
      }
    })
  }

  AddWatchListSnakeBarMessage() {
    this.snackbarUtilService.showSnackbar('' + this.appUtilService.getUserFriendlyMediaTypeNameById(this.assetDetails.type) + ' added in your Watchlist');
  }

  RemoveWatchListSnakeBarMessage() {
    this.snackbarUtilService.showSnackbar('' + this.appUtilService.getUserFriendlyMediaTypeNameById(this.assetDetails.type) + ' removed from your Watchlist');
  }

  removeWatchlistMoEngageEvent(type: number) {
    let removeWatchlist: any;
    if (this.appUtilService.getMediaTypeNameById(type) === 'UGC Video') {
      removeWatchlist = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_creator_name: this.assetDetails.type !== 0 ? this.assetDetails.tags['Series Name'] ? this.assetDetails.tags['Series Name'].objects[0].value : null : this.assetDetails.metas['Series_Name'] ? this.assetDetails.metas['Series_Name'].value : null,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "removefromlist_video_page",
        status: "remove_successful"
      }
    } else if (this.appUtilService.getMediaTypeNameById(type) === 'Short Film' || this.appUtilService.getMediaTypeNameById(type) === 'Movie' || this.appUtilService.getMediaTypeNameById(type) === 'Spotlight Episode' || this.appUtilService.getMediaTypeNameById(type) === 'Web Episode') {
      removeWatchlist = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: this.assetDetails.type !== 0 ? this.assetDetails.tags['Series Name'] ? this.assetDetails.tags['Series Name'].objects[0].value : null : this.assetDetails.metas['Series_Name'] ? this.assetDetails.metas['Series_Name'].value : null,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "removefromlist_video_page",
        status: "remove_successful"
      }
    }
    this.appUtilService.moEngageEventTracking("REMOVE_FROM_WATCHLIST", removeWatchlist);
  }

  removeWatchlistErrorMoEngageEvent(type: number) {
    let removeWatchlistError: any;
    if (this.appUtilService.getMediaTypeNameById(type) === 'UGC Video') {
      removeWatchlistError = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_creator_name: this.assetDetails.type !== 0 ? this.assetDetails.tags['Series Name'] ? this.assetDetails.tags['Series Name'].objects[0].value : null : this.assetDetails.metas['Series_Name'] ? this.assetDetails.metas['Series_Name'].value : null,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "removefromlist_video_page",
        status: "remove_error"
      }
    } else if (this.appUtilService.getMediaTypeNameById(type) === 'Short Film' || this.appUtilService.getMediaTypeNameById(type) === 'Movie' || this.appUtilService.getMediaTypeNameById(type) === 'Spotlight Episode' || this.appUtilService.getMediaTypeNameById(type) === 'Web Episode') {
      removeWatchlistError = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: this.assetDetails.type !== 0 ? this.assetDetails.tags['Series Name'] ? this.assetDetails.tags['Series Name'].objects[0].value : null : this.assetDetails.metas['Series_Name'] ? this.assetDetails.metas['Series_Name'].value : null,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "removefromlist_video_page",
        status: "remove_error"
      }
    }
    this.appUtilService.moEngageEventTracking("REMOVE_FROM_WATCHLIST", removeWatchlistError);
  }

  addWatchlistMoEngageEvent(type: number) {
    let addWatchlist: any;
    if (this.appUtilService.getMediaTypeNameById(type) === 'UGC Video') {
      addWatchlist = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_creator_name: this.assetDetails.type !== 0 ? this.assetDetails.tags['Series Name'] ? this.assetDetails.tags['Series Name'].objects[0].value : null : this.assetDetails.metas['Series_Name'] ? this.assetDetails.metas['Series_Name'].value : null,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "addtolist_video_page",
        status: "add_successful"
      }
    } else if (this.appUtilService.getMediaTypeNameById(type) === 'Short Film' || this.appUtilService.getMediaTypeNameById(type) === 'Movie' || this.appUtilService.getMediaTypeNameById(type) === 'Spotlight Episode' || this.appUtilService.getMediaTypeNameById(type) === 'Web Episode') {
      addWatchlist = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: this.assetDetails.type !== 0 ? this.assetDetails.tags['Series Name'] ? this.assetDetails.tags['Series Name'].objects[0].value : null : this.assetDetails.metas['Series_Name'] ? this.assetDetails.metas['Series_Name'].value : null,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "addtolist_video_page",
        status: "add_successful"
      }
    }
    this.appUtilService.moEngageEventTracking("ADD_TO_WATCHLIST", addWatchlist);
  }

  addWatchlistErrorMoEngageEvent(type: number) {
    let addWatchlistError: any;
    if (this.appUtilService.getMediaTypeNameById(type) === 'UGC Video') {
      addWatchlistError = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_creator_name: this.assetDetails.type !== 0 ? this.assetDetails.tags['Series Name'] ? this.assetDetails.tags['Series Name'].objects[0].value : null : this.assetDetails.metas['Series_Name'] ? this.assetDetails.metas['Series_Name'].value : null,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "addtolist_video_page",
        status: "other_error"
      }
    } else if (this.appUtilService.getMediaTypeNameById(type) === 'Short Film' || this.appUtilService.getMediaTypeNameById(type) === 'Movie' || this.appUtilService.getMediaTypeNameById(type) === 'Spotlight Episode' || this.appUtilService.getMediaTypeNameById(type) === 'Web Episode') {
      addWatchlistError = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: this.assetDetails.type !== 0 ? this.assetDetails.tags['Series Name'] ? this.assetDetails.tags['Series Name'].objects[0].value : null : this.assetDetails.metas['Series_Name'] ? this.assetDetails.metas['Series_Name'].value : null,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "addtolist_video_page",
        status: "other_error"
      }
    }
    this.appUtilService.moEngageEventTracking("ADD_TO_WATCHLIST", addWatchlistError);
  }

}
