import { Component, OnInit, Input } from '@angular/core';
import { RailViewType } from '../../models/rail.model';

@Component({
  selector: 'app-default-rail-item-shell',
  templateUrl: './default-rail-item-shell.component.html',
  styleUrls: ['./default-rail-item-shell.component.scss']
})
export class DefaultRailItemShellComponent implements OnInit {

  @Input()
  viewType: string;

  showLandscape: boolean = false;
  showPortrait: boolean = false;
  showCircle: boolean = false;
  showSquare: boolean = false;
  showCarousel: boolean = false;
  showIfpCarousel: boolean = false;
  showSeriesBanner: boolean = false;

  constructor() { }

  ngOnInit() {

    if (this.viewType) {

      if (this.viewType.toUpperCase() === RailViewType[RailViewType.LANDSCAPE].toUpperCase()) {
        this.showLandscape = true;
      } else if (this.viewType.toUpperCase() === RailViewType[RailViewType.PORTRAIT].toUpperCase()) {
        this.showPortrait = true;
      } else if (this.viewType.toUpperCase() === RailViewType[RailViewType.CAROUSEL].toUpperCase()) {
        this.showCarousel = true;
      } else if (this.viewType.toUpperCase() === RailViewType[RailViewType.CIRCLE].toUpperCase()) {
        this.showCircle = true;
      } else if (this.viewType.toUpperCase() === RailViewType[RailViewType.SQUARE].toUpperCase()) {
        this.showSquare = true;
      } else if (this.viewType.toUpperCase() === RailViewType[RailViewType.UGCIFP].toUpperCase()) {
        this.showIfpCarousel = true;
      } else if (this.viewType.toUpperCase() === RailViewType[RailViewType.SERIESBANNER].toUpperCase()) {
        this.showSeriesBanner = true;
      } else {
        this.showLandscape = true;
      }

    } else {
      this.viewType = RailViewType[RailViewType.LANDSCAPE];
      this.showLandscape = true;
    }
  }

}
