import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatformIdentifierService } from '../services/platform-identifier.service';

declare var $: any;

@Component({
  selector: 'app-download-modal',
  templateUrl: './app-download.component.html',
  styleUrls: ['./app-download.component.scss']
})
export class AppDownloadComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private platformIdentifierService: PlatformIdentifierService) { }

  ngOnInit() {
    if(this.platformIdentifierService.isBrowser() ) {
      $( ".appDownlaodModal" ).parent().parent().parent().css( "margin-top", "25%" );
      $( ".appDownlaodModal" ).parent().parent().css( "border-radius","5px" );
    }
  }

}
