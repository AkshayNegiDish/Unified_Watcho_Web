import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { EnveuAppService } from '../../../../../shared/services/enveu-app.service';
import { environment } from '../../../../../../../environments/environment';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { CreatorCommand, CreatorsArray, UgcVideosCommand, UgcVideoCommand } from '../../models/home';
import { Router } from '@angular/router';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { ViewPortService } from '../../../../../shared/services/view.port.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UgcVideoPopupComponent } from '../../../../../shared/ugc-video-popup/ugc-video-popup.component';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { BehaviorSubject } from 'rxjs';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

declare var $: any;


@Component({
  selector: 'app-ugc',
  templateUrl: './ugc.component.html',
  styleUrls: ['./ugc.component.scss']
})
export class UgcComponent implements OnInit, AfterViewInit {

  randomColor: string;
  solidColor: any;
  creatorCommandArray: CreatorsArray;
  ugcVideosCommand: UgcVideosCommand;
  slideConfig = {
    infinite: false,
    slidesToScroll: 1,
    slidesToShow: 1,
    speed: 1000,
    draggable: false,
    centerMode: false,
    // vertical: true,
    // verticalSwiping: true,
    arrows: true,
    centerPadding: "50px",
    height: "auto"
  };
  isMobileOrTabletView: boolean = false;
  viewCountObject: any = {};
  creatorVideosPlaylistId: any;
  topCreatorPlaylistId: any;
  pageSize: number = 35;
  pageNo: number = 1;
  creatorPageSize: number = 35;
  creatorPageNo: number = 1;
  videosArray: any[] = [];
  modalRef: any;
  totalVideos: number;
  userAssetDetails: any;
  DMS: any;
  ugcVideosChangeEvent = new BehaviorSubject<any>(null);
  loading: boolean = true;

  constructor(@Inject(DOCUMENT) private dom, private appUtilService: AppUtilService, private snackbarUtilService: SnackbarUtilService,private meta: Meta, private modalService: NgbModal, private viewPortService: ViewPortService, private kalturaUtilService: KalturaUtilService, private enveuAppService: EnveuAppService, private kalturaAppService: KalturaAppService, private router: Router, private platformIdentifierService: PlatformIdentifierService, private titleService: Title) {

    this.randomColor = this.appUtilService.getRandomGreyScaleColor();
    this.solidColor = {
      'background': this.randomColor,
      'text-align': 'center',
      'vertical-align': 'middle',
    };
    this.creatorCommandArray = {
      creatos: []
    }

    this.ugcVideosCommand = {
      ugcVideos: []
    }
  }

  ngOnInit() {
    // $(window).on('load', function () {
    //   $(".carousel").slick({
    //     // arrows: false,
    //     // autoplay: true
    //   });
    // });
    if (this.platformIdentifierService.isBrowser()){
      this.titleService.setTitle("Watch Free Online Movies, TV Shows, Web Series, Shortfilms & News | Watcho")
      if (matchMedia('(max-width: 768px)').matches) {
        this.isMobileOrTabletView = true;
      } else {
        this.isMobileOrTabletView = false;
      }
      this.getScreenConfig(environment.ENVEU.SCREEN_IDS.UGC_VIDEOS);
      this.DMS = this.appUtilService.getDmsConfig();
    } else {
      this.titleService.setTitle("Watch Free UGC Videos, TV Shows, Web Series, Shortfilms & News | Watcho")
      this.meta.updateTag({
        name: 'description',
        content: 'Watch free online streaming of your favourite UGC Videos, Live News updates, web series, movies in Tamil, Telugu, Kannada, Malayalam and much more on Watcho'
      })
      this.addCononicalSEOTags();
    }

  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // $('#slick-slider').slick('refresh');
    // $(window).on('load', function () {
    //   $(window).trigger('resize');
    // });
  }
  // Get screen config for UGC Videos
  getScreenConfig(screenId: string) {
    this.loading = true;
    this.enveuAppService.getLayoutByScreenId(screenId).then((res: any) => {
      if (res.responseCode === 2000) {
        if (res.data.widgets.length > 0) {
          var widgets = res.data.widgets.sort((a, b) => {
            return a.displayOrder - b.displayOrder
          });
          res.data.widgets.forEach((channel, idx) => {
            if (idx === 0) {
              this.creatorVideosPlaylistId = channel.item.playlist.kalturaChannelId;
              this.getCreatorVideos(channel.item.playlist.kalturaChannelId, idx);
            } else if (idx === 1) {
              this.topCreatorPlaylistId = channel.item.playlist.kalturaChannelId;
              this.getCreators(channel.item.playlist.kalturaChannelId, idx);
            }

          })
        }
      }
    }, error => {
      this.loading = false;
    })
  }

  getCreators(id: any, idx: number) {
    this.kalturaAppService.getAssetById(id, this.creatorPageNo, this.creatorPageSize).then(response => {
      if (idx === 1) {
        if (response.objects && response.objects.length > 0) {
          response.objects.forEach((element) => {
            let creatorCommand = new CreatorCommand();

            creatorCommand = {
              name: null,
              id: null,
              type: null,
              nameInitials: null,
              bgColor: {}
            };
            creatorCommand.name = element.name;
            creatorCommand.id = element.id;
            creatorCommand.type = element.type;
            creatorCommand.nameInitials = this.appUtilService.getNameInitials(element, false);
            creatorCommand.bgColor = {
              "background-color": this.appUtilService.getRandomGreyScaleColor()
            }
            this.creatorCommandArray.creatos = [...this.creatorCommandArray.creatos, creatorCommand];
          })
        }
      }
    }, reject => {
    });
  }

  getCreatorVideos(id: any, idx: number, sendVideoToModal?: boolean) {
    this.kalturaAppService.getAssetById(id, this.pageNo, this.pageSize).then(response => {
      if (idx === 0) {
        var assetIdIn: string = "";
        if (response.objects && response.objects.length > 0) {
          response.objects.forEach((element, index) => {
            var ugcVideoCommand: UgcVideoCommand;
            ugcVideoCommand = {
              id: null,
              name: null,
              type: null,
              image: null,
              nameInitials: null,
              bgColor: {},
              portraitImage: null,
              creatorId: null,
              description: null,
              startLikes: 0

            }
            this.totalVideos = response.totalCount;
            ugcVideoCommand.id = element.id;
            ugcVideoCommand.name = element.name;
            ugcVideoCommand.type = element.type;
            ugcVideoCommand.image = this.kalturaUtilService.getImageByOrientation(element.images, "LANDSCAPE", null, null, null, this.viewPortService.isMobile());
            ugcVideoCommand.portraitImage = this.kalturaUtilService.getImageByOrientation(element.images, "PORTRAIT", null, null, null, this.viewPortService.isMobile());
            ugcVideoCommand.nameInitials = this.appUtilService.getNameInitials(element, true);
            ugcVideoCommand.bgColor = {
              "background-color": this.appUtilService.getRandomGreyScaleColor()
            }
            ugcVideoCommand.creatorId = element.tags.SeriesId.objects[0].value;;
            ugcVideoCommand.description = element.description;
            try {
              ugcVideoCommand.startLikes = element.metas.startLikes ? element.metas.startLikes.value : 0;
            } catch(e) {
              
            }
            this.videosArray = [...this.videosArray, element]

            this.ugcVideosCommand.ugcVideos = [...this.ugcVideosCommand.ugcVideos, ugcVideoCommand]
            assetIdIn += element.id + ',';
          })
          if (sendVideoToModal) {
            if (this.modalRef) {
              this.modalRef.componentInstance.ugcVideoChange.next(this.videosArray);
            }
            // this.modalRef.componentInstance.dataRefreshed.next(true);

          }
          this.ugcVideosChangeEvent.next(this.videosArray)
          assetIdIn = assetIdIn.substr(0, assetIdIn.length - 1);
          this.kalturaAppService.getAssetStatistics(assetIdIn, 0, 0).then(res2 => {
            if (res2.objects && res2.objects.length > 0) {
              res2.objects.forEach((element) => {
                this.viewCountObject[element.assetId] = element;
              })
            }
            // this.viewCountObject[res2.id] = 
            this.loading = false;
          }, reject => {
            this.loading = false;
            this.snackbarUtilService.showError(reject.message);
          });
        }

      }

    }, reject => {
      this.loading = false;
      this.snackbarUtilService.showError(reject.message);
    });
  }

  swiped(event) {
    console.log(event)

  }

  slickAfterChange(e, m) {
    if (e.currentSlide > this.ugcVideosCommand.ugcVideos.length - 2) {
      this.getMoreVideos();
    }
  }

  goToAsset(name: any, mediaId: any, type: any) {
    this.appUtilService.getAssetRouteUrl(name, mediaId, null, null, type, null, null, null).subscribe((res) => {
      this.router.navigate([res.url]);
    })
  }

  getMoreVideos(sendVideoToModal?: boolean) {
    this.pageNo = this.pageNo + 1;
    this.getCreatorVideos(this.creatorVideosPlaylistId, 0, sendVideoToModal);
  }

  imageLoadError(event) {
    event.target.src = this.appUtilService.getDefaultThumbnail("LANDSCAPE");
  }

  getMoreCreators() {
    this.creatorPageNo = this.creatorPageNo + 1;
    this.getCreators(this.topCreatorPlaylistId, 1);
  }

  openPlayerModal(index: number) {
    this.modalRef = this.modalService.open(UgcVideoPopupComponent);
    this.modalRef.componentInstance.ugcVideoChange.next(this.videosArray);
    this.modalRef.componentInstance.index = index;
    this.modalRef.componentInstance.totalVideos = this.totalVideos;
    this.modalRef.componentInstance.getMoreVideos.subscribe((receivedEntry) => {
      if (receivedEntry) {
        this.getMoreVideos(true);
      };
    })
  }

  getCreatorDetails(assetId) {
    this.kalturaAppService.getNoOfSeasonInSeries(assetId, this.DMS.params.MediaTypes.UGCCreator, true).then(response => {
      if (response.objects) {
        this.userAssetDetails = response.objects[0];
      }
    }, reject => {
      this.snackbarUtilService.showError(reject.message);
    });
  }

  addCononicalSEOTags() {
    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", "https://www.watcho.com/ugc-videos");
    this.dom.head.appendChild(link);

    let header = this.dom.createElement('h1');
    header.setAttribute('class', 'headerText');
    header.innerHTML = 'Watcho UGC';
    this.dom.body.appendChild(header);
  }

}
