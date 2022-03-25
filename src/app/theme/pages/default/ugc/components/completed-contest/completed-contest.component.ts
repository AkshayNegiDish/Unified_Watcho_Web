import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ContestModal, LeaderBoardArray, LeaderBoardModal, ContestStatus } from '../../models/contest.model';
import { UgcFormService } from '../../services/ugc-form.service';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { environment } from '../../../../../../../environments/environment';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { PlaceholderImage } from '../../../../../shared/typings/common-constants';
import { RailFilterType } from '../../models/ugc.upload.model';
declare var $: any

@Component({
  selector: 'app-completed-contest',
  templateUrl: './completed-contest.component.html',
  styleUrls: ['./completed-contest.component.scss']
})

export class CompletedContestComponent implements OnInit {


  contestModal: ContestModal;
  isPWA: boolean;
  firstRailData: any = null;
  secondRailData: any = null;
  thirdRailData: any = null;
  DMS: any;
  leaderBoardArray: LeaderBoardArray;
  pageNo: number = 1;
  pageSize: number = 30;
  userLeaderboardModal: LeaderBoardModal;
  totalItems: any;
  showUserLeaderBoard: boolean = false;
  contestId: string;
  noResultFound: boolean = false;
  PlaceholderImage = PlaceholderImage.NO_RESULT;
  loading: boolean;
  RailFilterType = RailFilterType;
  browserDetails: any;


  constructor(private ugcFormService: UgcFormService, private notificationService: NotificationService, private appUtilService: AppUtilService,
    private snackbarUtilService: SnackbarUtilService, private activatedRoute: ActivatedRoute, private kalturaAppService: KalturaAppService, private router: Router) {
    this.contestModal = {
      id: null,
      name: null,
      description: null,
      endDate: null,
      startDate: null,
      thumbnailUrl: null
    }
    this.leaderBoardArray = {
      leaderBoard: []
    }
    this.userLeaderboardModal = {
      assetId: null,
      rank: null,
      refId: null,
      score: null,
      videoThumbnailURI: null,
      videoTitle: null,
      winner: false
    }
    this.browserDetails = this.appUtilService.getBrowserDetails();
  }

  ngOnInit() {
    if (this.appUtilService.checkIfPWA()) {
      this.isPWA = true;
    } else {
      this.isPWA = false;
    }
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      if (params.get("id")) {
        this.contestId = params.get("id")
        this.getContest();
        this.getLeaderboardByContestid();
      }
    })
    this.DMS = this.appUtilService.getDmsConfig();
  }
  getContest() {
    this.restringClickOnTabs();
    this.noResultFound = false;
    this.loading = true;
    this.ugcFormService.getContestById(+this.contestId).subscribe((res: any) => {
      if (res.code === 0) {
        this.contestModal.id = res.data.id;
        this.contestModal.name = res.data.title;
        this.contestModal.description = res.data.description;
        this.contestModal.thumbnailUrl = environment.IMAGES_CLOUDFRONT_URL + "/contest/" + res.data.landscapeImage;
        this.contestModal.startDate = res.data.startDate;
        this.contestModal.endDate = res.data.endDate;
        if (res.data.showRailOne) {
          this.getRailOne();
        }
        if (res.data.showRailTwo) {
          this.getRailTwo();
        }
        if (res.data.showRailThree) {
          this.getRailThree();
        }
        this.loading = false;
        $("#Leaderboard-live").css("pointer-events", "auto");
        return;
      }
      this.loading = false;
      this.noResultFound = true;
      $("#Leaderboard-live").css("pointer-events", "auto");
    }, error => {
      this.loading = false;
      this.noResultFound = true;
      this.snackbarUtilService.showError();
      $("#Leaderboard-live").css("pointer-events", "auto");
    })
  }

  handleImageError(event) {
    event.target.src = this.appUtilService.getDefaultThumbnail('LANDSCAPE')
  }

  getRailOne() {
    this.kalturaAppService.getRailByContestId(this.contestModal.id.toString(), this.DMS.params.MediaTypes.UGCVideo, 1, 20, RailFilterType[RailFilterType.CREATE_DATE_DESC]).then((res: any) => {
      if (res.totalCount > 0) {
        this.firstRailData = res
      }
    })
  }

  getRailTwo() {
    this.kalturaAppService.getRailByContestId(this.contestModal.id.toString(), this.DMS.params.MediaTypes.UGCVideo, 1, 20, RailFilterType[RailFilterType.VIEWS_DESC]).then((res: any) => {
      if (res.totalCount > 0) {
        this.secondRailData = res
      }
    })
  }

  getRailThree() {
    this.kalturaAppService.getRailByContestId(this.contestModal.id.toString(), this.DMS.params.MediaTypes.UGCVideo, 1, 20, RailFilterType[RailFilterType.LIKES_DESC]).then((res: any) => {
      if (res.totalCount > 0) {
        this.thirdRailData = res
      }
    })
  }

  getLeaderboardByContestid(disableRestrictions?: boolean) {
    if (!disableRestrictions) {
      this.restringClickOnTabs();
      if (this.appUtilService.isUserLoggedIn()) {
        this.getOunLeaderBoard()
      }
    }
    this.noResultFound = false;
    let supportWebpCluodFrontUrl: string = this.browserDetails.browser !== "Safari" ? environment.WEBP_JPEG_CLOUDFRONT_URL + environment.WEBP_CLOUDFRONT_URL : environment.WEBP_JPEG_CLOUDFRONT_URL + environment.JPEG_CLOUDFRONT_URL;
    this.ugcFormService.getLeaderNoardByContestId(+this.contestId, this.pageNo, this.pageSize).subscribe((res: any) => {
      if (res.code === 0) {
        this.totalItems = res.data.meta.total;
        if (res.data.data.length > 0) {
          res.data.data.forEach((element: LeaderBoardModal) => {
            var leaderBoard = new LeaderBoardModal();
            leaderBoard.assetId = element.assetId;
            leaderBoard.rank = element.rank;
            leaderBoard.refId = element.refId;
            leaderBoard.score = element.score;
            leaderBoard.videoThumbnailURI = environment.IMAGES_CLOUDFRONT_URL + "/images/" + element.videoThumbnailURI;
            leaderBoard.videoTitle = element.videoTitle;
            leaderBoard.winner = element.winner;
            this.leaderBoardArray.leaderBoard = [...this.leaderBoardArray.leaderBoard, leaderBoard];
          })
          $("#Entries-videos").css("pointer-events", "auto");
          return;
        }
        this.noResultFound = true;
        $("#Entries-videos").css("pointer-events", "auto");
        return;
      }
      this.noResultFound = true;
      $("#Entries-videos").css("pointer-events", "auto");
      this.snackbarUtilService.showSnackbar(res.message);
    }, error => {
      this.noResultFound = true;
      this.snackbarUtilService.showError();
      $("#Entries-videos").css("pointer-events", "auto");
    })
  }

  restringClickOnTabs() {
    $("#Entries-videos").css("pointer-events", "none");
    $("#Leaderboard-live").css("pointer-events", "none");
    this.leaderBoardArray = {
      leaderBoard: []
    }
    this.pageSize = 30;
    this.pageNo = 1;
  }

  getMoreLeaderBoard(disableRestrictions: boolean) {
    if (this.totalItems > this.leaderBoardArray.leaderBoard.length) {
      this.pageNo = this.pageNo + 1;
      this.getLeaderboardByContestid(disableRestrictions);
    }
  }

  getOunLeaderBoard() {
    let supportWebpCluodFrontUrl: string = this.browserDetails.browser !== "Safari" ? environment.WEBP_JPEG_CLOUDFRONT_URL + environment.WEBP_CLOUDFRONT_URL : environment.WEBP_JPEG_CLOUDFRONT_URL + environment.JPEG_CLOUDFRONT_URL;
    this.ugcFormService.getUserLeaderBoardByContestId(+this.contestId, JSON.parse(localStorage.getItem("user-sms")).OTTSubscriberID).subscribe((res: any) => {
      if (res.code === 0) {
        this.userLeaderboardModal = res.data;
        this.userLeaderboardModal.videoThumbnailURI = environment.IMAGES_CLOUDFRONT_URL + "/images/" + res.data.videoThumbnailURI;
        this.showUserLeaderBoard = true;
      } else {
        this.showUserLeaderBoard = false;
      }
    }, error => {
      this.showUserLeaderBoard = false;
    })
  }

  openVideoDetails(mediaId: any, name: string) {
    this.router.navigate(['/watch/ugcVideo/details/' + this.appUtilService.getSEOFriendlyURL(name) + '/' + mediaId])
  }
}