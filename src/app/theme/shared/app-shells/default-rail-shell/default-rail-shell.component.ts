import { Component, OnInit, Input } from '@angular/core';
import { RailViewType } from '../../models/rail.model';

@Component({
  selector: 'app-default-rail-shell',
  templateUrl: './default-rail-shell.component.html',
  styleUrls: ['./default-rail-shell.component.scss']
})
export class DefaultRailShellComponent implements OnInit {

  @Input()
  viewType: string;

  @Input()
  showCarousel?: boolean = false;

  showLandscape: boolean = false;
  showPortrait: boolean = false;
  showCircle: boolean = false;
  showSquare: boolean = false;
  showIfpCarousel: boolean = false;

  constructor() { }

  ngOnInit() {

    if (this.viewType) {

      if (this.showCarousel) {
        
        this.showCarousel = true;

      } else {

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
        } else {
          this.showLandscape = true;
        }

      }

    } else {
      this.viewType = RailViewType[RailViewType.LANDSCAPE];
      this.showLandscape = true;
    }
  }

}
