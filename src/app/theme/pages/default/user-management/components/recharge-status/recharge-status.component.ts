import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { UserFormService } from '../../services/user-form.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { AppConstants } from '../../../../../shared/typings/common-constants';
import { isPlatformBrowser } from '@angular/common';
import { UpdatePaymentStatusRechargeCommand, PaytmResponseCommand, PaytmResponse } from '../../models/recharge.model';

declare var $: any;
declare var document: any;

@Component({
  selector: 'app-recharge-status',
  templateUrl: './recharge-status.component.html',
  styleUrls: ['./recharge-status.component.scss']
})
export class RechargeStatusComponent implements OnInit {

  paymentStatusCode: any;
  paymentStatusText: string;
  userSmsDetails: any;
  loading: boolean;
  isBrowser: any;
  isD2hUser: boolean;
  isDishUser: boolean;
  isMobileView: boolean;

  paymentSuccessCode = '01';
  isPaymentSuccessfull: boolean;
  updatePaymentStatusCommand = new UpdatePaymentStatusRechargeCommand();

  pgResponse: string;
  pgResponseArray: string[];

  dishd2hSubscriberID: any;
  transactionDate: any;

  isTransactionDateValid: boolean;
  paytmResponseCommand: PaytmResponseCommand;
  PaytmResponse: PaytmResponse;


  constructor(@Inject(PLATFORM_ID) private platformId, private _router: Router, private _activatedRoute: ActivatedRoute,
    private userFormService: UserFormService, private snackbar: SnackbarUtilService, private appUtilService: AppUtilService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isD2hUser = false;
    this.isDishUser = false;
    this.isPaymentSuccessfull = null;
    this.updatePaymentStatusCommand = {
      Amount: null,
      OrderID: null,
      TransactionNo: null,
      OTTSubscriberID: null,
      Status: null,
      PGResponse: null,
      DishD2HCustomerID: null
    };
    this.pgResponse = null;
    this.pgResponseArray = [];
    this.loading = false;
    this.dishd2hSubscriberID = null;
    this.transactionDate = null;
    this.isTransactionDateValid = false;
    this.paytmResponseCommand = {
      ORDERID: null,
      MID: null,
      TXNID: null,
      TXNAMOUNT: null,
      PAYMENTMODE: null,
      CURRENCY: null,
      TXNDATE: null,
      STATUS: null,
      RESPCODE: null,
      RESPMSG: null,
      GATEWAYNAME: null,
      BANKTXNID: null,
      BANKNAME: null,
      CHECKSUMHASH: null

    }
  }

  ngOnInit() {
    this.loading = true;
    if (this.isBrowser) {
      const userCategory = Number(localStorage.getItem(AppConstants.USER_CATEGORY));
      if (userCategory === 1) {
        this.isDishUser = true;
      } else if (userCategory === 2) {
        this.isD2hUser = true;
      } else {
        this._router.navigateByUrl('/');
      }
      this.userSmsDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
    }

    try {
      this._activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
        if (params.get(PaytmResponse[PaytmResponse.ORDERID])) {
          this.paytmResponseCommand.ORDERID = params.get(PaytmResponse[PaytmResponse.ORDERID])
        }
        if (params.get(PaytmResponse[PaytmResponse.BANKNAME])) {
          this.paytmResponseCommand.BANKNAME = params.get(PaytmResponse[PaytmResponse.BANKNAME])
        }
        if (params.get(PaytmResponse[PaytmResponse.BANKTXNID])) {
          this.paytmResponseCommand.BANKTXNID = params.get(PaytmResponse[PaytmResponse.BANKTXNID])
        }
        if (params.get(PaytmResponse[PaytmResponse.CHECKSUMHASH])) {
          this.paytmResponseCommand.CHECKSUMHASH = params.get(PaytmResponse[PaytmResponse.CHECKSUMHASH])
        }
        if (params.get(PaytmResponse[PaytmResponse.CURRENCY])) {
          this.paytmResponseCommand.CURRENCY = params.get(PaytmResponse[PaytmResponse.CURRENCY])
        }
        if (params.get(PaytmResponse[PaytmResponse.GATEWAYNAME])) {
          this.paytmResponseCommand.GATEWAYNAME = params.get(PaytmResponse[PaytmResponse.GATEWAYNAME])
        }
        if (params.get(PaytmResponse[PaytmResponse.MID])) {
          this.paytmResponseCommand.MID = params.get(PaytmResponse[PaytmResponse.MID])
        }
        if (params.get(PaytmResponse[PaytmResponse.PAYMENTMODE])) {
          this.paytmResponseCommand.PAYMENTMODE = params.get(PaytmResponse[PaytmResponse.PAYMENTMODE])
        }
        if (params.get(PaytmResponse[PaytmResponse.RESPCODE])) {
          this.paytmResponseCommand.RESPCODE = params.get(PaytmResponse[PaytmResponse.RESPCODE])
        }
        if (params.get(PaytmResponse[PaytmResponse.RESPMSG])) {
          this.paytmResponseCommand.RESPMSG = params.get(PaytmResponse[PaytmResponse.RESPMSG])
        }
        if (params.get(PaytmResponse[PaytmResponse.STATUS])) {
          this.paytmResponseCommand.STATUS = params.get(PaytmResponse[PaytmResponse.STATUS])
        }
        if (params.get(PaytmResponse[PaytmResponse.TXNAMOUNT])) {
          this.paytmResponseCommand.TXNAMOUNT = params.get(PaytmResponse[PaytmResponse.TXNAMOUNT])
        }
        if (params.get(PaytmResponse[PaytmResponse.TXNDATE])) {
          this.paytmResponseCommand.TXNDATE = params.get(PaytmResponse[PaytmResponse.TXNDATE])
        }
        if (params.get(PaytmResponse[PaytmResponse.TXNID])) {
          this.paytmResponseCommand.TXNID = params.get(PaytmResponse[PaytmResponse.TXNID])
        }
      })
      // this.pgResponse = this._activatedRoute.snapshot.queryParams['msg'];
      // this.dishd2hSubscriberID = this._activatedRoute.snapshot.queryParams['id'];
      // if (this.pgResponse) {
      //   this.pgResponseArray = this.pgResponse.split('|');
      //   this.paymentStatusCode = this.pgResponseArray[0];
      // }

      if (Number(this.paytmResponseCommand.RESPCODE) == Number(this.paymentSuccessCode)) {
        let date = new Date(this.paytmResponseCommand.TXNDATE);
        if (isNaN(date.getTime())) {
          this.isTransactionDateValid = false;
        } else {
          this.isTransactionDateValid = true;
        }
        var url = location.href;
        var responsePayload = url.substring(url.indexOf("?") + 1);
        this.transactionDate = this.paytmResponseCommand.TXNDATE;
        this.paymentStatusCode = this.paytmResponseCommand.RESPCODE;
        this.paymentStatusText = this.paytmResponseCommand.RESPMSG;
        this.updatePaymentStatusCommand.Status = 'success';
        this.updatePaymentStatusCommand.OrderID = this.paytmResponseCommand.ORDERID;
        this.updatePaymentStatusCommand.TransactionNo = this.paytmResponseCommand.TXNID;
        this.updatePaymentStatusCommand.Amount = +this.paytmResponseCommand.TXNAMOUNT;
        this.updatePaymentStatusCommand.PGResponse = responsePayload;
        this.updatePaymentStatusCommand.OTTSubscriberID = this.userSmsDetails.OTTSubscriberID;
        // FIXME: required info from backend about the expectations 
        this.updatePaymentStatusCommand.DishD2HCustomerID = localStorage.getItem(AppConstants.Dishd2hSubscriberID).toString();
        this.userFormService.updatePaymentStatusRecharge(this.updatePaymentStatusCommand).subscribe((res: any) => {
          if (res.ResultCode === 0) {
            this.isPaymentSuccessfull = true;
            this.gtmTrackForSuccessRecharge('Success');
          } else {
            this.isPaymentSuccessfull = false;
            this.snackbar.showError(res.ResultDesc);
            this.gtmTrackForSuccessRecharge('Failed');
          }
          this.loading = false;
          this.moEngageTrackingForRechargeSuccess();
        }, (error) => {
          console.error(error);
          this.isPaymentSuccessfull = false;
          this.loading = false;
          this.snackbar.showError();
          this.gtmTrackForSuccessRecharge('Failed');
        });
      } else {
        this.loading = false;
        this.isPaymentSuccessfull = false;
        console.error('Payment Error');
        this.gtmTrackForSuccessRecharge('Failed');
      }

    } catch (e) {
      console.error(e);
      this.isPaymentSuccessfull = false;
      this.loading = false;
      this.snackbar.showError();
      this.gtmTrackForSuccessRecharge('Failed');
    }
  }

  continueClickEvent() {
    this._router.navigateByUrl('/');
  }

  moEngageTrackingForRechargeSuccess() {
    var attribute = {
      user_type: this.appUtilService.getUserTypeAsName(),
      recharge_amount: this.updatePaymentStatusCommand.Amount,
      transaction_no: this.updatePaymentStatusCommand.TransactionNo,
      plan_type: null
    }
    this.appUtilService.moEngageEventTracking('Recharge_Success', attribute);
  }

  gtmTrackForSuccessRecharge(recharge_response: string) {
    let dataLayerJson = {
      recharge_response: recharge_response
    }
    if (this.appUtilService.getUserTypeAsName() === 'Dish') {
      this.appUtilService.getGTMTag(dataLayerJson, 'dish_recharge_web');
    } else if (this.appUtilService.getUserTypeAsName() === 'D2H') {
      this.appUtilService.getGTMTag(dataLayerJson, 'd2h_recharge_web');
    }
  }
}
