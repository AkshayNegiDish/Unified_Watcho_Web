import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import {SnackbarUtilService} from '../../../../../shared/services/snackbar-util.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {isPlatformBrowser} from '@angular/common';
import {AppConstants} from '../../../../../shared/typings/common-constants';
import {OfferCommand} from '../../models/recharge.model';

@Component({
  selector: 'app-selected-offer-info-modal',
  templateUrl: './selected-offer-info-modal.component.html',
  styleUrls: ['./selected-offer-info-modal.component.scss']
})
export class SelectedOfferInfoModalComponent implements OnInit {

  isBrowser: any;
  isD2hUser: boolean;
  isDishUser: boolean;

  selectedOffer: OfferCommand;

  constructor(@Inject(PLATFORM_ID) private platformId, private snackbar: SnackbarUtilService, public activeModal: NgbActiveModal, private modalService: NgbModal) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isD2hUser = false;
    this.isDishUser = false;
    this.selectedOffer = {
      OfferAmount: null,
      OfferDiscription: null,
      OfferID: null,
      OfferName: null,
      offerIndex: null
    };
  }

  ngOnInit() {
    if (this.isBrowser) {
      const userCategory = Number(localStorage.getItem(AppConstants.USER_CATEGORY));
      if (userCategory === 1) {
        this.isDishUser = true;
      } else if (userCategory === 2) {
        this.isD2hUser = true;
      } else {
        this.isD2hUser = false;
        this.isDishUser = false;
      }
    }
  }

  availOffer() {
    this.activeModal.close(this.selectedOffer);
  }

}
