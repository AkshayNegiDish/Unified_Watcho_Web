import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { AppUtilService } from '../../../../shared/services/app-util.service';

@Injectable({
  providedIn: 'root'
})
export class UserUrlService {
  DMS: any;

  constructor(private appUtilService: AppUtilService) {
    this.DMS = this.appUtilService.getDmsConfig()
  }

  changePassword() {
    return this.DMS.params.SMSURL + environment.SMS_API_VERSION + 'ChangePassword/';
  }

  getUserDetails() {
    return this.DMS.params.SMSURL + environment.SMS_API_VERSION + 'GetUserDetails/';
  }

  updateUserDetails() {
    return this.DMS.params.SMSURL + environment.SMS_API_VERSION + 'UpdateUserProfile/';
  }

  getActiveSubscriptionAnonymousUser() {
    return this.DMS.params.SMSURL + environment.SMS_SUBSCRIPTION_MANAGER + 'GetActiveSubscriptions';
  }

  getActiveSubscriptionLogedinUser(OTTSubscriberID: number) {
    return this.DMS.params.SMSURL + environment.SMS_SUBSCRIPTION_MANAGER + 'GetActiveSubscriptions/' + OTTSubscriberID;
  }

  validateCoupon(OTTSubscriberID: number, coupon: string, subscriptionId: number) {
    return this.DMS.params.SMSURL + environment.SMS_SUBSCRIPTION_MANAGER + 'ValidateCouponCodeForSubscriptionPlan/' + OTTSubscriberID + '/' + coupon + '/' + subscriptionId;
  }

  getPrepaidBalance(OTTSubscriberID: number) {
    return this.DMS.params.SMSURL + environment.SMS_SUBSCRIPTION_MANAGER + 'GetPrepaidBalance/' + OTTSubscriberID;
  }

  subscriptionRequestWithPrepaidBalance() {
      return this.DMS.params.SMSURL + environment.SMS_SUBSCRIPTION_MANAGER + 'SubscriptionRequestWithPrepaidBalance';
  }

  updatePaymentStatus() {
      return this.DMS.params.SMSURL + environment.SMS_SUBSCRIPTION_MANAGER + 'UpdatePaymentStatus';
  }

  subscriptionRequestWithPayment() {
      return this.DMS.params.SMSURL + environment.SMS_SUBSCRIPTION_MANAGER + 'SubscriptionRequestWithPayment';
  }

  getSubscriptionHistory(OTTSubscriberID: number) {
      return this.DMS.params.SMSURL + environment.SMS_SUBSCRIPTION_MANAGER + 'SubscriptionHistory/' + OTTSubscriberID;
  }

  getInvoice(OTTSubscriberID: number, InvoiceNo: number, SubscriptionCategory: string) {
    return this.DMS.params.SMSURL + environment.SMS_SUBSCRIPTION_MANAGER + 'Getinvoice/' + OTTSubscriberID + '/' + InvoiceNo + '/' + SubscriptionCategory;
  }

  cancelAutoRenewal(OTTSubscriberID: number) {
    return this.DMS.params.SMSURL + environment.SMS_SUBSCRIPTION_MANAGER + 'CancelAutoRenewal/' + OTTSubscriberID;
  }

  getSubscriberDetail(OTTSubscriberID: number){
    return this.DMS.params.SMSURL + environment.SMS_RECHARGE_URL + 'GetSubscriberDetails/' + OTTSubscriberID;
  }

  getBestOfferForSubscriber(OTTSubscriberID: number, dishd2hSubscriberID: string, subscriberCategory: number){
    return this.DMS.params.SMSURL + environment.SMS_RECHARGE_URL + 'GetBestOfferForSubscriber/' + OTTSubscriberID + '/' + dishd2hSubscriberID + '/' + subscriberCategory;
  }

  generateTransactionforRecharge(){
    return this.DMS.params.SMSURL + environment.SMS_RECHARGE_URL + 'GenerateTransactionforRecharge';
  }

  updatePaymentStatusRecharge(){
    return this.DMS.params.SMSURL + environment.SMS_RECHARGE_URL + 'UpdatePaymentStatus';
  }

  getRechargeHistory(OTTSubscriberID: number, SubscriptionCategory: string) {
    return this.DMS.params.SMSURL + environment.SMS_RECHARGE_URL + 'GetRechargeHistory/' + OTTSubscriberID + '/' + SubscriptionCategory;
  }

  getIntiateCancelSubscription() {
    return this.DMS.params.SMSURL + environment.SMS_SUBSCRIPTION_MANAGER + 'InitateCancelSubscriptionRequest';
  }

  getCancelSubscriptionRequest() {
    return this.DMS.params.SMSURL + environment.SMS_SUBSCRIPTION_MANAGER + 'CancelSubscriptionRequest';
  }

}
