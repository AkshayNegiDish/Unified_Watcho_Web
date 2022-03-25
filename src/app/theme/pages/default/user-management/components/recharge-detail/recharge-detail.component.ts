import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { PlaceholderImage, AppConstants } from '../../../../../shared/typings/common-constants';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { ViewPortService } from '../../../../../shared/services/view.port.service';
import { UserFormService } from '../../services/user-form.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { GenerateTransactionforRechargeCommand, OfferCommand, SubscriberDetailCommand, PaytmCommand } from '../../models/recharge.model';
import { SignInSignUpModalComponent } from '../../../../../shared/entry-component/signIn-signUp-modal.component';
import { SelectedOfferInfoModalComponent } from '../selected-offer-info-modal/selected-offer-info-modal.component';
import { environment } from '../../../../../../../environments/environment';

declare var $: any;
declare var document: any;
declare var pnCheckoutShared: any;
declare var pnCheckout: any;

@Component({
  selector: 'app-recharge-detail',
  templateUrl: './recharge-detail.component.html',
  styleUrls: ['./recharge-detail.component.scss']
})
export class RechargeDetailComponent implements OnInit {
  isBrowser: any;
  userDetails: any;
  placeholderImage: string;
  placeholderImageError: string;
  placeholderImageLoaded: boolean = false;
  registeredDate: Date;
  userSmsDetails: any;
  isDishUser: boolean;
  price: string;
  imageUrl: any = "";
  pageIndex: number;
  pageSize: number;
  OTTSubscriberID: number;
  isUserLoggedIn: boolean;

  DMS: any;
  subscriptionPlanList: any;
  loading: boolean;

  isD2hUser: boolean;
  isMobileView: boolean;

  subscriberDetailsList: SubscriberDetailCommand[];

  selectedSubscriberDetail: SubscriberDetailCommand;
  rechargeAmount: number;

  offersList: OfferCommand[];
  selectedOffer: OfferCommand;
  noOffersFound: boolean;

  maxRechargeAmount: number;

  paytmCommand: PaytmCommand;

  constructor(@Inject(PLATFORM_ID) private platformId, private appUtilService: AppUtilService, private kalturaAppService: KalturaAppService,
    private kalturaUtilService: KalturaUtilService, private viewPortService: ViewPortService,
    private userFormService: UserFormService, private router: Router, private modalService: NgbModal, private snackBar: SnackbarUtilService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.placeholderImage = PlaceholderImage.PROFILE_BACKGROUND;
    this.placeholderImageError = AppConstants.IMAGE_CLOUD_FRONT_URL + AppConstants.PLACEHOLDER_IMAGES_KEY + 'banner.png';
    this.pageIndex = 1;
    this.pageSize = 10;
    this.DMS = this.appUtilService.getDmsConfig();
    this.subscriptionPlanList = [];
    this.isD2hUser = false;
    this.isDishUser = false;
    this.isMobileView = false;
    this.loading = false;
    this.subscriberDetailsList = [];
    this.selectedSubscriberDetail = {
      Dishd2hSubscriberID: null,
      MinimumRechargeAmount: null,
      Name: null,
      RechargeAmount: null,
      Status: null,
      SubscriberCategory: null
    };
    this.rechargeAmount = null;
    this.selectedOffer = {
      OfferAmount: null,
      OfferDiscription: null,
      OfferID: null,
      OfferName: null,
      offerIndex: null
    };
    this.offersList = [];
    this.noOffersFound = false;
    this.maxRechargeAmount = 2147483647;

    this.paytmCommand = {
      MID: null, // paytm provide
      WEBSITE: environment.WEBSITE, // paytm provide
      INDUSTRY_TYPE_ID: environment.INDUSTRY_TYPE_ID, // paytm provide
      CHANNEL_ID: environment.CHANNEL_ID, // paytm provide
      ORDER_ID: null, // unique id
      CUST_ID: null, // customer id
      TXN_AMOUNT: null, // transaction amount
      CALLBACK_URL: environment.RECHARGE_PAYTM_CALLBACK_URL, // Call back URL that i want to redirect after payment fail or success
      CHECKSUMHASH: null
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      const userCategory = Number(localStorage.getItem(AppConstants.USER_CATEGORY));
      if (userCategory === 1) {
        this.isDishUser = true;
      } else if (userCategory === 2) {
        this.isD2hUser = true;
      } else {
        this.router.navigateByUrl('/');
      }

      if (matchMedia('(max-width: 768px)').matches) {
        this.isMobileView = true;
      } else {
        this.isMobileView = false;
      }

      this.userSmsDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));

      $("#rechargeAmount").on('change', (e: any) => {

      });
    }
    // this.loadScript();
    this.onLoad();
  }

  // public loadScript() {
  //   if (document.getElementById('paynimo') === null) {
  //     const node = document.createElement('script');
  //     node.id = 'paynimo';
  //     node.src = 'https://www.paynimo.com/Paynimocheckout/server/lib/checkout.js';
  //     node.type = 'text/javascript';
  //     node.async = false;
  //     node.charset = 'utf-8';
  //     node.onload = this.onPgScriptLoadEvent.bind(this);
  //     document.getElementsByTagName('head')[0].appendChild(node);
  //   }
  // }

  onPgScriptLoadEvent(e: any) {
    // console.log(e);
  }

  onLoad() {
    this.loading = true;
    this.userFormService.getSubscriberDetail(this.userSmsDetails.OTTSubscriberID).subscribe((res: any) => {
      this.loading = false;
      if (res.ResultCode === 0) {
        this.subscriberDetailsList = res.Result;
        this.selectedSubscriberDetail = this.subscriberDetailsList[0];
        this.rechargeAmount = this.selectedSubscriberDetail.RechargeAmount;
        this.getBestOfferForSubscriber(this.selectedSubscriberDetail.Dishd2hSubscriberID, this.selectedSubscriberDetail.SubscriberCategory);
      } else {
        this.snackBar.showError(res.ResultDesc);
      }
    }, (error) => {
      this.snackBar.showError();
      console.error(error);
      this.loading = false;
    });
  }

  getBestOfferForSubscriber(dishd2hSubscriberID: string, subscriberCategory: number) {
    this.rechargeAmount = this.selectedSubscriberDetail.RechargeAmount;
    this.loading = true;
    this.userFormService.getBestOfferForSubscriber(this.userSmsDetails.OTTSubscriberID, dishd2hSubscriberID, subscriberCategory).subscribe((res: any) => {
      this.loading = false;
      if (res.ResultCode === 0) {
        this.noOffersFound = false;
        this.offersList = [];
        res.Result.forEach((ele: OfferCommand, index: number) => {
          let offer = new OfferCommand();
          offer.OfferID = ele.OfferID;
          offer.OfferDiscription = ele.OfferDiscription;
          offer.OfferName = ele.OfferName;
          offer.OfferAmount = ele.OfferAmount;
          offer.offerIndex = index;
          this.offersList.push(offer);
        });
      } else {
        this.noOffersFound = true;
        this.snackBar.showError(res.ResultDesc);
        this.offersList = [];
      }
    }, (error) => {
      this.noOffersFound = true;
      this.snackBar.showError();
      console.error(error);
      this.offersList = [];
      this.loading = false;
    });
  }

  selectOfferEvent(offer: OfferCommand, event?: any) {
    if (!event.target.className.match(/offer-info/g)) {
      if (offer.OfferID === this.selectedOffer.OfferID && offer.offerIndex === this.selectedOffer.offerIndex) {
        this.selectedOffer = {
          OfferAmount: null,
          OfferDiscription: null,
          OfferID: null,
          OfferName: null
        };
        $(".amounts-section").removeClass('active');
        this.rechargeAmount = this.selectedSubscriberDetail.RechargeAmount;
        return;
      }
      this.setSelectedOffer(offer);
    }
  }

  offerMoreClickEvent(offer: OfferCommand, event?: any) {
    const modalRef = this.modalService.open(SelectedOfferInfoModalComponent);
    modalRef.componentInstance.selectedOffer = offer;
    modalRef.result.then((data: OfferCommand) => {
      if (data.OfferID) {
        this.setSelectedOffer(data);
      }
    }, (reason) => {
      console.error(reason);
    });
  }

  setSelectedOffer(offer: OfferCommand) {
    this.offersList.forEach((ele: OfferCommand) => {
      if (ele.OfferID === offer.OfferID && ele.offerIndex === offer.offerIndex) {
        this.selectedOffer = ele;
        this.rechargeAmount = ele.OfferAmount;
      }
    });
    $(".amounts-section").removeClass('active');
    let id = '#offer-' + this.selectedOffer.OfferID + '-' + this.selectedOffer.offerIndex;
    $(id).addClass('active');
  }

  rechargeAmountChangeEvent(e: any) {
    this.selectedOffer = {
      OfferAmount: null,
      OfferDiscription: null,
      OfferID: null,
      OfferName: null
    };
    $(".amounts-section").removeClass('active');
  }

  dishd2hSubscriberIDChangeEvent(e: any) {
    this.setSelectedSubscriberDetail(Number(e.target.value));
    this.rechargeAmountChangeEvent(null);
    this.getBestOfferForSubscriber(this.selectedSubscriberDetail.Dishd2hSubscriberID, this.selectedSubscriberDetail.SubscriberCategory);
  }

  setSelectedSubscriberDetail(dishd2hSubscriberID: number) {
    this.subscriberDetailsList.forEach((ele: SubscriberDetailCommand) => {
      if (Number(ele.Dishd2hSubscriberID) === dishd2hSubscriberID) {
        this.selectedSubscriberDetail = ele;
      }
    });
  }

  proceedToPayClickEvent() {
    let reg = /^\d+$/;
    if (!this.rechargeAmount || this.rechargeAmount.toString().length === 0) {
      this.snackBar.showError('Recharge amount cannot be empty');
      return;
    }
    if (this.rechargeAmount.toString().match(reg)) {
      if (this.rechargeAmount && Number(this.rechargeAmount) > 0) {
        if (Number(this.rechargeAmount) <= this.maxRechargeAmount) {
          if (Number(this.rechargeAmount) >= Number(this.selectedSubscriberDetail.MinimumRechargeAmount)) {
            let command = new GenerateTransactionforRechargeCommand();
            command.Amount = Number(this.rechargeAmount);
            command.PaymentMode = 'All';
            command.PaymentGatewayDetails = 'NONE';
            command.OTTSubscriberID = this.userSmsDetails.OTTSubscriberID;
            command.Dishd2hSubscriberID = this.selectedSubscriberDetail.Dishd2hSubscriberID;
            command.OfferID = this.selectedOffer.OfferID;
            command.Source = 'WEB';
            command.CallbackUrl = environment.RECHARGE_PAYTM_CALLBACK_URL;
            this.loading = true;
            this.userFormService.generateTransactionforRecharge(command).subscribe((res: any) => {
              /*{
                "ResultType": 0,
                  "ResultCode": 0,
                  "ResultDesc": "Success",
                  "Result": {
                "OrderID": "PAYNIMO647390",
                    "PaymentGetwayToken": "8626E7945D192C92D057B9088B07239E",
                    "AlgorithmKey": null,
                    "PaymentGatewayID": "PAYNIMO"
              }
              }*/
              this.loading = false;
              if (res.ResultCode === 0) {
                localStorage.setItem(AppConstants.Dishd2hSubscriberID, this.selectedSubscriberDetail.Dishd2hSubscriberID);
                this.openPaymentGateway(res.Result);
                this.moEngageTrackingForRecharge('Recharge_Initiated', null);
              } else {
                this.snackBar.showError(res.ResultDesc);
                this.moEngageTrackingForRecharge('Recharge_Failure', res.ResultDesc);
              }
            }, (error) => {
              this.loading = false;
              console.error(error);
              this.snackBar.showError();
            });
          } else {
            this.snackBar.showError('Minimum recharge amount should be of ₹' + this.selectedSubscriberDetail.MinimumRechargeAmount);
          }
        } else {
          this.snackBar.showError('Recharge should be of maximum ₹' + this.maxRechargeAmount);
        }
      } else {
        this.snackBar.showError('Recharge amount cannot be empty');
      }
    } else {
      this.snackBar.showError('Invalid Recharge Amount');
    }
  }

  rechargeNowClickEvent() {
    if (this.selectedSubscriberDetail.Dishd2hSubscriberID && this.selectedSubscriberDetail.Dishd2hSubscriberID.length > 0) {
      this.proceedToPayClickEvent();
    } else {
      this.snackBar.showError('VC number cannot be empty');
    }
  }

  openPaymentGateway(result: any) {
    try {

      // Popilated paytmCommand with the result parameter
      this.paytmCommand.ORDER_ID = result.OrderID;
      this.paytmCommand.CHECKSUMHASH = result.PaymentGetwayToken;
      this.paytmCommand.CUST_ID = this.selectedSubscriberDetail.Dishd2hSubscriberID;
      this.paytmCommand.TXN_AMOUNT = Number(this.rechargeAmount).toString();
      this.paytmCommand.MID = localStorage.getItem(AppConstants.USER_CATEGORY) === '1' ? environment.MID_DISH : environment.MID_D2H;
      // called paytm form 
      this.createPaytmForm();


      // <------------------------------------------------------------------------------------------------------------------------------->
      // FIXME: Removed Paynimo here
      // const configJson: any = {
      //   'tarCall': false,
      //   'features': {
      //     'showPGResponseMsg': true,
      //     'enableNewWindowFlow': true,
      //     'separateCardMode': true
      //   },
      //   'consumerData': {
      //     'deviceId': result.AlgorithmKey,
      //     'token': result.PaymentGetwayToken,
      //     'returnUrl': environment.RECHARGE_RETURN_URL + '?id='+ this.selectedSubscriberDetail.Dishd2hSubscriberID,
      //     'paymentMode': 'all',
      //     'merchantLogoUrl': 'https://d1f8xt8ufwfd45.cloudfront.net/web/placeholder-images/branding_logo_recharge.png',
      //     'merchantId': this.isDishUser ? environment.PAYNIMO_MERCHANT_ID_RECHARGE_DISH_USER : environment.PAYNIMO_MERCHANT_ID_RECHARGE_D2H_USER,
      //     'currency': 'INR',
      //     'txnId': result.OrderID,
      //     'items': [{
      //       'itemId': this.isDishUser ? environment.RECHARGE_PG_SCHEME_ID_DISH_USER : environment.RECHARGE_PG_SCHEME_ID_D2H_USER,
      //       'amount': Number(this.rechargeAmount).toString(),
      //       'comAmt': '0'
      //     }],
      //     'customStyle': {
      //       'PRIMARY_COLOR_CODE': '#333333',
      //       'SECONDARY_COLOR_CODE': '#FFFFFF',
      //       'BUTTON_COLOR_CODE_1': '#333333',
      //       'BUTTON_COLOR_CODE_2': '#FFFFFF'
      //     }
      //   }
      // };
      // console.log(configJson);
      // console.log(JSON.stringify(configJson));
      // $.pnCheckout(configJson);
      // if (configJson.features.enableNewWindowFlow) {
      //   pnCheckoutShared.openNewWindow();
      // }
    } catch (e) {
      this.snackBar.showError();
    }
  }

  createPaytmForm() {
    const my_form: any = document.createElement('form');
    my_form.name = 'paytm_form';
    my_form.method = 'post';
    my_form.action = 'https://securegw.paytm.in/order/process';

    const myParams = Object.keys(this.paytmCommand);
    for (let i = 0; i < myParams.length; i++) {
      const key = myParams[i];
      let my_tb: any = document.createElement('input');
      my_tb.type = 'hidden';
      my_tb.name = key;
      my_tb.value = this.paytmCommand[key];
      my_form.appendChild(my_tb);
    };

    document.body.appendChild(my_form);
    my_form.submit();
    // after click will fire you will redirect to paytm payment page.
    // after complete or fail transaction you will redirect to your CALLBACK URL
  };

  rechargeAmountKeyDownEvent(event) {
    let key = event.keyCode || event.charCode;
    if (key == 8 || key == 46 || key == 13 || key == 37 || key == 39 || key == 9) {
      return true;
    }

    if (key == 32 || key == 190 || key == 69 || key == 107 || key == 109 || key == 189 || key == 187) {
      event.preventDefault();
      return false;
    }

    if (event.target.value.length === 9) {
      event.preventDefault();
      return false;
    }
  }

  moEngageTrackingForRecharge(status: any, failureType: any) {
    var attribute = {
      user_type: this.appUtilService.getUserTypeAsName(),
      failure_type: failureType ? failureType : null
    }
    this.appUtilService.moEngageEventTracking(status, attribute);
  }
}
