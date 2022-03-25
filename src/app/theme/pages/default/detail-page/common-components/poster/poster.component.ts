import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { RailViewType } from '../../../../../shared/models/rail.model';
import { AppUtilService } from '../../../../../shared/services/app-util.service';

@Component({
  selector: 'app-poster',
  templateUrl: './poster.component.html',
  styleUrls: ['./poster.component.scss']
})
export class PosterComponent implements OnInit {

  @Input()
  assetDetail: any;

  @Output()
  playEvent = new EventEmitter<any>()

  @Input()
  showWaterMark: boolean =false;

  isMobileView: boolean;
  isImageLoaded: boolean = false;

  viewType: string;
  isCarousel: boolean;

  @Input()
  channelLogo: string;

  constructor(public appUtilService: AppUtilService) {
    this.viewType = RailViewType[RailViewType.CAROUSEL].toString();
    this.isCarousel = true;
  }

  ngOnInit() {
    if (!this.assetDetail) {
      this.isImageLoaded = true;
    }
    if (matchMedia('(max-width: 992px)').matches) {
      this.isMobileView = true;
      this.viewType = RailViewType[RailViewType.LANDSCAPE].toString();
      this.isCarousel = false;
    } 
  }

  playVideo() {
    this.playEvent.emit();
  }

  imageLoadEvent(event) {
    this.isImageLoaded = true;
  }
  showErrorImage(event) {
    event.target.src = this.appUtilService.getDefaultThumbnail('CAROUSEL')
  }

}
