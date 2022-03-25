import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { UserFormService } from '../../services/user-form.service';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import {
    InitiatePayTMRequest,
    PaymentMethod,
    PayTMRequesrBody,
    PaytmSvodCommand,
    SubscriptionDetailCommand,
    SubscriptionRequestWithPaymentCommand,
    SubscriptionRequestWithPrepaidBalanceCommand
} from '../../models/subscription.model';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { AppConstants } from '../../../../../shared/typings/common-constants';
import { environment } from '../../../../../../../environments/environment';

declare var $: any;
declare var document: any;
declare var pnCheckoutShared: any;
declare var pnCheckout: any;
// declare function handleResponse($event): any;
// declare function paymentConfigHandler($event): any;

@Component({
    selector: 'app-subscription-detail',
    templateUrl: './subscription-detail.component.html',
    styleUrls: ['./subscription-detail.component.scss']
})
export class SubscriptionDetailComponent implements OnInit {

    selectedSubscriptionId: number;
    userSmsDetails: any;
    selectedSubscriptionDetails: SubscriptionDetailCommand;
    isSubscriptionValid: boolean;
    isCouponValid: boolean;
    appliedCoupon: string;
    couponErrorMessage: string;
    payableAmount: number;
    discount: number;
    showWalletPaymentOption: boolean;

    PaymentMethod = PaymentMethod;
    selectedPaymentMethod: PaymentMethod;
    isDishD2hUserLogedin: boolean;

    loading: boolean;

    dishD2hUserType: string;

    initiatePayTMRequest: InitiatePayTMRequest;
    payTMRequesrBody: PayTMRequesrBody;
    paytmSvodCommand: PaytmSvodCommand;
    subscriptionPlanDuration: number;

    // handleResponse: EventListener;
    // paymentConfigHandler: EventListener;

    constructor(private activatedRoute: ActivatedRoute, private platformIdentifierService: PlatformIdentifierService,
        private userFormService: UserFormService, private appUtilService: AppUtilService, private snackbarUtilService: SnackbarUtilService,
        private _router: Router) {
        this.selectedSubscriptionId = null;
        this.selectedSubscriptionDetails = {
            SubscriptionPlanName: 'N.A.',
            SubscriptionPlanID: null,
            Discount: 0,
            IsSubscribed: null,
            SubscriptionActualPrice: 0,
            SubscriptionPlanDescription: 'N.A.',
            SubscriptionPlanDuration: 0,
            SubscriptionPrice: 0
        };
        this.isSubscriptionValid = false;
        this.isCouponValid = false;
        this.appliedCoupon = null;
        this.couponErrorMessage = null;
        this.payableAmount = 0;
        this.showWalletPaymentOption = false;
        this.isDishD2hUserLogedin = false;
        this.selectedPaymentMethod = null;
        this.loading = true;
        this.discount = 0;

        this.payTMRequesrBody = {
            requestType: "NATIVE_SUBSCRIPTION",
            mid: environment.SVOD_PAYTM.MID,
            websiteName: environment.SVOD_PAYTM.WEBSITE,
            orderId: "",
            subscriptionAmountType: "FIX",
            subscriptionFrequency: "",
            subscriptionFrequencyUnit: "MONTH",
            subscriptionStartDate: "",
            subscriptionGraceDays: "",
            subscriptionExpiryDate: "",
            subscriptionEnableRetry: "1",
            txnAmount: { value: "", currency: "INR" },
            userInfo: { custId: "" },
            callbackUrl: ""
        }
        this.initiatePayTMRequest = {
            body: this.payTMRequesrBody,
            head: { signature: "" }
        }
        this.paytmSvodCommand = {
            mid: environment.SVOD_PAYTM.MID,
            orderId: null,
            txnToken: null
        }
    }

    ngOnInit() {
        if (this.platformIdentifierService.isBrowser()) {
            let isDishUser: any;
            this.dishD2hUserType = this.appUtilService.getUserTypeAsName();
            isDishUser = localStorage.getItem(AppConstants.IS_DISH_USER);
            if (isDishUser === true || isDishUser === 'true') {
                this.isDishD2hUserLogedin = true;
                this.selectedPaymentMethod = PaymentMethod.DISHD2H_WALLET;
                setTimeout(() => {
                    $("#wallet").trigger("click");
                }, 50);
            } else {
                this.selectedPaymentMethod = PaymentMethod.PAYMENT_GATEWAY;
                this.isDishD2hUserLogedin = false;
            }
            $("#appliedCoupon").on('focus', (e) => {
                this.couponErrorMessage = null;
            });
            this.loadScript();
        }

        this.userSmsDetails = this.appUtilService.getLoggedInUserSMSDetails();
        this.selectedSubscriptionId = Number(this.activatedRoute.snapshot.queryParams['id']);
        if (this.appUtilService.isUserLoggedIn()) {
            if (this.selectedSubscriptionId) {
                this.getSubscriptionDetail();
            }
        }
    }

    public loadScript() {
        if (document.getElementById('paynimo') === null) {
            const node = document.createElement('script');
            node.id = 'paynimo';
            node.src = 'https://www.paynimo.com/Paynimocheckout/server/lib/checkout.js';
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            node.onload = this.onPgScriptLoadEvent.bind(this);
            document.getElementsByTagName('head')[0].appendChild(node);
        }
    }

    onPgScriptLoadEvent(e: any) {
        console.log(e);
    }

    getSubscriptionDetail() {
        this.loading = true;
        this.userFormService.getActiveSubscriptions(this.userSmsDetails.OTTSubscriberID).subscribe((res: any) => {
            this.loading = false;
            if (res.ResultCode === 0) {
                res.Result.forEach((ele: SubscriptionDetailCommand) => {
                    if (ele.SubscriptionPlanID === this.selectedSubscriptionId) {
                        this.selectedSubscriptionDetails = ele;
                        this.isSubscriptionValid = true;
                        this.payableAmount = this.selectedSubscriptionDetails.SubscriptionActualPrice;
                        this.subscriptionPlanDuration = this.selectedSubscriptionDetails.SubscriptionPlanDuration;
                        // this.discount = this.selectedSubscriptionDetails.Discount;
                    }
                });
            } else {
                this.snackbarUtilService.showError(res.ResultDesc);
            }
        }, (error: any) => {
            this.loading = false;
            this.isSubscriptionValid = false;
            console.error(error);
            this.snackbarUtilService.showError();
        });
    }

    redeemCoupon(e: any) {
        if (this.appliedCoupon) {
            if (this.appliedCoupon.match('[a-z 0-9]') && this.appliedCoupon.trim().length <= 10) {
                this.couponErrorMessage = null;
                this.loading = true;
                this.userFormService.validateCoupon(this.userSmsDetails.OTTSubscriberID, this.appliedCoupon.trim(), this.selectedSubscriptionId).subscribe((res: any) => {
                    if (res.ResultCode === 0) {
                        if (res.Result.IsCouponValid) {
                            this.isCouponValid = true;
                            this.payableAmount = res.Result.SubscriptionPriceAfterDiscount;
                            this.discount = res.Result.DiscountType.Value;
                        } else {
                            this.isCouponValid = false;
                            this.appliedCoupon = null;
                            this.snackbarUtilService.showError(res.ResultDesc);
                        }
                    } else {
                        this.isCouponValid = false;
                        this.appliedCoupon = null;
                        this.snackbarUtilService.showError(res.ResultDesc);
                    }
                    this.loading = false;
                }, (error: any) => {
                    this.loading = false;
                    console.error(error);
                    this.isCouponValid = false;
                    this.appliedCoupon = null;
                    this.snackbarUtilService.showError();
                });
            } else {
                this.isCouponValid = false;
                this.couponErrorMessage = 'Please enter a valid coupon code';
                this.snackbarUtilService.showError('Please enter a valid coupon code');
            }
        } else {
            this.isCouponValid = false;
            this.couponErrorMessage = 'Please enter a valid coupon code';
            this.snackbarUtilService.showError('Please enter a valid coupon code');
        }
    }

    removeAppliedCoupon(e: any) {
        this.appliedCoupon = null;
        this.isCouponValid = false;
        this.payableAmount = this.selectedSubscriptionDetails.SubscriptionActualPrice;
    }

    proceedToPayClickEvent(e: any, paymentMethod: PaymentMethod) {
        this.selectedPaymentMethod = paymentMethod;
        if (!this.selectedPaymentMethod) {
            this.snackbarUtilService.showError('Please select any payment option');
            return;
        }
        if (this.isSubscriptionValid && this.payableAmount >= 0) {
            if (this.payableAmount === 0) {
                const command = new SubscriptionRequestWithPaymentCommand();
                if (this.isCouponValid) {
                    command.CoupenCode = this.appliedCoupon;
                } else {
                    command.CoupenCode = null;
                }
                if (command.CoupenCode === null) {
                    command.CoupenCode = '';
                }
                command.Discount = this.discount;
                command.IsAutoRenewal = 0;
                command.OTTSubscriberID = this.userSmsDetails.OTTSubscriberID;
                command.PaymentGatewayDetails = null;
                command.PaymentGatewayID = 'None';
                command.PaymentMode = 'Auto';
                command.Source = 'WEB';
                command.SubscriptionPlanID = this.selectedSubscriptionId;
                command.TotalPayableAmount = this.payableAmount;
                this.loading = true;
                this.userFormService.subscriptionRequestWithPayment(command).subscribe((res: any) => {
                    this.loading = false;
                    if (res.ResultCode === 0) {
                        this.snackbarUtilService.showSnackbar(res.ResultDesc);
                        this._router.navigate(['/user/paymentstatus'], {
                            queryParams: {
                                oId: res.Result.OrderID,
                                amt: res.Result.ActualPayableAmount,
                                success: 1
                            }
                        });
                    } else {
                        this.snackbarUtilService.showError(res.ResultDesc);
                        this._router.navigate(['/user/paymentstatus'], {
                            queryParams: {
                                oId: res.Result.OrderID,
                                amt: res.Result.ActualPayableAmount,
                                success: 0
                            }
                        });
                    }
                }, (error) => {
                    this.loading = false;
                    console.error(error);
                    this.snackbarUtilService.showError();
                });
            } else {
                if (this.isDishD2hUserLogedin) {
                    if (this.selectedPaymentMethod != null) {
                        if (this.selectedPaymentMethod === PaymentMethod.DISHD2H_WALLET) {
                            //    check prepaid balance
                            this.gtmTagEventButtonClickProceedForPayment('wallet');
                            this.loading = true;
                            this.userFormService.getPrepaidBalance(this.userSmsDetails.OTTSubscriberID).subscribe((res: any) => {
                                this.loading = false;
                                if (res.ResultCode === 0) {
                                    if (res.Result >= this.payableAmount + 100) {
                                        this.showWalletPaymentOption = true;
                                        //    checkout with wallet balance
                                        let command = new SubscriptionRequestWithPrepaidBalanceCommand();
                                        command.CoupenCode = this.appliedCoupon;
                                        if (command.CoupenCode === null) {
                                            command.CoupenCode = '';
                                        }
                                        command.Discount = this.discount;
                                        command.IsAutoRenewal = 0;
                                        command.OTTSubscriberID = this.userSmsDetails.OTTSubscriberID;
                                        command.Source = 'WEB';
                                        command.SubscriptionPlanID = this.selectedSubscriptionId;
                                        command.TotalPayableAmount = this.payableAmount;
                                        this.loading = true;
                                        this.userFormService.subscriptionRequestWithPrepaidBalance(command).subscribe((resp: any) => {
                                            this.loading = false;
                                            if (resp.ResultCode === 0) {
                                                //    success
                                                this.snackbarUtilService.showSnackbar(resp.ResultDesc);
                                                this._router.navigate(['/user/paymentstatus'], {
                                                    queryParams: {
                                                        oId: resp.Result.OrderID,
                                                        amt: resp.Result.ActualPayableAmount,
                                                        success: 1
                                                    }
                                                });
                                                this.moEngageTrackingForProceedForPayment('Proceed_for_Payment', null);
                                            } else {
                                                //    error
                                                this.snackbarUtilService.showError(resp.ResultDesc);
                                                this._router.navigate(['/user/paymentstatus'], {
                                                    queryParams: {
                                                        oId: resp.Result.OrderID,
                                                        amt: resp.Result.ActualPayableAmount,
                                                        success: 0
                                                    }
                                                });
                                                this.moEngageTrackingForProceedForPayment('Payment_Failure', res.ResultDesc);
                                            }
                                        }, (error: any) => {
                                            this.loading = false;
                                            console.error(error);
                                            this.snackbarUtilService.showError();
                                        });
                                    } else {
                                        this.showWalletPaymentOption = false;
                                        this.snackbarUtilService.showError('You have insuficient balance in your wallet, please recharge and try again or select other payment option');
                                    }
                                } else {
                                    this.snackbarUtilService.showError(res.ResultDesc);
                                }
                            }, (error: any) => {
                                this.loading = false;
                                this.snackbarUtilService.showError();
                                console.error(error);
                            });
                        } else {
                            this.openPaymentGateway(e);
                            // this.openPayTMPaymentGateway(e);
                        }
                    } else {
                        this.snackbarUtilService.showError('Select Payment Method');
                    }
                } else {
                    this.openPaymentGateway(e);
                    // this.openPayTMPaymentGateway(e);
                }
            }
        } else {
            this.snackbarUtilService.showError('Invalid Subscription');
        }
    }

    openPaymentGateway(e: any) {
        let command = new SubscriptionRequestWithPaymentCommand();
        command.TotalPayableAmount = this.payableAmount;
        command.SubscriptionPlanID = this.selectedSubscriptionId;
        command.Source = 'WEB';
        command.OTTSubscriberID = this.userSmsDetails.OTTSubscriberID;
        command.IsAutoRenewal = 0;
        command.Discount = this.discount;
        if (this.isCouponValid) {
            command.CoupenCode = this.appliedCoupon;
        } else {
            command.CoupenCode = '';
        }
        command.PaymentMode = 'ALL';
        command.PaymentGatewayID = environment.PAYMENTGATEWAY_ID;
        command.PaymentGatewayDetails = 'None';
        if (command.CoupenCode === null) {
            command.CoupenCode = '';
        }
        this.gtmTagEventButtonClickProceedForPayment('PG');

        this.loading = true;
        this.userFormService.subscriptionRequestWithPayment(command).subscribe((res: any) => {
            this.loading = false;
            if (res.ResultCode === 0) {
                if (this.platformIdentifierService.isBrowser()) {
                    e.preventDefault();
                    const configJson: any = {
                        'tarCall': false,
                        'features': {
                            'showPGResponseMsg': true,
                            'enableNewWindowFlow': true,
                            'separateCardMode': true
                        },
                        'consumerData': {
                            'deviceId': res.Result.AlgorithmKey,
                            'token': res.Result.PaymentGetwayToken,
                            'returnUrl': environment.PAYMENTGATEWAY_RETURN_URL, // TODO: Dynamic URL from env
                            'paymentMode': 'all',
                            'merchantLogoUrl': 'https://d1f8xt8ufwfd45.cloudfront.net/web/placeholder-images/watcho-logo-small.png',
                            'merchantId': environment.PAYNIMO_MERCHANT_ID,
                            'currency': 'INR',
                            'txnId': res.Result.OrderID,
                            'items': [{
                                'itemId': 'FIRST',
                                'amount': this.payableAmount.toString(),
                                'comAmt': '0'
                            }],
                            'customStyle': {
                                'PRIMARY_COLOR_CODE': '#333333',
                                'SECONDARY_COLOR_CODE': '#FFFFFF',
                                'BUTTON_COLOR_CODE_1': '#333333',
                                'BUTTON_COLOR_CODE_2': '#FFFFFF'
                            }
                        }
                    };
                    console.log(JSON.stringify(configJson));
                    $.pnCheckout(configJson);
                    if (configJson.features.enableNewWindowFlow) {
                        pnCheckoutShared.openNewWindow();
                    }
                }
            } else {
                this.snackbarUtilService.showError(res.ResultDesc);
            }
        }, (error) => {
            console.error(error);
            this.loading = false;
            this.snackbarUtilService.showError();
        });

    }

    openPayTMPaymentGateway(e) {
        let command = new SubscriptionRequestWithPaymentCommand();
        if (this.isCouponValid) {
            command.CoupenCode = this.appliedCoupon;
        } else {
            command.CoupenCode = '';
        }
        if (command.CoupenCode === null) {
            command.CoupenCode = '';
        }
        command.Discount = this.discount;
        command.IsAutoRenewal = 1;
        command.OTTSubscriberID = this.userSmsDetails.OTTSubscriberID;
        command.PaymentGatewayDetails = "";
        command.PaymentGatewayID = environment.SVOD_PAYTM.PAYMENTGATEWAY_ID;
        command.PaymentMode = 'ALL';
        command.Source = 'WEB';
        command.SubscriptionPlanID = this.selectedSubscriptionId;
        command.TotalPayableAmount = this.payableAmount;
        command.SubscriptionParam = {
            CallbackUrl: environment.SVOD_PAYTM.PAYMENTGATEWAY_RETURN_URL,
            WebsiteName: environment.SVOD_PAYTM.WEBSITE,
            ChannelId: environment.SVOD_PAYTM.CHANNEL_ID,
            subscriptionAmountType: "FIX",
            subscriptionFrequency: this.subscriptionPlanDuration.toString(),
            subscriptionFrequencyUnit: "MONTH",
            subscriptionEnableRetry: 1,
            subscriptionStartDate: this.getFormatDates(),
            subscriptionGraceDays: "7"
        }
        this.gtmTagEventButtonClickProceedForPayment('PG');
        this.loading = true;
        this.userFormService.subscriptionRequestWithPayment(command).subscribe((res: any) => {
            this.loading = false;
            if (res.ResultCode === 0) {
                if (this.platformIdentifierService.isBrowser()) {
                    e.preventDefault();
                    this.payTMRequesrBody.orderId = res.Result.OrderID;
                    this.payTMRequesrBody.subscriptionFrequency = res.Result.SubscriptionParam.SubscriptionFrequency;
                    this.payTMRequesrBody.subscriptionExpiryDate = res.Result.SubscriptionParam.SubscriptionExpiryDate;
                    this.payTMRequesrBody.txnAmount.value = res.Result.ActualPayableAmount.toString();
                    this.payTMRequesrBody.userInfo.custId = this.userSmsDetails.OTTSubscriberID.toString();
                    this.payTMRequesrBody.callbackUrl = environment.SVOD_PAYTM.PAYMENTGATEWAY_RETURN_URL + '?ORDER_ID=' + res.Result.OrderID;
                    this.payTMRequesrBody.subscriptionStartDate = res.Result.SubscriptionParam.SubscriptionStartDate;
                    this.payTMRequesrBody.subscriptionGraceDays = res.Result.SubscriptionParam.SubscriptionGraceDays;
                    this.initiatePayTMRequest.body = this.payTMRequesrBody;
                    this.initiatePayTMRequest.head.signature = res.Result.PaymentGetwayToken;
                    this.initiatePaytmSubscription();
                }
            } else {
                this.snackbarUtilService.showError(res.ResultDesc);
            }
        }, (error) => {
            console.error(error);
            this.loading = false;
            this.snackbarUtilService.showError();
        });
    }

    getFormatDate(): string { // format date as '21-01-2021'
        let date = new Date();
        var formattedDate = date.toLocaleDateString('en-GB', {
            day: 'numeric', month: 'numeric', year: 'numeric'
        });
        let formatDateArray = formattedDate.split('/');
        return (formatDateArray[0] + '-' + formatDateArray[1] + '-' + formatDateArray[2]);
    }

    getFormatDates(): string { // format date as '2021-04-09'
        let date = new Date();
        var formattedDate = date.toLocaleDateString('en-GB', {
            day: 'numeric', month: 'numeric', year: 'numeric'
        });
        let formatDateArray = formattedDate.split('/');
        return (formatDateArray[2] + '-' + formatDateArray[1] + '-' + formatDateArray[0]);
    }

    gtmTagEventButtonClickProceedForPayment(paymentType) {
        let dataLayerJson: any;
        dataLayerJson = {
            'type': this.appUtilService.getUserTypeAsName(),
            'userid': Math.ceil(new Date().getTime() / 1000)
        };
        this.appUtilService.getGTMTag(dataLayerJson, 'proceed_for_payment');
    }

    moEngageTrackingForProceedForPayment(status: any, failureType: any) {
        var attribute = {
            user_type: this.appUtilService.getUserTypeAsName(),
            failure_type: failureType ? failureType : null
        }
        this.appUtilService.moEngageEventTracking(status, attribute);
    }

    initiatePaytmSubscription() {
        this.loading = true;
        this.userFormService.initiatePaytmSubscription(this.initiatePayTMRequest, this.initiatePayTMRequest.body.orderId).subscribe((res: any) => {
            if (res.body.resultInfo.resultCode === '0000') {
                if (this.platformIdentifierService.isBrowser()) {
                    this.loading = false;
                    this.paytmSvodCommand.orderId = this.initiatePayTMRequest.body.orderId;
                    this.paytmSvodCommand.txnToken = res.body.txnToken;
                    this.createPaytmForm();
                }
            } else {
                this.loading = false;
                this.snackbarUtilService.showError(res.body.resultInfo.resultMsg);
            }
        }, (error) => {
            console.error(error);
            this.loading = false;
            this.snackbarUtilService.showError();
        });
    };

    createPaytmForm() {
        const my_form: any = document.createElement('form');
        my_form.name = 'paytm_form';
        my_form.method = 'post';
        my_form.action = environment.SVOD_PAYTM.PAYTM_SHOWPAYMENTPAGE_URL + environment.SVOD_PAYTM.MID + '&orderId=' + this.paytmSvodCommand.orderId;

        const myParams = Object.keys(this.paytmSvodCommand);
        for (let i = 0; i < myParams.length; i++) {
            const key = myParams[i];
            let my_tb: any = document.createElement('input');
            my_tb.type = 'hidden';
            my_tb.name = key;
            my_tb.value = this.paytmSvodCommand[key];
            my_form.appendChild(my_tb);
        };

        document.body.appendChild(my_form);
        my_form.submit();
    };
}
