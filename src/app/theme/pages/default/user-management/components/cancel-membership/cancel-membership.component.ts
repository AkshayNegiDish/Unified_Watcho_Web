import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserFormService } from '../../services/user-form.service';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { CancelPaytmSubscriptionCommand, CancelPayTMRequestBody, CancelSvodRequestCommand, CancelSubscriptionRequestCommand } from '../../models/subscription.model';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-cancel-membership',
  templateUrl: './cancel-membership.component.html',
  styleUrls: ['./cancel-membership.component.scss']
})
export class CancelMembershipComponent implements OnInit {

  loading: boolean;
  isSubscriptionCanceledSussessfully: boolean;
  cancelSvodequestCommand: CancelSvodRequestCommand;
  cancelPaytmSubscriptionCommand: CancelPaytmSubscriptionCommand;
  cancelPaytmRequestBody: CancelPayTMRequestBody;
  cancelSubscriptionRequestCommand: CancelSubscriptionRequestCommand;
  checkStatusFromPaytm: string;

  constructor(private _router: Router, private snackbar: SnackbarUtilService, public activeModal: NgbActiveModal, private modalService: NgbModal,
    private userFormService: UserFormService, private appUtilService: AppUtilService) {
    this.loading = false;
    this.isSubscriptionCanceledSussessfully = false;
    this.cancelSvodequestCommand = {
      OTTSubscriberID: null,
      PaymentGatewayID: 'PAYTM',
      Source: 'WEB',
      SubscriptionParam: { TokenType: "AES", ChannelId: environment.SVOD_PAYTM.CHANNEL_ID }
    }
    this.cancelPaytmRequestBody = {
      mid: environment.SVOD_PAYTM.MID,
      subsId: null
    }
    this.cancelPaytmSubscriptionCommand = {
      body: this.cancelPaytmRequestBody,
      head: { tokenType: "AES", signature: null }
    }

    this.cancelSubscriptionRequestCommand = {
      OTTSubscriberID: null,
      PaymentGatewayID: 'PAYTM',
      Source: 'WEB',
      Status: null
    }
  }

  ngOnInit() {
    // this.activeModal.close()
  }

  cancelAutoRenewal() {
    this.loading = true;
    const userSmsDetails = this.appUtilService.getLoggedInUserSMSDetails();
    this.userFormService.cancelAutoRenewal(userSmsDetails.OTTSubscriberID).subscribe((res: any) => {
      this.loading = false;
      if (res.ResultCode === 0) {
        this.isSubscriptionCanceledSussessfully = true;
      } else {
        this.isSubscriptionCanceledSussessfully = false;
        this.snackbar.showError(res.ResultDesc);
      }
    }, (error) => {
      console.error(error);
      this.loading = false;
      this.snackbar.showError();
    });
  }

  continueToWatcho() {
    this.activeModal.close(this.isSubscriptionCanceledSussessfully);
  }

  cancelSubscription() {
    this.loading = true;
    const userSmsDetails = this.appUtilService.getLoggedInUserSMSDetails();
    this.cancelSvodequestCommand.OTTSubscriberID = userSmsDetails.OTTSubscriberID;
    this.userFormService.initateCancelSubscriptionRequest(this.cancelSvodequestCommand).subscribe((res: any) => {
      if (res.ResultCode === 0) {
        this.loading = true;
        this.cancelPaytmSubscriptionCommand.body.subsId = res.Result.SubscriptionParam.SubscriptionID;
        this.cancelPaytmSubscriptionCommand.head.signature = res.Result.PaymentGatewayToken;
        this.cancelPaytmSubscription();
      } else {
        this.loading = false;
        this.snackbar.showError(res.ResultDesc);
        this.isSubscriptionCanceledSussessfully = false;
      }
    }, (error) => {
      this.loading = false;
      this.isSubscriptionCanceledSussessfully = false;
      console.log(error);
    });
  }

  cancelPaytmSubscription() {
    this.loading = true;
    const userSmsDetails = this.appUtilService.getLoggedInUserSMSDetails();
    this.userFormService.cancelPaytmSubscription(this.cancelPaytmSubscriptionCommand).subscribe((resfrompaytm: any) => {
      this.checkStatusFromPaytm = resfrompaytm.body.resultInfo.code === '200' ? 'SUCCESS' : 'FAILED';
      if (resfrompaytm.body.resultInfo.code === '200') {
        this.loading = false;
        this.cancelSubscriptionRequestCommand.OTTSubscriberID = userSmsDetails.OTTSubscriberID;
        this.cancelSubscriptionRequestCommand.Status = this.checkStatusFromPaytm;
        this.cancelSubscriptionRequest();
      } else {
        this.loading = false;
        this.snackbar.showError(resfrompaytm.resfrompaytm.body.resultInfo.message);
        this.isSubscriptionCanceledSussessfully = false;
      }
    }, (error) => {
      this.loading = false;
      this.isSubscriptionCanceledSussessfully = false;
      console.log(error);
    });
  }

  cancelSubscriptionRequest() {
    this.loading = true;
    this.userFormService.cancelSubscriptionRequest(this.cancelSubscriptionRequestCommand).subscribe((responsecancel: any) => {
      if (responsecancel.ResultCode === 0) {
        this.loading = false;
        this.isSubscriptionCanceledSussessfully = true;
        // this.snackbar.showSnackbar("Subscription is cancelled successfully");
      } else {
        this.loading = false;
        this.snackbar.showError(responsecancel.ResultDesc);
        this.isSubscriptionCanceledSussessfully = false;
      }
    }, (error) => {
      this.loading = false;
      this.isSubscriptionCanceledSussessfully = false;
      console.log(error);
    });
  }

}
