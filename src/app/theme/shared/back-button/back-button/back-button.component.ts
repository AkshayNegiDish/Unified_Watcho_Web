import { Component, OnInit } from '@angular/core';
import { AppUtilService } from '../../services/app-util.service';
declare var window: any;

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnInit {
  showBackButton: boolean;

  constructor(private appUtilService : AppUtilService) { }

  ngOnInit() {

    if (this.appUtilService.checkIfPWA()) {
      this.showBackButton = true;
    } else {
      this.showBackButton = false;
    }

  }
  goToPreviousPage() {
    window.history.back();
  }

}
