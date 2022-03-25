import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUtilService } from '../services/app-util.service';
import { PlatformIdentifierService } from '../services/platform-identifier.service';
declare var $: any;
@Component({
  selector: 'app-register-grievance',
  templateUrl: './register-grievance.component.html',
  styleUrls: ['./register-grievance.component.scss']
})
export class RegisterGrievanceComponent implements OnInit {
  isShowFullRegisterGrievancePage: boolean = false;

  constructor(private platformIdentifierService: PlatformIdentifierService, private router: Router) { }

  ngOnInit() {
    if (this.platformIdentifierService.isBrowser()) {
      if(location.pathname.split("/").length >= 2) {
        if(location.pathname.split("/")[1] === "mobile") {
          $('body').css('background-color', '#141414');
          this.isShowFullRegisterGrievancePage = true;
        } else {
          $('body').css('background-color', '#141414');
          this.isShowFullRegisterGrievancePage = false;
        }
      }
    }
  }

  viewOTTContact() {
    if (this.isShowFullRegisterGrievancePage) {
      $('body').css('background-color', '#ffffff');
      this.router.navigate(['/mobile/registergrievance/grievance-ott']);
    } else {
      $('body').css('background-color', '#141414');
      this.router.navigate(['/registergrievance/grievance-ott']);
    }
  }

  viewSocialMediaContent() {
    if (this.isShowFullRegisterGrievancePage) {
      $('body').css('background-color', '#ffffff');
      this.router.navigate(['/mobile/registergrievance/grievance-social-media']);
    } else {
      $('body').css('background-color', '#141414');
      this.router.navigate(['/registergrievance/grievance-social-media']);
    }
  }
}
