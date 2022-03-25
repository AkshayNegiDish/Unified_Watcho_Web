import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UgcFormService } from '../../services/ugc-form.service';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { ContestModal, TimerModal, NotificationDetails } from '../../models/contest.model';
import { environment } from '../../../../../../../environments/environment';
import { PlaceholderImage } from '../../../../../shared/typings/common-constants';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { ViewPortService } from '../../../../../shared/services/view.port.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';
declare var $: any;
declare var Notification: any;

@Component({
  selector: 'app-upcoming-contest',
  templateUrl: './upcoming-contest.component.html',
  styleUrls: ['./upcoming-contest.component.scss']
})

export class UpcomingContestComponent implements OnInit {

  @ViewChild('downloadtheInAppModal')
  downloadInAppModalRef: ElementRef;
  downloadInAppModalResultRef: Promise<any>;
  isBrowser: any;

  isPWA: boolean;
  contestModal: ContestModal;
  timerModal: TimerModal;
  notifications: any[] = [];
  reminders: any = {};
  placeholderImage = PlaceholderImage.NO_RESULT;
  noResultFound: boolean = false;
  loading: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId, private ugcFormService: UgcFormService, private notificationService: NotificationService, private appUtilService: AppUtilService,
    private snackbarUtilService: SnackbarUtilService, private activatedRoute: ActivatedRoute, private platformIdentifierService: PlatformIdentifierService,
    private router: Router, private viewPortService: ViewPortService, private modalService: NgbModal) {
    this.contestModal = {
      id: null,
      name: null,
      description: null,
      endDate: null,
      startDate: null,
      thumbnailUrl: null
    }
    this.timerModal = {
      hours: null,
      minutes: null,
      seconds: null,
    }
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.appUtilService.checkIfPWA()) {
      this.isPWA = true;
    } else {
      this.isPWA = false;
    }
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      if (params.get("id")) {
        this.getContest(params.get("id"));
        this.getReminders();
      }
    })
  }
  getContest(id) {
    this.noResultFound = false;
    this.loading = true;
    this.ugcFormService.getContestById(id).subscribe((res: any) => {
      if (res.code === 0) {
        this.contestModal.id = res.data.id;
        this.contestModal.name = res.data.title;
        this.contestModal.description = res.data.description;
        this.contestModal.thumbnailUrl = environment.IMAGES_CLOUDFRONT_URL + "/contest/" + res.data.landscapeImage;
        this.contestModal.startDate = res.data.startDate;
        this.contestModal.endDate = res.data.endDate;
        this.getCountDownTimer(res.data.startDate);
        this.loading = false;
        return;
      }
      this.loading = false;
      this.noResultFound = true;
      this.snackbarUtilService.showSnackbar(res.message)
    }, error => {
      this.loading = false;
      this.noResultFound = true;
      this.snackbarUtilService.showError();
    })
  }
  getCountDownTimer(startDate: any) {
    setTimeout(() => {
      var milliseconds = startDate - new Date().getTime()
      this.timerModal.seconds = Math.trunc((milliseconds / 1000) % 60);
      this.timerModal.minutes = Math.trunc((milliseconds / (1000 * 60)) % 60);
      this.timerModal.hours = Math.trunc((milliseconds / (1000 * 60 * 60)));
      if (milliseconds > 0) {
        this.getCountDownTimer(startDate)
      } else {
        this.router.navigate(['/ugc/live-contest'], { queryParams: { id: this.contestModal.id } });
      }
    }, 1000)

  }

  handleImageError(event) {
    event.target.src = this.appUtilService.getDefaultThumbnail('LANDSCAPE')
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


  downloadInAppModal() {
    this.downloadInAppModalResultRef = this.modalService.open(this.downloadInAppModalRef).result;

    this.downloadInAppModalResultRef.then(fulfilled => {
    }, rejected => {
    });
  }

}
