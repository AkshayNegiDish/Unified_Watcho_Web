import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { MyDishTvSpaceService } from '../../services/mydishtvspace.service';
import { forkJoin } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-channel-finder',
  templateUrl: './channel-finder.component.html',
  styleUrls: ['./channel-finder.component.scss']
})
export class ChannelFinderComponent implements OnInit {
  channelList: any[] = [];
  allChannelList: any[] = [];
  genreList: any[] = [];
  allGenreList: any[] = [];
  genreClicked: boolean = false;
  lastGenreIndex: number = -1;
  mydishtvspacetoken: string;
  loading: boolean;
  isDesktop: boolean = true;
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
  railViewTypeClass: any;
  slickRailViewTypeClass: any;
  isMobileTabletView: boolean;
  userCategory: string;
  platform: string;
  isBrowser: any;
  timer: any;
  constructor(@Inject(PLATFORM_ID) private platformId, private mydishtvspaceservice: MyDishTvSpaceService) {
    this.mydishtvspacetoken = this.mydishtvspaceservice.getEpgToken();
    this.userCategory = this.mydishtvspaceservice.getUserCategory();
    this.platform = this.userCategory == '1' ? 'dishtv' : 'd2h';
    this.loading = true;
    this.isBrowser = isPlatformBrowser(platformId);

  }
  ngOnInit() {
    forkJoin(
      this.mydishtvspaceservice.getChannelsList(this.mydishtvspacetoken),
      this.mydishtvspaceservice.getGenresList(this.mydishtvspacetoken),
    ).subscribe((res: any) => {
      this.channelList = res[0];
      this.allChannelList = this.channelList;
      this.genreList = res[1];
      this.allGenreList = res[1];
      this.loading = false;
    }, error => {
      this.channelList = [];
      this.genreList = [];
      this.loading = false;
    });
    if (this.isBrowser) {



      if (matchMedia('(min-width: 300px)').matches && matchMedia('(max-width: 650px)').matches) {
        this.railConfig.slidesToShow = 5;
        this.railConfig.slidesToScroll = 3;
      }
      if (matchMedia('(min-width: 651px)').matches && matchMedia('(max-width: 760px)').matches) {
        this.railConfig.slidesToShow = 6;
        this.railConfig.slidesToScroll = 3;
      }
    }
  }
  onClickGenre(event, index, el) {
    $('.category-wrapper').removeClass('active');
    this.channelList = this.allChannelList;
    let genres = this.genreList[index].subgenre.toString().toLowerCase().split(',');
    this.channelList = this.allChannelList;
    if (this.lastGenreIndex != index) {
      this.channelList = this.allChannelList.filter(function (channel) {
        return genres.indexOf(channel.channelgenre.toLowerCase()) > -1
      });
      this.lastGenreIndex = index;
      $(el).addClass('active');
    } else {
      this.lastGenreIndex = -1;
    }
  }
  onSearchChange(searchValue: string) {
    if (this.lastGenreIndex >= 0) {
      $('.category-img').removeClass('active');
      this.lastGenreIndex = -1;
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.channelList = this.allChannelList;
      var text = searchValue.trim().toLowerCase();
      var newlist = [];
      if (text.length >= 2) {
        for (var i = 0; i < this.channelList.length; i++) {
          if (this.channelList[i].name.toLowerCase().search(text) >= 0 || this.channelList[i].lcn.toString().search(text) >= 0) {
            newlist.push(this.channelList[i]);
          }
        }
        this.channelList = newlist;
      }
    }, 500);
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
      if (matchMedia('(min-width: 1001px)').matches && matchMedia('(max-width: 1920px)').matches) {
        this.genreList = [];
        setTimeout(() => {
          this.genreList = this.allGenreList;
        }, 0);
        this.railConfig.slidesToShow = 7;
        this.railConfig.slidesToScroll = 5;
      }
      if (matchMedia('(min-width: 651px)').matches && matchMedia('(max-width: 760px)').matches) {
        this.genreList = [];
        setTimeout(() => {
          this.genreList = this.allGenreList;
        }, 0);
        this.railConfig.slidesToShow = 6;
        this.railConfig.slidesToScroll = 3;
      }
    }
  }
}