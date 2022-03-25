import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFormService } from '../../services/user-form.service';
import { UpdatePaytmPaymentStatusCommand } from '../../models/subscription.model';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { AppUtilService } from '../../../../../shared/services/app-util.service';

@Component({
  selector: 'app-paytm-payment-status',
  templateUrl: './paytm-payment-status.component.html',
  styleUrls: ['./paytm-payment-status.component.scss']
})
export class PaytmPaymentStatusComponent implements OnInit {

  paymentStatusCode: number;
  paymentStatusText: string;

  loading: boolean;
  paymentSuccessCode = Number('01');
  userSmsDetails: any;
  isPaymentSuccessfull: boolean;
  updatePaytmPaymentStatusCommand = new UpdatePaytmPaymentStatusCommand();
  paymentMode: string = null;
  txnDate: any = null;
  pgResponse: any;


  constructor(private _router: Router, private _activatedRoute: ActivatedRoute,
    private userFormService: UserFormService, private snackbar: SnackbarUtilService, private appUtilService: AppUtilService) {
    this.isPaymentSuccessfull = null;
    this.updatePaytmPaymentStatusCommand = {
      TotalPayableAmount: null,
      OrderID: null,
      TransactionNo: null,
      OTTSubscriberID: null,
      Status: null,
      SubscriptionID: null,
      AutoRenewalStatus: null,
      PaymentGatewayToken: null,
      PGResponse: null
    };
    this.pgResponse = null;
  }

  ngOnInit() {
    try {
      this.loading = true;
      this.userSmsDetails = this.appUtilService.getLoggedInUserSMSDetails();
      this.pgResponse = this._activatedRoute.snapshot.queryParams;
      this.paymentStatusText = this._activatedRoute.snapshot.queryParams['STATUS'];
      this.paymentMode = this.pgResponse.PAYMENTMODE ? this.pgResponse.PAYMENTMODE : '';
      this.txnDate = this.pgResponse.TXNDATE ? this.pgResponse.TXNDATE : '';
      this.paymentStatusCode = Number(this.pgResponse.RESPCODE);
      this.updatePaytmPaymentStatusCommand.Status = this.paymentStatusCode === this.paymentSuccessCode ? 'success' : 'failure';
      this.updatePaytmPaymentStatusCommand.OrderID = this.pgResponse.ORDERID;
      this.updatePaytmPaymentStatusCommand.TransactionNo = this.pgResponse.TXNID;
      this.updatePaytmPaymentStatusCommand.TotalPayableAmount = Number(this.pgResponse.TXNAMOUNT);
      this.updatePaytmPaymentStatusCommand.SubscriptionID = this.pgResponse.SUBS_ID ? this.pgResponse.SUBS_ID : null;
      this.updatePaytmPaymentStatusCommand.AutoRenewalStatus = "true"
      this.updatePaytmPaymentStatusCommand.PaymentGatewayToken = "PAYTM";
      this.updatePaytmPaymentStatusCommand.PGResponse = this.pgResponse.RESPCODE + '|' + this.updatePaytmPaymentStatusCommand.Status + '|' + this.pgResponse.ORDERID + '|' + this.pgResponse.TXNAMOUNT + '|' + this.paymentMode + '|' + this.pgResponse.TXNID + '|' + this.txnDate + '|';
      this.updatePaytmPaymentStatusCommand.OTTSubscriberID = this.userSmsDetails.OTTSubscriberID;
      if (this.pgResponse.STATUS === 'TXN_SUCCESS') {
        this.isPaymentSuccessfull = true;
        this.gtmTagEventButtonClickPaymentSuccessFailure('payment_success');
        this.moEngageTrackingForPaymentSuccess();
      } else {
        this.isPaymentSuccessfull = false;
        this.gtmTagEventButtonClickPaymentSuccessFailure('payment_failure');
      }
      if (this.paymentStatusCode === this.paymentSuccessCode) {
        this.userFormService.updatePaymentStatus(this.updatePaytmPaymentStatusCommand).subscribe((res: any) => {
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

    } catch (e) {
      console.error(e);
      this.isPaymentSuccessfull = false;
      this.loading = false;
      this.snackbar.showError();
    }

  }

  proceed() {
    this._router.navigateByUrl('/user/membershipandplans');
  }

  gtmTagEventButtonClickPaymentSuccessFailure(eventName?, paymentType?, orderId?, amount?) {
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
      recharge_amount: this.updatePaytmPaymentStatusCommand.TotalPayableAmount,
      transaction_no: this.updatePaytmPaymentStatusCommand.TransactionNo,
      plan_type: null
    }
    this.appUtilService.moEngageEventTracking('Recharge_Success', attribute);
  }
}
