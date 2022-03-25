import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RailViewType } from '../../../../../shared/models/rail.model';
import { TopCarouselItem } from '../../../../../shared/models/top-carousel.model';


@Component({
  selector: 'app-base',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class
  DetailPageComponent implements OnInit {
  isBrowser;

  topCarouselItems: TopCarouselItem[] = [];
  railViewType = RailViewType;
  ajaxResultTopCarousel = [
    {
      isActive: true,
      id: 0,
      isPremium: true,
      tagLine: 'testMe',
      title: 'dummy title',
      playbackLength: 2000,
      genre: 'Action',
      contentProvider: 'Sony',
      thumbnailURL: 'https://pre00.deviantart.net/e893/th/pre/i/2006/132/b/4/widescreen_dreamy_world_6th_by_grafixeye.jpg',
      contentId: 2721,
      contentType: 'VOD'
    },
    {
      isActive: false,
      id: 1,
      isPremium: false,
      tagLine: 'testMe1',
      title: 'dummy title1',
      playbackLength: 3500,
      genre: 'Anime',
      contentProvider: 'NBC',
      thumbnailURL: 'https://pre00.deviantart.net/4249/th/pre/i/2012/190/7/9/wallpaper_legend_of_korra_intro__widescreen__by_u_no_poo-d56l5kr.png',
      contentId: 3116,
      contentType: 'VOD'
    }, {
      isActive: false,
      id: 2,
      isPremium: false,
      tagLine: 'testMe2',
      title: 'dummy title2',
      playbackLength: 20000,
      genre: 'Nature',
      contentProvider: 'Viacom 18',
      thumbnailURL: 'https://pre00.deviantart.net/a708/th/pre/i/2005/138/6/8/overhang_desolate_widescreen_by_swaroop.jpg',
      contentId: 2721,
      contentType: 'VOD'
    }, {
      isActive: false,
      id: 3,
      isPremium: false,
      tagLine: 'testMe3',
      title: 'dummy title3',
      playbackLength: 500,
      genre: 'Sports',
      contentProvider: 'ESPN',
      thumbnailURL: 'https://pre00.deviantart.net/e893/th/pre/i/2006/132/b/4/widescreen_dreamy_world_6th_by_grafixeye.jpg',
      contentId: 2818,
      contentType: 'VOD'
    }, {
      isActive: false,
      id: 4,
      isPremium: true,
      tagLine: 'testMe4',
      title: 'dummy title4',
      playbackLength: 12000,
      genre: 'Action',
      contentProvider: 'Zee',
      thumbnailURL: 'https://pre00.deviantart.net/e893/th/pre/i/2006/132/b/4/widescreen_dreamy_world_6th_by_grafixeye.jpg',
      contentId: 2642,
      contentType: 'VOD'
    }
  ]

  ajaxResultRails = [
    {
      idx: 3,
      playlistId: 3717,
      title: 'Popular Actors',
      viewType: RailViewType.CIRCLE,
      slideConfig: {
        slidesToShow: 6,
        slidesToScroll: 6,
        infinite: false,
        adaptiveHeight: true,
        speed: 2000
      }
    },
    {
      idx: 1,
      playlistId: 3718,
      title: 'Sports',
      viewType: RailViewType.SQUARE,
      slideConfig: {
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: false,
        speed: 2000
      }
    },
    {
      idx: 2,
      playlistId: 3719,
      title: 'Movies',
      viewType: RailViewType.WIDE_SCREEN_LANDSCAPE,
      slideConfig: {
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: false,
        speed: 2000
      }
    },
    {
      idx: 0,
      playlistId: 3720,
      title: 'Action',
      viewType: RailViewType.WIDE_SCREEN_PORTRAIT,
      slideConfig: {
        slidesToShow: 6,
        slidesToScroll: 6,
        infinite: false,
        speed: 2000
      }
    }
  ]

  railResponse = [
    {
      idx: 3,
      playlistId: 3717,
      title: 'Popular'
    },
    {
      idx: 1,
      playlistId: 3718,
      title: 'Sports'
    },
    {
      idx: 2,
      playlistId: 3719,
      title: 'Movies'
    },
    {
      idx: 0,
      playlistId: 3720,
      title: 'Action'
    },
    {
      idx: 3,
      playlistId: 3717,
      title: 'Popular'
    },
    {
      idx: 1,
      playlistId: 3718,
      title: 'Sports'
    },
    {
      idx: 2,
      playlistId: 3719,
      title: 'Movies'
    },
    {
      idx: 0,
      playlistId: 3720,
      title: 'Action'
    },
    {
      idx: 3,
      playlistId: 3717,
      title: 'Popular'
    },
    {
      idx: 1,
      playlistId: 3718,
      title: 'Sports'
    },
    {
      idx: 2,
      playlistId: 3719,
      title: 'Movies'
    },
    {
      idx: 0,
      playlistId: 3720,
      title: 'Action'
    }
  ]



  slides = [
    { img: "http://placehold.it/350x150/000000" },
    { img: "http://placehold.it/350x150/111111" },
    { img: "http://placehold.it/350x150/333333" },
    { img: "http://placehold.it/350x150/666666" }
  ];
  getConfig: any;
  navScreenId: any;

  constructor(@Inject(PLATFORM_ID) private platformId, private renderer: Renderer2, ) {
    this.isBrowser = isPlatformBrowser(platformId);

  }

  ngOnInit() {
    for (let i = 0; i < 5; i++) {
      // let carouselItem = new TopCarouselItem();
      // carouselItem.id = this.ajaxResultTopCarousel[i].id;
      // carouselItem.isActive = this.ajaxResultTopCarousel[i].isActive;
      // carouselItem.isPremium = this.ajaxResultTopCarousel[i].isPremium;
      // carouselItem.tagLine = this.ajaxResultTopCarousel[i].tagLine;
      // carouselItem.title = this.ajaxResultTopCarousel[i].title;
      // carouselItem.playbackLength = this.ajaxResultTopCarousel[i].playbackLength;
      // carouselItem.genre = this.ajaxResultTopCarousel[i].genre;
      // carouselItem.contentProvider = this.ajaxResultTopCarousel[i].contentProvider;
      // carouselItem.thumbnailURL = this.ajaxResultTopCarousel[i].thumbnailURL;
      // carouselItem.contentId = this.ajaxResultTopCarousel[i].contentId;
      // carouselItem.contentType = this.ajaxResultTopCarousel[i].contentType;

      // this.topCarouselItems.push(carouselItem);
    }

    // for rails
    // sort by index
    this.ajaxResultRails.sort((x, y) => {
      return x.idx - y.idx;
    });

    // if platform is browser, initialize carousel
    if (this.isBrowser) {

    }
  }

  previous(railIdx: number) {


  }

  next(railIdx: number) {

  }

  addJsToElement(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    this.renderer.appendChild(document.body, script);
    return script;
  }

  showTip(idx) {
  }
}
