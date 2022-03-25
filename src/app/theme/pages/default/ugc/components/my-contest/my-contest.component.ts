import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { Router } from '@angular/router';
import { PlaceholderImage } from '../../../../../shared/typings/common-constants';
import { UgcFormService } from '../../services/ugc-form.service';
import { ContestType, ContestModal, ContestArray, NotificationDetails } from '../../models/contest.model';
import { environment } from '../../../../../../../environments/environment';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { ViewPortService } from '../../../../../shared/services/view.port.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';
declare var $: any
declare var Notification: any;

@Component({
  selector: 'app-my-contest',
  templateUrl: './my-contest.component.html',
  styleUrls: ['./my-contest.component.scss']
})
export class MyContestComponent implements OnInit {
  isPWA: boolean = false;
  placeholderImage: string;
  pageNo: number = 1;
  pageSize: number = 10;
  ContestType = ContestType;
  contestArray: ContestArray
  totalObjects: number = null;
  notifications: any[] = [];
  reminders: any = {};
  noResultFound: boolean = false;
  noResultImage = PlaceholderImage.NO_RESULT;
  loading: boolean = true;

  @ViewChild('downloadtheAppModal')
  downloadInAppModalRef: ElementRef;
  downloadInAppModalResultRef: Promise<any>;
  isBrowser: any;
  browserDetails: any;

  constructor(@Inject(PLATFORM_ID) private platformId, private ugcFormService: UgcFormService, private appUtilService: AppUtilService,
    private snackbarUtilService: SnackbarUtilService, private platformIdentifierService: PlatformIdentifierService,
    private router: Router, private notificationService: NotificationService, private viewPortService: ViewPortService, private modalService: NgbModal) {
    this.contestArray = {
      contestModal: []
    }
    this.isBrowser = isPlatformBrowser(platformId);
    this.browserDetails = this.appUtilService.getBrowserDetails();
  }

  ngOnInit() {
    if (this.appUtilService.checkIfPWA()) {
      this.isPWA = true;
    } else {
      this.isPWA = false;
    }
    this.placeholderImage = PlaceholderImage.NO_UPLOADS;
    this.getContests(this.pageNo, this.pageSize, ContestType[ContestType.UPCOMING].toString())
    this.getReminders()
  }
  getContests(pageNo, pageSize, contestType) {
    this.noResultFound = false;
    let supportWebpCluodFrontUrl: string = this.browserDetails.browser !== "Safari" ? environment.WEBP_JPEG_CLOUDFRONT_URL + environment.WEBP_CLOUDFRONT_URL : environment.WEBP_JPEG_CLOUDFRONT_URL + environment.JPEG_CLOUDFRONT_URL;
    this.ugcFormService.getContestListing(contestType, pageNo, pageSize).subscribe((res: any) => {
      if (res.code === 0) {
        this.totalObjects = res.data.meta.total;
        if (res.data.data.length > 0) {
          res.data.data.forEach((element) => {
            var contestModal = new ContestModal();
            contestModal.id = element.id;
            contestModal.name = element.title;
            contestModal.description = element.description;
            contestModal.startDate = element.startDate;
            contestModal.endDate = element.endDate;
            contestModal.thumbnailUrl = environment.IMAGES_CLOUDFRONT_URL + "/contest/" + element.landscapeImage;
            this.contestArray.contestModal = [...this.contestArray.contestModal, contestModal]
          })
          this.loading = false;
          this.addClickOnOtherTabs(contestType);
          return;
        }
        this.loading = false;
        this.noResultFound = true;
        this.addClickOnOtherTabs(contestType);
        return;
      }
      this.loading = false;
      this.noResultFound = true;
      this.addClickOnOtherTabs(contestType);
    }, error => {
      this.loading = false;
      this.noResultFound = true;
      this.addClickOnOtherTabs(contestType)
    })
  }

  handleImageError(event) {
    event.target.src = this.appUtilService.getDefaultThumbnail('LANDSCAPE')
  }

  getUpcommingContest() {
    this.restringClickOnTabs();
    this.getContests(this.pageNo, this.pageSize, ContestType[ContestType.UPCOMING].toString())

  }

  getLiveContest() {
    this.restringClickOnTabs();
    this.getContests(this.pageNo, this.pageSize, ContestType[ContestType.LIVE].toString())

  }

  getCompletedContest() {
    this.restringClickOnTabs();
    this.getContests(this.pageNo, this.pageSize, ContestType[ContestType.COMPLETED].toString())

  }

  restringClickOnTabs() {
    this.loading = true;
    $("#Completed-Content").css("pointer-events", "none");
    $("#uploaded-live").css("pointer-events", "none");
    $("#Upcoming-videos").css("pointer-events", "none");
    this.contestArray = {
      contestModal: []
    }
    this.pageSize = 10;
    this.pageNo = 1;
  }

  // For pagination
  getMoreVideos(contestType) {
    if (this.totalObjects > this.contestArray.contestModal.length) {
      this.pageNo = this.pageNo + 1;
      this.getContests(this.pageNo, this.pageSize, contestType);
    }
  }

  addClickOnOtherTabs(currentTab) {
    switch (currentTab) {
      case ContestType[ContestType.UPCOMING]: {
        $("#Completed-Content").css("pointer-events", "auto");
        $("#uploaded-live").css("pointer-events", "auto");
        break;
      };
      case ContestType[ContestType.LIVE]: {
        $("#Completed-Content").css("pointer-events", "auto");
        $("#Upcoming-videos").css("pointer-events", "auto");
        break;
      };
      case ContestType[ContestType.COMPLETED]: {
        $("#uploaded-live").css("pointer-events", "auto");
        $("#Upcoming-videos").css("pointer-events", "auto");
        break;
      }
    }
  }

  setReminder(contest: any) {

    if (this.viewPortService.isMobile() === true || this.viewPortService.isTablet() === true) {
      if (this.isBrowser) {
        setTimeout(() => this.downloadInAppModal());
      }
    } else {
      this.notificationService.requestPermission();
      if ('Notification' in window) {
        if (Notification.permission === "granted") {
          if (localStorage.getItem("n11s")) {
            var obj = JSON.parse(localStorage.getItem("n11s"))
            var notificationDetails = new NotificationDetails();
            notificationDetails.id = contest.id;
            notificationDetails.name = contest.name;
            notificationDetails.description = contest.description;
            notificationDetails.pic = contest.thumbnailUrl;
            notificationDetails.startDate = contest.startDate;
            notificationDetails.endDate = contest.endDate;
            notificationDetails.notified = false;
            obj.push(notificationDetails);
            localStorage.setItem("n11s", JSON.stringify(obj));
          } else {
            var notificationDetails = new NotificationDetails();
            notificationDetails.id = contest.id;
            notificationDetails.name = contest.name;
            notificationDetails.description = contest.description;
            notificationDetails.pic = contest.thumbnailUrl;
            notificationDetails.startDate = contest.startDate;
            notificationDetails.endDate = contest.endDate;
            this.notifications.push(notificationDetails);
            notificationDetails.notified = false;
            localStorage.setItem("n11s", JSON.stringify(this.notifications));
          }
          this.getReminders()
        } else {
          this.snackbarUtilService.showSnackbar("Please allow Notifications in the Permission section of your Browser")
        }
      } else {
        this.snackbarUtilService.showSnackbar("Notifications not supported in your browser")
      }
    }
  }

  showNotification() {
    this.notificationService.generateNotification(JSON.parse(localStorage.getItem("n11s"))[1])
  }

  getReminders() {
    if (this.platformIdentifierService.isBrowser()) {
      if (localStorage.getItem("n11s")) {
        let reminders = JSON.parse(localStorage.getItem("n11s"));
        reminders.forEach(element => {
          this.reminders[element.id] = true;
        })
      }
    }
  }

  goToContestPage(contestId, contestType) {
    switch (contestType) {
      case ContestType[ContestType.LIVE].toString(): {
        this.router.navigate(['/ugc/live-contest'], { queryParams: { id: contestId } });
        break;
      };
      case ContestType[ContestType.UPCOMING].toString(): {
        this.router.navigate(['/ugc/upcoming-contest'], { queryParams: { id: contestId } });
        break;
      };
      case ContestType[ContestType.COMPLETED].toString(): {
        this.router.navigate(['/ugc/completed-contest'], { queryParams: { id: contestId } });
        break;
      }
    }
  }

  downloadInAppModal() {
    this.downloadInAppModalResultRef = this.modalService.open(this.downloadInAppModalRef).result;

    this.downloadInAppModalResultRef.then(fulfilled => {
    }, rejected => {
    });
  }
}
