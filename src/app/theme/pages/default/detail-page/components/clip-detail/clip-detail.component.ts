import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { environment } from '../../../../../../../environments/environment';
import { ModalMessageService } from '../../../../../shared/services/modal-message.service';

@Component({
  selector: 'app-clip-detail',
  templateUrl: './clip-detail.component.html',
  styleUrls: ['./clip-detail.component.scss']
})
export class ClipDetailComponent implements OnInit {

  assetId: number;
  assetDetails: any;
  titleService: any;
  screenId: string;
  showPlayer: boolean = false;
  isDetailPage: boolean;
  DMS: any;
  isAssetInWatchlist: boolean = false;
  reinitiatePlayer: boolean = true;

  constructor(private route: ActivatedRoute, private kalturaAppService: KalturaAppService, public kalturaUtilService: KalturaUtilService,
    private router: Router, private appUtilService: AppUtilService, private modalMessageService: ModalMessageService) {
    this.isDetailPage = true;

    //  // override the route reuse strategy
    //  this.router.routeReuseStrategy.shouldReuseRoute = function () {
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

    this.modalMessageService.messageCommonObj$.subscribe((res: boolean) => {
      if (!res) {
        this.reinitiatePlayer = true;
      } else {
        this.reinitiatePlayer = false;
      }
    })
  }

  ngOnInit() {
    this.DMS = this.appUtilService.getDmsConfig('clip');
    this.screenId = environment.ENVEU.SCREEN_IDS.CLIP_DETAIL;
    if (this.route.data["value"]["play"]) {
      this.showPlayer = true;
    } else {
      this.showPlayer = false;
    }
    try {
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.assetId = +params.get('assetId');
        this.getAssetDetails(this.assetId.toString());
      })
    } catch (error) {

    }
  }

  getAssetDetails(assetId: string) {
    this.kalturaAppService.getMediaAssetById(assetId).then((res: any) => {
      this.assetDetails = res;
      //  this.titleService.setTitle("WatchO | " + this.assetDetails.name)
    }, reject => {

    })
  }

  ngOnDestroy() {
    // this.titleService.setTitle("Watcho")
  }

  // play event from poster play button
  playEvent() {
    this.router.navigateByUrl(this.router.url + "/play");
  }

  isInWatchlist(event) {
    this.isAssetInWatchlist = event;
  }

}
