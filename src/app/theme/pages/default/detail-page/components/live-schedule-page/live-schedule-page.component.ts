import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { AppConstants } from '../../../../../shared/typings/common-constants';
import { Days, Week } from '../models/video-page';
import { environment } from '../../../../../../../environments/environment';
import { ModalMessageService } from '../../../../../shared/services/modal-message.service';

declare var $: any

@Component({
  selector: 'app-live-schedule-page',
  templateUrl: './live-schedule-page.component.html',
  styleUrls: ['./live-schedule-page.component.scss']
})
export class LiveSchedulePageComponent implements OnInit {

  isBrowser;

  playerId: string;
  secure: boolean;
  entryId: string;
  partnerId: string;
  uiConfId: string;
  divId: string;
  mediaId: string;
  showMore: boolean = true;
  show: string = "Show more";
  otherDay: boolean = false;

  mediaAssetDetails: any;

  ready: EventEmitter<string> = new EventEmitter<string>();

  today: Date;
  week: Week;
  day: Days;
  currentDay: string;
  head: string;
  weekdays = [{ id: "1", name: "Monday" }, { id: "2", name: "Tuesday" }, { id: "3", name: "Wednesday" }, { id: "4", name: "thursday" }, { id: "5", name: "Friday" }, { id: "6", name: "Saturday" }, { id: "7", name: "sunday" }]
  todayday: string;
  date: number;
  prev: boolean;
  current: boolean = true;
  mtoday: Date;
  maximumDate: Date;
  headerDate: number;
  todayFlag: boolean;
  minDate: any;
  maxDate: any;
  currentValue: any;
  infoBarOpen: boolean = false;
  channelDetails: any[] = [];
  currentTime: Date;
  selectedDate: number;
  currentJustify: string;
  earlierclicked: boolean = false;
  progress: any;
  currentTimeProgressBar: Date;
  externalChannelId: number;
  channelId: any;
  channelAssetDetails: any;
  posterImage: any;
  showNumber: number;
  showMoreIndex: number;
  programDetailsLength: number;
  hideLessButton: boolean = false;
  dmsConfig: any;
  loading: boolean = false;

  isImageLoaded: boolean = false;
  arrowIconDirection: string = 'keyboard_arrow_down';
  EarlierNowToggle: string = "Earlier";
  earlierUpcommingFlag: string = "Upcoming";
  previousDayFlag: boolean;
  notTodayNumber: number = 10;
  DMS: any;
  screenId: any;
  isDetailPage: boolean = true;
  videoDuration: any;
  duration: any;
  isImagChnnlLoaded: boolean;

  month: string[] = [];
  gerne: any;
  datechanged: boolean;
  isMobileOrTabletView: boolean;
  firstClicked: boolean = true;
  pageSize: number;
  epgTotalCount: number = 0;
  pageIndex: number;
  reinitiatePlayer: boolean = true;


  constructor(@Inject(PLATFORM_ID) private platformId, private activatedRoute: ActivatedRoute,
    private kalturaAppService: KalturaAppService, private titleService: Title, private modalMessageService: ModalMessageService,
    public kalturaUtilService: KalturaUtilService, public appUtilService: AppUtilService, private router: Router, private meta: Meta) {
    this.month[0] = "Jan";
    this.month[1] = "Feb";
    this.month[2] = "Mar";
    this.month[3] = "Apr";
    this.month[4] = "May";
    this.month[5] = "Jun";
    this.month[6] = "Jul";
    this.month[7] = "Aug";
    this.month[8] = "Sept";
    this.month[9] = "Oct";
    this.month[10] = "Nov";
    this.month[11] = "Dec";
    this.currentJustify = "fill";
    this.isBrowser = isPlatformBrowser(platformId);
    this.todayFlag = true;
    this.day = {
      id: null,
      name: null,
      date: null,
      wholeDate: null,
    }
    this.week = {
      weekday: []
    }
    this.mtoday = new Date()
    this.today = new Date();
    this.currentDay = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    this.headerDate = this.minDate * 1000;
    this.maxDate = new Date;
    this.maxDate.setHours(23, 59, 59, 999);
    var current = +new Date() / 1000
    this.currentValue = +parseInt(current.toString(), 10);
    this.currentTime = new Date();
    this.currentTimeProgressBar = new Date();
    this.pageIndex = 1;
    this.pageSize = 50;

    this.modalMessageService.messageCommonObj$.subscribe((res: boolean) => {
      if (!res) {
        this.reinitiatePlayer = true;
      } else {
        this.reinitiatePlayer = false;
      }
    })
  }

  ngOnInit() {
    this.loading = true;
    this.DMS = this.appUtilService.getDmsConfig('liveTv');
    this.screenId = environment.ENVEU.SCREEN_IDS.FORWARD_EPG_DETAIL;

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.channelAssetDetails = null;
      this.channelDetails = [];
      this.channelId = +params.get('channelId');
      this.getChannelDetails(this.channelId.toString());
    })

    this.todayday = this.today.getDay().toString();
    this.date = +this.todayday;
    setTimeout(() => {
      this.populateCurrentDays()
    }, 500)

    $('#ngbDropdownMenu').on('click', (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();//This will prevent the event from bubbling up and close the dropdown when you type/click on text boxes.
    });
    this.head = "Upcoming Days";
    if (!this.isBrowser) {
      this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
        this.channelId = +params.get('channelId');
        this.seoTitleSetAsset(this.channelId.toString());
      })
    }
    if (matchMedia('(max-width: 768px)').matches) {
      this.isMobileOrTabletView = true;
    } else {
      this.isMobileOrTabletView = false;
    }
  }

  getMediaAssetDetails(mediaId) {
    this.kalturaAppService.getMediaAssetById(mediaId).then(response => {
      this.mediaAssetDetails = response;
      this.entryId = this.mediaAssetDetails.entryId;
      if (this.isBrowser) {
        this.loadScript();
      }
    }, reject => {
    })
  }

  loadScript() {

    if (document.getElementById('kalturaLib') === null) {
      let src = `https://cdnapisec.kaltura.com/p/${this.partnerId}/sp/${this.partnerId}00/embedIframeJs/uiconf_id/${this.uiConfId}/partner_id/${this.partnerId}`;
      const node = document.createElement('script');
      node.id = 'kalturaLib';
      node.src = src;
      node.type = 'text/javascript';
      node.async = false;
      node.charset = 'utf-8';

      node.onload = this.onKalturaScriptLoaded.bind(this);

      document.getElementsByTagName('head')[0].appendChild(node);
    } else {
      this.onKalturaScriptLoaded();
    }
  }

  onKalturaScriptLoaded() {
    const intervalID = setInterval(() => {
      if (typeof (<any>window).kWidget === `undefined`) {
        console.error('Kaltura script not loaded.');
        return;
      }

      clearInterval(intervalID);

      const target = this.playerId ? `kaltura_player_${this.playerId}` : `kaltura_player_`;

      (<any>window).kWidget.embed({
        'targetId': target,
        'wid': `_${this.partnerId}`,
        'uiconf_id': this.uiConfId,
        'flashvars': {},
        'cache_st': this.playerId,
        'entry_id': this.entryId
      });

      (<any>window).kWidget.addReadyCallback((targetId: string) => {
        this.ready.emit(targetId);
      });

    }, 50);
  }

  getMediaAssetInfo() {

  }
  onToggle(open, pageName) {

  }
  onDateChange(selectedValue) {

  }


  populateCurrentDays() {
    this.today = new Date();
    this.week.weekday = [];

    for (var i = 0; i < 7; i++) {
      switch (this.todayday) {
        case "1":
          var day = new Days
          day.id = +this.todayday;
          day.name = "Monday";
          day.wholeDate = +this.today;
          day.date = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
          this.today.setDate(this.today.getDate() + 1);
          this.todayday = this.today.getDay().toString();
          this.week.weekday.push(day)
          break;
        case "2":
          var day = new Days
          day.id = +this.todayday;
          day.name = "Tuesday";
          day.wholeDate = +this.today;
          day.date = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
          this.today.setDate(this.today.getDate() + 1);
          var today = this.today;
          this.todayday = this.today.getDay().toString();
          this.week.weekday.push(day)
          break;
        case "3":
          var day = new Days
          day.id = +this.todayday;
          day.name = "Wednesday";
          day.wholeDate = +this.today;
          day.date = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
          this.today.setDate(this.today.getDate() + 1);
          this.todayday = this.today.getDay().toString();
          var today = this.today;
          this.week.weekday.push(day)
          break;
        case "4":
          var day = new Days
          day.id = +this.todayday;
          day.name = "Thursday";
          day.wholeDate = +this.today;
          day.date = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
          this.today.setDate(this.today.getDate() + 1);
          var today = this.today;
          this.todayday = this.today.getDay().toString();
          this.week.weekday.push(day)
          break;
        case "5":
          var day = new Days
          day.id = +this.todayday;
          day.name = "Friday";
          day.wholeDate = +this.today;
          day.date = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
          this.today.setDate(this.today.getDate() + 1);
          var today = this.today;
          this.todayday = this.today.getDay().toString();
          this.week.weekday.push(day)
          break;
        case "6":
          var day = new Days
          day.id = +this.todayday;
          day.name = "Saturday";
          day.wholeDate = +this.today;
          day.date = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
          this.today.setDate(this.today.getDate() + 1);
          var today = this.today;
          this.todayday = this.today.getDay().toString();
          this.week.weekday.push(day)
          break;
        case "0":
          var day = new Days
          day.id = +this.todayday;
          day.name = "Sunday";
          day.wholeDate = +this.today;
          day.date = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
          this.today.setDate(this.today.getDate() + 1);
          var today = this.today;
          this.todayday = this.today.getDay().toString();
          this.week.weekday.push(day)
          break;
      }
    }

  }

  populatePastDays() {
    this.week.weekday = [];
    this.today = new Date;
    for (var i = 0; i < 7; i++) {
      switch (this.todayday) {
        case "1":
          var day = new Days
          day.id = +this.todayday;
          day.name = "Monday";
          day.wholeDate = +this.today;
          day.date = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
          this.today.setDate(this.today.getDate() - 1);
          this.todayday = this.today.getDay().toString();
          this.week.weekday.push(day)
          break;
        case "2":
          var day = new Days
          day.id = +this.todayday;
          day.name = "Tuesday";
          day.wholeDate = +this.today;
          day.date = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
          this.today.setDate(this.today.getDate() - 1);
          var today = this.today;
          this.todayday = this.today.getDay().toString();
          this.week.weekday.push(day)
          break;
        case "3":
          var day = new Days
          day.id = +this.todayday;
          day.name = "Wednesday";
          day.wholeDate = +this.today;
          day.date = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
          this.today.setDate(this.today.getDate() - 1);
          this.todayday = this.today.getDay().toString();
          var today = this.today;
          this.week.weekday.push(day)
          break;
        case "4":
          var day = new Days
          day.id = +this.todayday;
          day.name = "Thursday";
          day.wholeDate = +this.today;
          day.date = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
          this.today.setDate(this.today.getDate() - 1);
          var today = this.today;
          this.todayday = this.today.getDay().toString();
          this.week.weekday.push(day)
          break;
        case "5":
          var day = new Days
          day.id = +this.todayday;
          day.name = "Friday";
          day.wholeDate = +this.today;
          day.date = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
          this.today.setDate(this.today.getDate() - 1);
          var today = this.today;
          this.todayday = this.today.getDay().toString();
          this.week.weekday.push(day)
          break;
        case "6":
          var day = new Days
          day.id = +this.todayday;
          day.name = "Saturday";
          day.wholeDate = +this.today;
          day.date = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
          this.today.setDate(this.today.getDate() - 1);
          var today = this.today;
          this.todayday = this.today.getDay().toString();
          this.week.weekday.push(day)
          break;
        case "0":
          var day = new Days
          day.id = +this.todayday;
          day.name = "Sunday";
          day.wholeDate = +this.today;
          day.date = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
          this.today.setDate(this.today.getDate() - 1);
          var today = this.today;
          this.todayday = this.today.getDay().toString();
          this.week.weekday.push(day)
          break;
      }
    }
    this.week.weekday.splice(0, 1)
  }

  pastDays() {
    if (this.prev) {
      this.populateCurrentDays();
      this.prev = false;
      this.head = "Upcoming Days"
    } else {
      this.populatePastDays();
      this.head = "Past Days"
      this.prev = true;
    }
    this.current = false;
    this.firstClicked = false;
  }

  dateChanged(selectedDate: number) {
    this.channelDetails = [];
    this.pageIndex = 1;
    this.earlierclicked = false;
    this.headerDate = selectedDate;
    this.selectedDate = selectedDate;
    this.minDate = new Date(selectedDate);
    this.minDate.setHours(0, 0, 0, 0);
    this.currentTime = new Date(selectedDate);
    var min = new Date(selectedDate);
    this.maxDate = new Date(selectedDate);
    this.maxDate.setHours(23, 59, 59, 999);
    var current = +selectedDate / 1000
    this.currentValue = +parseInt(current.toString(), 10);
    if (min.getDate() === +new Date().getDate()) {
      this.otherDay = false;
    } else {
      this.notTodayNumber = 10;
      this.otherDay = true;
    }
    if (min.getTime() < new Date().getTime()) {
      this.previousDayFlag = true;
      this.earlierUpcommingFlag = "Earlier"
    } else {
      this.earlierUpcommingFlag = "Upcoming"
      this.previousDayFlag = false;
    }
    if (min.getDate() === new Date().getDate()) {
      this.todayFlag = true;
      if (this.selectedDate) {
        this.currentTime = new Date(this.selectedDate);
      } else {
        this.currentTime = new Date();
      }
      this.arrowIconDirection = 'keyboard_arrow_down';
      this.EarlierNowToggle = "Earlier";
      this.earlierclicked = false;
      this.earlierUpcommingFlag = "Upcoming"
    } else {
      this.currentTime.setHours(0, 0, 0, 0);
      this.todayFlag = false;
    }
    this.currentDay = min.getDate().toString() + "/" + this.month[(min.getMonth())].toString();
    this.getChannelEpg();
    setTimeout(() => {
      this.datechanged = false;
      this.scroll("collapser_" + this.posterImage.startDate, this.posterImage.startDate);
    }, 2000);
  }

  toggleInfoBar(event) {
    $("#collapsed_" + event).slideToggle();
  }

  getChannelEpg() {
    this.datechanged = true;
    this.kalturaAppService.getChannelEpg(this.externalChannelId, this.minDate.getTime() / 1000, (this.maxDate.getTime() + 1) / 1000, this.pageIndex, this.pageSize).then((res) => {
      if (res.objects) {
        res.objects.forEach((element: any, index) => {
          if (new Date().getTime() / 1000 >= element.startDate && element.endDate >= new Date().getTime() / 1000) {
            this.posterImage = null;
            this.showMoreIndex = index
            this.showNumber = this.showMoreIndex;
            this.posterImage = element;
            this.datechanged = false;
            this.loading = false;
            this.duration = (this.posterImage.endDate) - (this.posterImage.startDate);
            this.videoDuration = this.getMediaTime(this.duration)
          } else if (this.currentTime.getTime() / 1000 >= element.startDate && element.endDate >= this.currentTime.getTime() / 1000) {
            this.showMoreIndex = index
            this.showNumber = this.showMoreIndex + 9;
            this.datechanged = false;
            this.loading = false;

          }
          this.datechanged = false;
          this.loading = false;
        });
        this.populateEpgSchedules(res);
      }
      this.datechanged = false;
      this.loading = false;
      this.programDetailsLength = this.channelDetails.length;
      if (this.todayFlag) {
        this.showMore = true;
        this.firstClicked = true;
      }
    }, reject => {

    })
  }

  openEarlierEpg() {
    if (this.earlierclicked) {
      this.arrowIconDirection = 'keyboard_arrow_down';
      this.EarlierNowToggle = "Earlier";
      this.earlierclicked = false;
      if (this.todayFlag) {
        this.earlierUpcommingFlag = "Upcoming"
      } else if (this.previousDayFlag) {
        this.earlierUpcommingFlag = "Earlier"
      }
    } else {
      if (this.todayFlag) {
        this.earlierUpcommingFlag = "Earlier"
      } else if (this.previousDayFlag) {
        this.earlierUpcommingFlag = "Earlier"
      }
      this.arrowIconDirection = 'keyboard_arrow_up';
      this.EarlierNowToggle = "Upcoming";
      this.earlierclicked = true;
    }
    if (this.currentTime.getHours() === 0) {
      if (this.selectedDate) {
        this.currentTime = new Date(this.selectedDate);
      } else {
        this.currentTime = new Date();
      }
    } else {
      if (this.selectedDate) {
        this.currentTime = new Date(this.selectedDate)
        this.currentTime.setHours(0, 0, 0, 0);
      } else {
        this.currentTime.setHours(0, 0, 0, 0);
      }
    }
  }

  preventPropagation(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
  }

  getChannelDetails(channelId: number) {
    let ksql = "media_id:'" + channelId + "'";
    this.kalturaAppService.searchAsset(null, null, ksql, 1, 1).then((res: any) => {
      if (res.objects) {
        this.channelAssetDetails = res.objects[0];
      }
      this.gerne = this.channelAssetDetails.tags.Genre ? this.channelAssetDetails.tags.Genre.objects[0].value : '';
      this.externalChannelId = +this.channelAssetDetails.externalIds;
      this.pageIndex = 1;
      this.getChannelEpg();
      this.titleService.setTitle('Watch ' + this.channelAssetDetails.name + ' Live programs online on ' + AppConstants.APP_NAME_CAPS + ' | ' + AppConstants.APP_NAME_CAPS + ' Live TV');
    }, reject => {
      console.error("error");
    })
  }

  ngOnDestroy(): void {
    this.titleService.setTitle("");
  }

  showMoreCards() {
    if (!this.todayFlag) {
      this.notTodayNumber = this.notTodayNumber + 10;
    }
    this.earlierUpcommingFlag = "Upcoming"
    this.showMore = false;
    this.showNumber = this.showNumber + 10;
  }

  showLess() {
    if (!this.todayFlag) {
      this.notTodayNumber = this.notTodayNumber - 10;
      this.showMore = false;
      if (this.showNumber >= this.showMoreIndex) {
        this.showNumber = this.showNumber - 10;
        this.hideLessButton = false;
      } else {
        this.hideLessButton = true;
      }
    } else {
      if (this.selectedDate) {
        this.currentTime = new Date(this.selectedDate);
      } else {
        this.currentTime = new Date();
      }
      this.arrowIconDirection = 'keyboard_arrow_down';
      this.EarlierNowToggle = "Earlier";
      this.earlierclicked = false;
      this.earlierUpcommingFlag = "Upcoming"
      this.showMore = true;
      this.showNumber = this.showMoreIndex;
    }
  }

  onImageLoaded(event) {
    this.isImageLoaded = true;
    this.isImagChnnlLoaded = true;
  }

  playEvent() {

  }

  imageLoadError(event) {
    event.target.src = this.appUtilService.getDefaultThumbnail('LANDSCAPE');
  }

  goToCatchupPage(programAsset: any) {
    this.router.navigate(['/watch/catchup/details/' + programAsset.name + '/' + programAsset.id + ''])
  }

  getMediaTime(val: number) {
    var hrs = Math.floor(val / 3600);
    var mins = Math.floor((val % 3600) / 60);
    var secs = val % 60;
    var ret = "";
    if (hrs > 0) {
      if (mins > 0 && secs === 0) {
        ret += "" + hrs + " hrs" + " : " + (mins < 10 ? "0" + mins : mins) + " mins";
      }
      else if (secs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" + mins : mins) + ":" + secs + " sec";
      } else {
        ret = '' + hrs + ' hr'
      }

    }
    else if (mins > 0) {
      ret += mins + " mins";
    }
    return ret;
  }

  seoTitleSetAsset(assetId: string) {
    this.kalturaAppService.getMediaAssetByIdNative(assetId).subscribe((res: any) => {
      this.titleService.setTitle(res.result.metas ? res.result.metas.SEOTitle ? res.result.metas.SEOTitle.value : '' : '');
      this.meta.updateTag({
        name: 'description',
        content: res.result.metas ? res.result.metas.SEODescription ? res.result.metas.SEODescription.value : '' : ''
      })
    }, (error) => {
    })
  }

  populateEpgSchedules(epgList) {
    this.epgTotalCount = epgList.totalCount;
    epgList.objects.forEach(element => {
      this.onScrollLiveData();
      this.channelDetails.push(element);
    });
  }

  onScrollLiveData() {
    if (this.epgTotalCount > this.pageSize * this.pageIndex) {
      this.pageIndex += 1;
      this.getChannelEpg();
    }
  }

  isSchedule() {
    this.firstClicked = true;
  }

  scroll(divId, posterImageStartDate) {
    if (this.firstClicked) {
      $(document).ready(function () {
        // if ($('.channel-schedule').height() < 368) {
        //   $(".scroll-tab").animate({
        //     scrollTop: ($("#" + divId).offset().top - 585)
        //   }, 2000);
        // } else {
        //   $(".scroll-tab").animate({
        //     scrollTop: ($("#" + divId).offset().top - 880)
        //   }, 2000);
        // }
        $(".scroll-tab").animate({scrollTop: $(".scroll-tab").scrollTop() + ($("#"+divId).offset().top - $(".scroll-tab").offset().top)},0);
        $("#collapsed_" + posterImageStartDate).slideToggle(0);
      });
      this.firstClicked = false;
    }
  }
  
}
