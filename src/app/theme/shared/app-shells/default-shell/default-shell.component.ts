import { Component, OnInit, Input } from '@angular/core';
import { AppUtilService } from '../../services/app-util.service';
declare var $: any;

@Component({
  selector: 'app-default-shell',
  templateUrl: './default-shell.component.html',
  styleUrls: ['./default-shell.component.scss']
})
export class DefaultShellComponent implements OnInit {

  @Input()
  showRails: boolean = true;

  @Input()
  showCarousel: boolean = true;

  @Input()
  showLoader: boolean = true;

  @Input()
  ugcLandscape: boolean = false;

  constructor(private appUtilService: AppUtilService) { }

  ngOnInit() {
    if (this.appUtilService.checkIfPWA()) {
      $(".shell-full-vw").addClass("pwa-margin");
    }
  }

}
