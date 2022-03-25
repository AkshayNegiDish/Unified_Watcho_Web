import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TopCarouselItem } from '../../models/top-carousel.model';
import { AppPages } from '../../typings/common-constants';
import { PlatformIdentifierService } from '../../services/platform-identifier.service';
import { AppUtilService } from '../../services/app-util.service';
import { CarouselIndicators, ImageTypeNames } from '../../typings/enveu-constants';

declare var $: any;

@Component({
  selector: 'app-top-carousel-item',
  templateUrl: './carousel-item.component.html',
  styleUrls: ['./carousel-item.component.scss']
})
export class CarouselItemComponent implements OnInit {
  @Input()
  carouselItemData: any;

  @Input()
  placement: AppPages;

  @Input()
  carouselDots: string = null;

  @Output()
  itemDetails = new EventEmitter<any>();

  @Input()
  viewType: string;

  @Input()
  dotsPlacement: string;

  @Input()
  showHeader?: boolean = false;

  @Input()
  channelName: string;

  item_id: string;

  isBrowser;

  imageUrl: string;

  placementType = AppPages;
  thumbnailUrl: string;
  slideConfig = {
    infinite: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    speed: 1000,
    draggable: true,
    centerMode: true,
    variableWidth: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnFocus: false,
    pauseOnHover: false,
    dots: this.dotsPlacement === CarouselIndicators[CarouselIndicators.HDN] ? false : true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          centerPadding: '60px',
          arrows: false,

        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          centerPadding: '10px',
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,

          centerPadding: '10px',
        }
      }
    ]
  };

  carouselType: string = "";
  isMobileView: boolean = false;
  isLDS2: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId, private router: Router, private platformIdentifierService: PlatformIdentifierService, public appUtilService: AppUtilService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    console.log(this.carouselItemData)
    if (matchMedia('(max-width: 768px)').matches) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    }
    if (this.isMobileView) {
      if (this.viewType === 'LANDSCAPE') {
        this.carouselType = "banner-carousel";
      } else if (this.viewType === ImageTypeNames[ImageTypeNames.SQUARE]) {
        this.carouselType = "square-carousel"
      } else if (this.viewType === ImageTypeNames[ImageTypeNames.CIRCLE]) {
        this.carouselType = "circle-carousel"
      } else if (this.viewType === ImageTypeNames[ImageTypeNames.PORTRAIT_2_3] || this.viewType === "PORTRAIT") {
        this.carouselType = "portrait-carousel"
      }
    } else {
      if (this.viewType === ImageTypeNames[ImageTypeNames.LANDSCAPE_120_37].toString()) {
        this.carouselType = "carousel-120";
        this.isLDS2 = true;
      } else {
        this.carouselType = ""
        this.isLDS2 = false;
      }
    }
    $('#main-carousel').carousel({
      interval: 4000,
      cycle: true
    });
    this.item_id = 'top_carousel_item' + this.carouselItemData.id;

    if (this.isBrowser) {
      // if (this.carouselDots === CarouselDots[CarouselDots.BOT].toString()) {
      // $(".slick-dots").css("bottom", "-5px")
    }
    // this.safeThumbnailURL = this.sanitizer.bypassSecurityTrustStyle();
    // let img = new Image();
    // this.thumbnailUrl = "https://res.cloudinary.com/dialog-qa/image/fetch/f_auto,q_60/" + this.carouselItemData.thumbnailURL;
    // // img.s
    // $(document).ready(() => {
    //   $('#' + this.item_id + ' .top-carousel-item-container').css('background-image', 'url(\"' + "https://res.cloudinary.com/dialog-qa/image/fetch/f_auto,q_60/" + this.carouselItemData.thumbnailURL + '\")');
    // });
  }

  // if(screen.width < 992) {
  //   $('#main-carousel').carousel({
  //     interval: 2400,
  //     cycle: true
  //   });
  // }


  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    $('#slick-slider').slick('refresh');
  }

  watchAsset(item, i) {
    item.index = i;
    this.itemDetails.emit(item);

  }

  // getContinueWatchingPosition(assetId: number): number {
  //   let position: number = 0;
  //   if (this.kalturaAssetHistoryListResponse) {
  //     try {
  //       this.kalturaAssetHistoryListResponse.objects.forEach(element => {
  //         if (element.assetId === assetId) {
  //           position = element.position;
  //         }
  //       });
  //     } catch (error) {

  //     }
  //   }
  //   return position;
  // }
}
