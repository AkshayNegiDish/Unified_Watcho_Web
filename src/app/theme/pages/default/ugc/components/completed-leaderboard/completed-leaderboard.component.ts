import { Component, OnInit } from '@angular/core';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { PlaceholderImage } from '../../../../../shared/typings/common-constants';
import { UgcFormService } from '../../services/ugc-form.service';
import { TimeSlab, LeaderboardArray, AllTimeLeaderboardModal } from '../../models/contest.model';
import { Router } from '@angular/router';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
declare var $: any

@Component({
  selector: 'app-completed-leaderboard',
  templateUrl: './completed-leaderboard.component.html',
  styleUrls: ['./completed-leaderboard.component.scss']
})

export class CompletedLeaderboardComponent implements OnInit {


  isPWA: boolean;
  noResultFoundImage = PlaceholderImage.NO_RESULT;
  leaderboardArray: LeaderboardArray;
  pageNo: number = 1;
  pageSize: number = 30;
  noResultFound: boolean = false;
  loading: boolean = true;
  placeholderImage = PlaceholderImage.NO_RESULT;
  totalVideos: any;
  TimeSlab = TimeSlab;
  userLeaderboardModal: AllTimeLeaderboardModal;
  showUserLeaderBoard: boolean = false
  dms: any;

  constructor(private ugcFormService: UgcFormService, private appUtilService: AppUtilService,
    private snackbarUtilService: SnackbarUtilService, private router: Router, private kalturaAppService: KalturaAppService) {

    this.leaderboardArray = {
      leaderboard: []
    }

    this.userLeaderboardModal = {
      assetId: null,
      bgColor: null,
      nameInitials: null,
      ottSubcriberId: null,
      rank: null,
      score: null,
      userName: null
    }

  }

  ngOnInit() {
    if (this.appUtilService.checkIfPWA()) {
      this.isPWA = true;
    } else {
      this.isPWA = false;
    }
    this.getAlltimeLeaderboard(TimeSlab[TimeSlab.MONTHLY]);
    if (this.appUtilService.isUserLoggedIn()) {
      this.getUserLeaderBoard(TimeSlab[TimeSlab.MONTHLY]);
    }

    this.dms = this.appUtilService.getDmsConfig()
    console.log(this.dms)
  }
  getAlltimeLeaderboard(timeSlab: string) {
    this.noResultFound = false;
    this.ugcFormService.getAlltimeLeaderBoard(timeSlab, this.pageNo, this.pageSize).subscribe((res: any) => {
      if (res.code === 0) {
        this.totalVideos = res.data.meta.total;
        if (res.data.meta.total > 0) {
          res.data.data.forEach((element) => {
            var allTimeLeaderboardModal = new AllTimeLeaderboardModal();
            allTimeLeaderboardModal.assetId = element.assetId;
            allTimeLeaderboardModal.ottSubcriberId = element.ottSubcriberId;
            allTimeLeaderboardModal.rank = element.rank;
            allTimeLeaderboardModal.score = element.score;
            allTimeLeaderboardModal.userName = element.userName;
            allTimeLeaderboardModal.nameInitials = this.appUtilService.getNameInitials(null, false, element.userName);
            allTimeLeaderboardModal.bgColor = {
              "background-color": this.appUtilService.getRandomGreyScaleColor()
            }
            this.leaderboardArray.leaderboard = [...this.leaderboardArray.leaderboard, allTimeLeaderboardModal]
          })
          this.loading = false;
          this.addClickOnOtherTabs(timeSlab);
          return;
        }
        this.addClickOnOtherTabs(timeSlab);
        this.noResultFound = true;
        this.loading = false;
        return;
      }
      this.addClickOnOtherTabs(timeSlab);
      this.noResultFound = true;
      this.loading = false;
      return;
    }, error => {
      this.addClickOnOtherTabs(timeSlab);
      this.noResultFound = true;
      this.loading = false;
    })
  }

  getUserLeaderBoard(timeSlab: string) {

    this.ugcFormService.getUserAlltimeLeaderBoard(timeSlab, JSON.parse(localStorage.getItem("user-sms")).OTTSubscriberID).subscribe((res: any) => {
      if (res.code === 0) {
        this.userLeaderboardModal.assetId = res.data.assetId;
        this.userLeaderboardModal.bgColor = {
          "background-color": this.appUtilService.getRandomGreyScaleColor()
        }
        this.userLeaderboardModal.nameInitials = this.appUtilService.getNameInitials(null, false, res.data.userName);
        this.userLeaderboardModal.ottSubcriberId = res.data.ottSubcriberId;
        this.userLeaderboardModal.rank = res.data.rank;
        this.userLeaderboardModal.userName = res.data.userName;
        this.userLeaderboardModal.score = res.data.score;
        this.showUserLeaderBoard = true;
      } else {
        this.showUserLeaderBoard = false;
      }
    }, error => {
      this.showUserLeaderBoard = false;
    })
  }

  handleImageError(event) {
    event.target.src = this.appUtilService.getDefaultThumbnail('LANDSCAPE')
  }

  getWeeklyLeaderboard() {
    this.restringClickOnTabs();
    this.getAlltimeLeaderboard(TimeSlab[TimeSlab.WEEKLY]);
    if (this.appUtilService.isUserLoggedIn()) {
      this.getUserLeaderBoard(TimeSlab[TimeSlab.WEEKLY]);
    }
  }

  getMonthlyLeaderBoard() {
    this.restringClickOnTabs();
    this.getAlltimeLeaderboard(TimeSlab[TimeSlab.MONTHLY]);
    if (this.appUtilService.isUserLoggedIn()) {
      this.getUserLeaderBoard(TimeSlab[TimeSlab.MONTHLY]);
    }
  }

  getAllTimeLeaderboard() {
    this.restringClickOnTabs();
    this.getAlltimeLeaderboard(TimeSlab[TimeSlab.LIFETIME]);
    if (this.appUtilService.isUserLoggedIn()) {
      this.getUserLeaderBoard(TimeSlab[TimeSlab.LIFETIME]);
    }
  }

  addClickOnOtherTabs(currentTab) {
    switch (currentTab) {
      case TimeSlab[TimeSlab.WEEKLY]: {
        $("#allTime-leaderBoard").css("pointer-events", "auto");
        $("#monthly-leaderBoard").css("pointer-events", "auto");
        break;
      };
      case TimeSlab[TimeSlab.MONTHLY]: {
        $("#allTime-leaderBoard").css("pointer-events", "auto");
        $("#weekly-leaderBoard").css("pointer-events", "auto");
        break;
      };
      case TimeSlab[TimeSlab.LIFETIME]: {
        $("#weekly-leaderBoard").css("pointer-events", "auto");
        $("#monthly-leaderBoard").css("pointer-events", "auto");
        break;
      }
    }
  }

  restringClickOnTabs() {
    this.loading = true;
    $("#allTime-leaderBoard").css("pointer-events", "none");
    $("#weekly-leaderBoard").css("pointer-events", "none");
    $("#monthly-leaderBoard").css("pointer-events", "none");
    this.leaderboardArray = {
      leaderboard: []
    }
    this.pageSize = 30;
    this.pageNo = 1;
    this.showUserLeaderBoard = false;
    this.userLeaderboardModal = {
      assetId: null,
      bgColor: null,
      nameInitials: null,
      ottSubcriberId: null,
      rank: null,
      score: null,
      userName: null
    }
  }

  getMoreVideos(timeSlot) {
    if (this.totalVideos > this.leaderboardArray.leaderboard.length) {
      this.pageNo = this.pageNo + 1;
      this.getAlltimeLeaderboard(timeSlot);
    }
  }

  goToCreatorPage(creatorId: any) {
    this.kalturaAppService.getAssetDetailBySeriesId("UGC_" + creatorId, this.dms.params.MediaTypes.UGCCreator).then((res) => {
      if (res.objects && res.objects.length > 0) {
        this.router.navigateByUrl('/watch/creator/profile/' + res.objects[0].id)
      } else {
        this.snackbarUtilService.showSnackbar("UGC creator details not available at the moment. Please try again later..")
      }
    }, error => {
      this.snackbarUtilService.showSnackbar("UGC creator details not available at the moment. Please try again later..")
    })
    // this.router.navigateByUrl('/watch/creator/profile/' + creatorId)
  }
}