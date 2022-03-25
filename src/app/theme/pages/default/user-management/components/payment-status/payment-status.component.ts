import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserFormService} from '../../services/user-form.service';
import {UpdatePaymentStatusCommand} from '../../models/subscription.model';
import {SnackbarUtilService} from '../../../../../shared/services/snackbar-util.service';
import {AppUtilService} from '../../../../../shared/services/app-util.service';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent implements OnInit {

  paymentStatusCode: number;
  paymentStatusText: string;

  loading: boolean;
  paymentSuccessCode = Number('0300');
  userSmsDetails: any;
  isPaymentSuccessfull: boolean;
  updatePaymentStatusCommand = new UpdatePaymentStatusCommand();

  pgResponse: string;
  pgResponseArray: string[];

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute,
              private userFormService: UserFormService, private snackbar: SnackbarUtilService, private appUtilService: AppUtilService) {
    this.isPaymentSuccessfull = null;
    this.updatePaymentStatusCommand = {
      TotalPayableAmount: null,
      OrderID: null,
      TransactionNo: null,
      OTTSubscriberID: null,
      Status: null,
      PGResponse: null
    };
    this.pgResponse = null;
    this.pgResponseArray = [];
  }

  ngOnInit() {
    try {
      this.loading = true;
      this.userSmsDetails = this.appUtilService.getLoggedInUserSMSDetails();
      this.pgResponse = this._activatedRoute.snapshot.queryParams['msg'];
      console.log(this.pgResponse);
      if (this.pgResponse) {
        this.pgResponseArray = this.pgResponse.split('|');
      }

      if (this.pgResponse) {
        this.paymentStatusCode = Number(this.pgResponseArray[0]);
        this.paymentStatusText = this.pgResponseArray[1];
        this.updatePaymentStatusCommand.Status = this.paymentStatusCode === this.paymentSuccessCode?'success':'failure';
        this.updatePaymentStatusCommand.OrderID = this.pgResponseArray[3];
        this.updatePaymentStatusCommand.TransactionNo = this.pgResponseArray[5];
        this.updatePaymentStatusCommand.TotalPayableAmount = Number(this.pgResponseArray[6]);
        this.updatePaymentStatusCommand.PGResponse = this.pgResponse;
      } else {
        this.updatePaymentStatusCommand.OrderID = this._activatedRoute.snapshot.queryParams['oId'];
        this.updatePaymentStatusCommand.TotalPayableAmount = Number(this._activatedRoute.snapshot.queryParams['amt']);
      }
      this.updatePaymentStatusCommand.OTTSubscriberID = this.userSmsDetails.OTTSubscriberID;
      if (!this.paymentStatusCode) {
        if (Number(this._activatedRoute.snapshot.queryParams['success'])) {
          this.isPaymentSuccessfull = true;
          this.gtmTagEventButtonClickPaymentSuccessFailure('payment_success');
          this.moEngageTrackingForPaymentSuccess();
        } else {
          this.isPaymentSuccessfull = false;
          this.gtmTagEventButtonClickPaymentSuccessFailure('payment_failure');
        }
        this.loading = false;
        return;
      }
      if (this.paymentStatusCode === this.paymentSuccessCode) {
        this.userFormService.updatePaymentStatus(this.updatePaymentStatusCommand).subscribe((res: any) => {
          if (res.ResultCode === 0) {
            this.isPaymentSuccessfull = true;
            this.gtmTagEventButtonClickPaymentSuccessFailure('payment_success');
          } else {
            this.isPaymentSuccessfull = false;
            this.gtmTagEventButtonClickPaymentSuccessFailure('payment_failure');
            this.snackbar.showError(res.ResultDesc);
          }
          this.loading = false;
        }, (error) => {
          console.error(error);
          this.isPaymentSuccessfull = false;
          this.loading = false;
          this.gtmTagEventButtonClickPaymentSuccessFailure('payment_failure');
          this.snackbar.showError();
        });
      } else {
        this.loading = false;
        this.isPaymentSuccessfull = false;
        console.error('Payment Error');
      }

    } catch(e) {
      console.error(e);
      this.isPaymentSuccessfull = false;
      this.loading = false;
      this.snackbar.showError();
    }

  }

  proceed() {
    this._router.navigateByUrl('/user/membershipandplans');
  }

  gtmTagEventButtonClickPaymentSuccessFailure( eventName?, paymentType?, orderId?, amount?) {
    let dataLayerJson: any;
    dataLayerJson = {
      'type': this.appUtilService.getUserTypeAsName(),
      'userid': Math.ceil(new Date().getTime() / 1000)
    };
    this.appUtilService.getGTMTag(dataLayerJson, eventName);
  }

  moEngageTrackingForPaymentSuccess() {
    var attribute = {
      user_type: this.appUtilService.getUserTypeAsName(),
      recharge_amount: this.updatePaymentStatusCommand.TotalPayableAmount,
      transaction_no: this.updatePaymentStatusCommand.TransactionNo,
      plan_type: null
    }
    this.appUtilService.moEngageEventTracking('Recharge_Success', attribute);
  }
}
