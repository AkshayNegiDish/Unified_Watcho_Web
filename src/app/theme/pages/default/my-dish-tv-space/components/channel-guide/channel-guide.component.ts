import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { MyDishTvSpaceService } from '../../services/mydishtvspace.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
declare var $: any;
var storeObj = {
  list: [],
  index: 0
};
@Component({
  selector: 'app-channel-guide',
  templateUrl: './channel-guide.component.html',
  styleUrls: ['./channel-guide.component.scss']
})
export class ChannelGuideComponent implements OnInit {
  channelList: any[] = [];
  allChannelList: any[] = [];
  mydishtvspacetoken: string;
  rootPlatform: string;
  loading: boolean;
  isDesktop: boolean = true;
  totalAssetObjects: number = 0;
  genreList: any[] = [];
  allGenreList: any[] = [];
  dates: any[] = [];
  isBrowser: any;
  pageSize: number;
  pageIndex: number;
  reqObj: object = {};
  lastdateIndex: number = 0;
  lastGenreIndex: number = -1;
  userCategory: string;
  railConfig: any = {
    adaptiveHeight: false,
    infinite: false,
    slidesToScroll: 5,
    slidesToShow: 7,
    speed: 1000,
    draggable: false,
    centerMode: false,
    variableWidth: false,
    lazyLoad: 'ondemand',
    touchThreshold: 10
  };
  railConfig2: any = {
    adaptiveHeight: false,
    infinite: false,
    slidesToScroll: 3,
    slidesToShow: 5,
    speed: 1000,
    draggable: false,
    centerMode: false,
    variableWidth: false,
    lazyLoad: 'ondemand',
    touchThreshold: 10
  };
  isMobileTabletView: boolean;
  platform: string;
  constructor(@Inject(PLATFORM_ID) private platformId, private router: Router, private mydishtvspaceservice: MyDishTvSpaceService) {
    //this.loading = true;
    this.userCategory = this.mydishtvspaceservice.getUserCategory();
    this.pageIndex = 1;
    this.pageSize = 5;
    this.platform = this.userCategory == '1' ? 'dishtv' : 'd2h';
    this.mydishtvspacetoken = this.mydishtvspaceservice.getEpgToken();
    this.rootPlatform = this.userCategory == '1' ? 'mydishtvspace' : 'myd2hspace';
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loading = true;
    this.mydishtvspaceservice.getGenresList(this.mydishtvspacetoken).subscribe((response: any) => {
      this.genreList = response;
      this.allGenreList = response;
    }, reject => {
      this.genreList = [];
      this.loading = false;
    });
    this.dates = this.getDates();
    this.dates[0].active = true;
    this.reqObj['date'] = this.dates[0].value;
    this.reqObj['fromdatetime'] = this.dates[0].datetime;
    this.getProgrameApi(this.mydishtvspacetoken, this.pageSize, this.pageIndex, this.reqObj, false);
    if (this.isBrowser) {



      if (matchMedia('(min-width: 300px)').matches && matchMedia('(max-width: 650px)').matches) {
        this.railConfig.slidesToShow = 5;
        this.railConfig.slidesToScroll = 3;
      }
      if (matchMedia('(min-width: 651px)').matches && matchMedia('(max-width: 760px)').matches) {
        this.railConfig.slidesToShow = 6;
        this.railConfig.slidesToScroll = 3;
      }
      if (matchMedia('(min-width: 300px)').matches && matchMedia('(max-width: 768px)').matches) {
        this.railConfig2.slidesToShow = 3.5;
        this.railConfig2.slidesToScroll = 3;
        this.railConfig2.speed = 0;
      }
    }
  }
  onScroll() {
    if (this.totalAssetObjects > 0) {
      this.pageIndex += 1;
      this.getProgrameApi(this.mydishtvspacetoken, this.pageSize, this.pageIndex, this.reqObj, true);
    }
  }
  onClickGenre(event, index, el) {
    $('.category-wrapper').removeClass('active');
    this.pageIndex = 1;
    var newlist = [];
    if (this.lastGenreIndex != index) {
      var str = this.genreList[index].subgenre.join();
      this.lastGenreIndex = index;
      this.reqObj['channelgenre'] = str;
      this.getProgrameApi(this.mydishtvspacetoken, this.pageSize, this.pageIndex, this.reqObj, false);
      $(el).addClass('active');
    } else {
      this.lastGenreIndex = -1;
      delete this.reqObj['channelgenre'];
      this.getProgrameApi(this.mydishtvspacetoken, this.pageSize, this.pageIndex, this.reqObj, false);
    }
  }
  getDates() { //dates for filter programs
    var arr = [];
    for (var i = 0; i < 6; i++) {
      var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
      var date = new Date(new Date().setDate(new Date().getDate() + i));
      var dd = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
      var mm = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1));
      var yyyy = date.getFullYear();
      var value = dd + '/' + mm + '/' + yyyy;
      var displaydate = monthNames[date.getMonth()] + ' ' + date.getDate();
      var datetimeFormat = '' + yyyy + mm + dd + ((date.getHours().toString().length > 1) ? date.getHours() : ('0' + date.getHours())) + date.getMinutes();
      console.log("datetimeFormat", datetimeFormat);
      switch (i) {
        case 0:
          displaydate = 'Today';
          datetimeFormat = datetimeFormat;
          break;
        case 1:
          displaydate = 'Tomorrow';
          break;
        default:
          break;
      }
      arr.push(
        {
          value: value,
          name: displaydate,
          active: false,
          datetime: datetimeFormat
        }
      );
    }
    return arr;
  }
  onResize(event) {
    if (this.isBrowser) {
      if (matchMedia('(min-width: 300px)').matches && matchMedia('(max-width: 650px)').matches) {
        this.genreList = [];
        setTimeout(() => {
          this.genreList = this.allGenreList;
        }, 0);
        this.railConfig.slidesToShow = 5;
        this.railConfig.slidesToScroll = 3;
      }
      if (matchMedia('(min-width: 651px)').matches && matchMedia('(max-width: 760px)').matches) {
        this.genreList = [];
        setTimeout(() => {
          this.genreList = this.allGenreList;
        }, 0);
        this.railConfig.slidesToShow = 6;
        this.railConfig.slidesToScroll = 3;
      }
      if (matchMedia('(min-width: 761px)').matches && matchMedia('(max-width: 1920px)').matches) {
        this.genreList = [];
        setTimeout(() => {
          this.genreList = this.allGenreList;
        }, 0);
        this.railConfig.slidesToShow = 7;
        this.railConfig.slidesToScroll = 5;
      }
      if (matchMedia('(min-width: 1001px)').matches && matchMedia('(max-width: 1920px)').matches) {
        this.genreList = [];
        setTimeout(() => {
          this.genreList = this.allGenreList;
        }, 0);
        this.railConfig.slidesToShow = 7;
        this.railConfig.slidesToScroll = 5;
      }
      if (matchMedia('(min-width: 300px)').matches && matchMedia('(max-width: 768px)').matches) {
        this.channelList = [];
        setTimeout(() => {
          this.channelList = this.allChannelList;
        }, 0);
        this.railConfig2.slidesToShow = 3.5;
        this.railConfig2.slidesToScroll = 3;
        this.railConfig2.speed = 0;
      }
      if (matchMedia('(min-width: 769px)').matches && matchMedia('(max-width: 1920px)').matches) {
        this.channelList = [];
        setTimeout(() => {
          this.channelList = this.allChannelList;
        }, 0);
        this.railConfig2.slidesToShow = 5;
        this.railConfig2.slidesToScroll = 3;
      }
    }
  }
  onClickDate(index: number) {
    this.pageIndex = 1;
    if (this.lastdateIndex >= 0) {
      this.dates[this.lastdateIndex].active = false;
    }
    if (this.lastdateIndex != index) {
      this.reqObj['date'] = this.dates[index].value;
      if (index == 0) {
        this.reqObj['fromdatetime'] = this.dates[0].datetime;
      } else {
        delete this.reqObj['fromdatetime'];
      }
      this.dates[index].active = true;
      this.lastdateIndex = index;
      this.getProgrameApi(this.mydishtvspacetoken, this.pageSize, this.pageIndex, this.reqObj, false);
    }
    else {
      this.dates[index].active = true;
      this.lastdateIndex = index;
    }
  }
  getProgrameApi(token: string, pageSize: number, pageIndex: number, body: object, scrolling: boolean) {
    body['sortby'] = 'lcn';
    this.mydishtvspaceservice.getProgrameList(token, pageSize, pageIndex, body).subscribe((response: any) => {
      var data = this.setProgressRange(response);
      this.channelList = scrolling ? this.channelList.concat(data) : data;
      this.allChannelList = this.channelList;
      this.totalAssetObjects = response.length;
      this.loading = false;
    }, reject => {
      this.channelList = [];
      this.allChannelList = this.channelList;
      this.loading = false;
    });
  }
  getProgramDetails(channelIndex: number, programIndex: number) {
    let programs = this.channelList[channelIndex].programs.slice(programIndex);
    this.mydishtvspaceservice.setProgramDetail(programs);
    this.router.navigate([`/user/${this.rootPlatform}/channel-guide/program-details`]);
  }
  setProgressRange(data: any) {
    for (var i = 0; i < data.length; i++) {
      var startdate = new Date();
      var stopdate = new Date();
      startdate.setDate(data[i].programs[0].programstart.split('T')[0].split('-')[2]);
      startdate.setFullYear(data[i].programs[0].programstart.split('T')[0].split('-')[0]);
      startdate.setMonth(Number(data[i].programs[0].programstart.split('T')[0].split('-')[1] - 1));
      startdate.setHours(data[i].programs[0].programstart.split('T')[1].split(':')[0]);
      startdate.setMinutes(data[i].programs[0].programstart.split('T')[1].split(':')[1]);
      stopdate.setDate(data[i].programs[0].programstop.split('T')[0].split('-')[2]);
      stopdate.setFullYear(data[i].programs[0].programstop.split('T')[0].split('-')[0]);
      stopdate.setMonth(Number(data[i].programs[0].programstop.split('T')[0].split('-')[1] - 1));
      stopdate.setHours(data[i].programs[0].programstop.split('T')[1].split(':')[0]);
      stopdate.setMinutes(data[i].programs[0].programstop.split('T')[1].split(':')[1]);
      var date = new Date();
      var progress = Math.floor(((stopdate.getTime() - startdate.getTime()) / 1000) / 60) - Math.floor(((stopdate.getTime() - date.getTime()) / 1000) / 60);
      data[i].programs[0].progress = ((progress * 100) / Math.floor(((stopdate.getTime() - startdate.getTime()) / 1000) / 60)).toFixed(2) + '%';
    }
    return data;
  }
  tConvert(date) {
    var time = date.split('T')[1].split('.')[0]
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) { // If time format correct
      time = time.slice(1, 4);  // Remove full string match value
      time[3] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }
}