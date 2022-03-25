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



declare var $: any

@Component({
  selector: 'app-channel-schedule-page',
  templateUrl: './channel-schedule-page.component.html',
  styleUrls: ['./channel-schedule-page.component.scss'],
})


export class ChannelSchedulePageComponent implements OnInit {

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


  constructor(@Inject(PLATFORM_ID) private platformId, private activatedRoute: ActivatedRoute,
    private kalturaAppService: KalturaAppService, private titleService: Title,
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
    // alert(this.today)
    this.currentDay = this.today.getDate().toString() + "/" + this.month[(this.today.getMonth())].toString();
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    this.headerDate = this.minDate * 1000;
    this.maxDate = new Date;
    this.maxDate.setHours(23, 59, 59, 999);
    // var max = this.maxDate / 1000
    // this.maxDate = +parseInt(max.toString(), 10);
    var current = +new Date() / 1000
    this.currentValue = +parseInt(current.toString(), 10);
    this.currentTime = new Date();
    // this.currentTime = +this.currentTime
    this.currentTimeProgressBar = new Date();

    // // override the route reuse strategy
    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // }

    // this.router.events.subscribe((evt) => {
    //   if (evt instanceof NavigationEnd) {
    //     // trick the Router into believing it's last link wasn't previously loaded
    //     this.router.navigated = false;
    //     // if you need to scroll back to top, here is the right place
    //     window.scrollTo(0, 0);
    //   }
    // });



  }

  ngOnInit() {
    this.loading = true;
    this.DMS = this.appUtilService.getDmsConfig('liveTv');
    this.screenId = environment.ENVEU.SCREEN_IDS.FORWARD_EPG_DETAIL;

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.channelAssetDetails = null;
      this.channelId = +params.get('channelId');
      this.getChannelDetails(this.channelId.toString());
    })

    // this.externalChannelId = this.activatedRoute.snapshot.params['externalId'];
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
    // this.getLiveNowRail();
    // this.getSimilarChannelList();
    // $("#collapsed_nowtoday").slideToggle(initialize);
    if (!this.isBrowser) {
      this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
        this.channelId = +params.get('channelId');
        this.seoTitleSetAsset(this.channelId.toString());
      })

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
      // console.error(reject);
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
        'entry_id': this.entryId // this.entryid
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
    // this.mtoday = new Date()
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
    // this.week.weekday.reverse();
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
  }

  dateChanged(selectedDate: number) {
    //  alert(a);
    this.earlierclicked = false;
    // this.selectedDate = a;
    this.headerDate = selectedDate;
    this.selectedDate = selectedDate;

    this.minDate = new Date(selectedDate);
    this.minDate.setHours(0, 0, 0, 0);
    this.currentTime = new Date(selectedDate);
    // this.currentTime.setHours(0, 0, 0, 0);  
    var min = new Date(selectedDate);
    this.maxDate = new Date(selectedDate);
    this.maxDate.setHours(23, 59, 59, 999);
    // var max = this.maxDate / 1000
    // this.maxDate = +parseInt(max.toString(), 10);
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
        // this.abc = null;
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

    // this.minDate = a;
    // this.maxDate.setDate(this.minDate.getDate() + 1);
    // this.currentValue = new Date();
    this.getChannelEpg();


  }

  toggleInfoBar(event) {
    // var hint = document.getElementById('collapsed_'+event);
    // if (hint.style.visibility == 'hidden') {
    //   hint.style.visibility = 'visible';
    //   // hint.style.opacity = '1';
    // }
    // else {
    //   hint.style.visibility = 'hidden';
    //   // hint.style.opacity = '0';
    // }
    $("#collapsed_" + event).slideToggle();
  }

  getChannelEpg() {
    this.datechanged = true;
    // this.showCurrentEpg = (this.currentTimeProgressBar.getTime() / 1000 >= programs.startDate &&  programs.endDate >= currentTimeProgressBar.getTime() / 1000) 
    this.channelDetails = [];
    var pageIndex = 1;
    this.kalturaAppService.getChannelEpg(this.externalChannelId, this.minDate.getTime() / 1000, (this.maxDate.getTime() + 1) / 1000, pageIndex, 100).then((res) => {
      // this.channelDetails = [];
      // this.channelDetails.push(res)
      if (res.objects) {
        res.objects.forEach((element: any, index) => {
          if (new Date().getTime() / 1000 >= element.startDate && element.endDate >= new Date().getTime() / 1000) {
            this.showMoreIndex = index
            this.showNumber = this.showMoreIndex;
            this.posterImage = element;
            this.datechanged = false;
            this.loading = false;

            this.duration = (this.posterImage.endDate) - (this.posterImage.startDate);
            this.videoDuration = this.getMediaTime(this.duration)
            this.gtmTagEventOnDetailPage(this.channelAssetDetails, this.posterImage)
          } else if (this.currentTime.getTime() / 1000 >= element.startDate && element.endDate >= this.currentTime.getTime() / 1000) {
            this.showMoreIndex = index
            this.showNumber = this.showMoreIndex + 9;
            this.datechanged = false;
            this.loading = false;

          }
          this.channelDetails.push(element);
          this.datechanged = false;
          this.loading = false;

        })
      }
      this.datechanged = false;
      this.loading = false;
      this.programDetailsLength = this.channelDetails.length;
      if (this.todayFlag) {
        this.showMore = true;
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
        // this.abc = null;
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
      this.getChannelEpg();
      this.titleService.setTitle('Watch ' + this.channelAssetDetails.name + ' Live programs online on ' + AppConstants.APP_NAME_CAPS + ' | ' + AppConstants.APP_NAME_CAPS + ' Live TV');
      this.detailsPageVisited(this.channelAssetDetails.type);
    }, reject => {
      console.error("error");
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
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
        // this.abc = null;
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

  // getLiveNowRail() {
  //   this.kalturaAppService.getLiveNowRail(1, 20).then((res: any) => {
  //     console.log(res)
  //   }, reject => {
  //     console.error("error")
  //   })
  // }

  // getSimilarChannelList() {
  //   this.dmsConfig = this.appUtilService.getDmsConfig('channel_Schedule');
  //   // console.log(this.dmsConfig.params.MediaTypes.Linear);
  //   this.kalturaAppService.getSimilarChannel(1, 20, this.dmsConfig.params.MediaTypes.Linear).then((res: any) => {
  //     console.log(res)
  //   }, reject => {
  //     console.error(reject);
  //   })
  // }

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

  detailsPageVisited(id: number) {
    let detailsPageInfo: any;
    let userDetails: any;
    let utmParams: any;
    if (JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS))) {
      userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
    }
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      utmParams = params;
    });
    if (this.appUtilService.getMediaTypeNameById(id) === 'Linear') {
      detailsPageInfo = {
        user_id: userDetails !== undefined ? userDetails.UserID : null,
        mobile_number: userDetails !== undefined ? userDetails.MobileNo : null,
        email: userDetails !== undefined ? userDetails.EmailID : null,
        name: userDetails !== undefined ? userDetails.Name : null,
        utm_source: utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
        utm_medium: utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
        utm_campaign: utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
        page_location: 'linear_channel_page',
        asset_ID: this.channelAssetDetails.id,
        asset_title: this.channelAssetDetails.name,
        asset_genre: this.channelAssetDetails.tags['Genre'] ? this.channelAssetDetails.tags['Genre'].objects[0].value : null,
        asset_mediatype: this.channelAssetDetails.type,
        status: 'page_load_successful'
      }
    }
    this.appUtilService.moEngageEventTracking('DETAILS_PAGE_VISITED', detailsPageInfo);
  }

  gtmTagEventOnDetailPage(channelAssetDetails, posterImage) {
    let dataLayerJson: any;
    let userDetails: any;
    let utmParams: any;
    if (JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS))) {
      userDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
    }
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      utmParams = params;
    });
    dataLayerJson = {
      'user_id': userDetails !== undefined ? userDetails.UserID : null,
      'mobile_number': userDetails !== undefined ? userDetails.MobileNo : null,
      'email': userDetails !== undefined ? userDetails.EmailID : null,
      'name': userDetails !== undefined ? userDetails.Name : null,
      'utm_source': utmParams.has('utm_source') ? utmParams.get('utm_source') : null,
      'utm_medium': utmParams.has('utm_medium') ? utmParams.get('utm_medium') : null,
      'utm_campaign': utmParams.has('utm_campaign') ? utmParams.get('utm_campaign') : null,
      'page_location': 'linear_page',
      'asset_id': channelAssetDetails.id,
      'asset_title': channelAssetDetails.name,
      'asset_genre': channelAssetDetails.tags.Genre ? channelAssetDetails.tags.Genre.objects[0].value : null,
      'asset_subgenre': channelAssetDetails.tags['Sub Genre'] ? channelAssetDetails.tags['Sub Genre'].objects[0].value : null,
      'asset_mediatype': 'Linear',
      'asset_cast': channelAssetDetails.tags['Main Cast'] ? channelAssetDetails.tags['Main Cast'].objects[0].value : null,
      'asset_crew': channelAssetDetails.tags.Director ? channelAssetDetails.tags.Director.objects[0].value : null,
      'asset_parental_rating': channelAssetDetails.tags['Parental Rating'] ? channelAssetDetails.tags['Parental Rating'].objects[0].value : null,
      'now_playing': posterImage ? posterImage.name : null,
      'channel_name': channelAssetDetails.name,
      'channel_show_title': channelAssetDetails.name,
      'asset_duration': channelAssetDetails.mediaFiles[0] ? channelAssetDetails.mediaFiles[0].duration : null,
      'epg_name': posterImage ? posterImage.name : null,
      'asset_language': channelAssetDetails.tags['Asset Language'] ? channelAssetDetails.tags['Asset Language'].objects[0].value : null

    };
    this.appUtilService.getGTMTag(dataLayerJson, 'detail_page');
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

}

