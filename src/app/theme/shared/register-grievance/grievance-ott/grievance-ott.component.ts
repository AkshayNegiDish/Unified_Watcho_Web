import { Component, OnInit } from '@angular/core';
import { PlatformIdentifierService } from '../../services/platform-identifier.service';
declare var $: any;

@Component({
  selector: 'app-grievance-ott',
  templateUrl: './grievance-ott.component.html',
  styleUrls: ['./grievance-ott.component.scss']
})
export class GrievanceOttComponent implements OnInit {
  isShowFullRegisterGrievancePage: boolean = false;
  containerClass: string = 'container';

  constructor(private platformIdentifierService: PlatformIdentifierService) { }

  ngOnInit() {
    if (this.platformIdentifierService.isBrowser()) {
      if(location.pathname.split("/").length >= 2) {
        if(location.pathname.split("/")[1] === "mobile") {
          this.containerClass = 'container mobapp-container';
          this.isShowFullRegisterGrievancePage = true;
          $('body').css('background-color', '#ffffff');
        } else {
          this.containerClass = 'container';
          $('body').css('background-color', '#141414');
          this.isShowFullRegisterGrievancePage = false;
        }
      }
    }
  }

  scrollToElement($element): void {
    if (this.platformIdentifierService.isBrowser()) {
      $('div#' + $element)[0].scrollIntoView({behavior: "smooth", block: "center", inline: 'end'});
    }
  }
}
