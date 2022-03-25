import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppUtilService } from '../../../../shared/services/app-util.service';
import { UpdateUserProfileCommand } from '../models/user';
import { UserUrlService } from './user-url.service';
import {
    SubscriptionRequestWithPaymentCommand,
    SubscriptionRequestWithPrepaidBalanceCommand,
    UpdatePaymentStatusCommand
} from '../models/subscription.model';
import {GenerateTransactionforRechargeCommand, UpdatePaymentStatusRechargeCommand} from '../models/recharge.model';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserFormService {

  constructor(private userUrlService: UserUrlService, private httpClient: HttpClient, private appUtilService: AppUtilService) { }

  changePassword(userid: string, currentPassword: string, userIDType: string): Observable<HttpResponse<any>> {
    var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
    headers = headers.append('Content-Type', 'application/json');
    return this.httpClient.get(this.userUrlService.changePassword() + userid + '/' + currentPassword + '/' + userIDType, { headers }).pipe((res: Observable<HttpResponse<any>>) => {
      return res
    })
  }

  getUserDetails(userid: string, userIDType: string): Observable<HttpResponse<any>> {
    var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
    headers = headers.append('Content-Type', 'application/json');
    return this.httpClient.get(this.userUrlService.getUserDetails() + userid + '/' + userIDType, { headers }).pipe((res: Observable<HttpResponse<any>>) => {
      return res
    })
  }

  updateUserDetails(updateUserProfileCommand: UpdateUserProfileCommand): Observable<HttpResponse<any>> {
    var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
    headers = headers.append('Content-Type', 'application/json');
    return this.httpClient.post(this.userUrlService.updateUserDetails(), updateUserProfileCommand, { headers }).pipe((res: Observable<HttpResponse<any>>) => {
      return res
    })
  }

  getActiveSubscriptions(ottSubscriberId: number): Observable<HttpResponse<any>> {

    if (this.appUtilService.isUserLoggedIn()) {
      var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
      headers = headers.append('Content-Type', 'application/json');
      return this.httpClient.get(this.userUrlService.getActiveSubscriptionLogedinUser(ottSubscriberId), { headers })
        .pipe((res: Observable<HttpResponse<any>>) => {
          return res
        });
    } else {
      var headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      return this.httpClient.get(this.userUrlService.getActiveSubscriptionAnonymousUser(), { headers })
        .pipe((res: Observable<HttpResponse<any>>) => {
          return res
        });
    }

  }

  validateCoupon(OTTSubscriberID: number, coupon: string, subscriptionId: number) {
      var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
      headers = headers.append('Content-Type', 'application/json');
      return this.httpClient.get(this.userUrlService.validateCoupon(OTTSubscriberID, coupon, subscriptionId), { headers })
          .pipe((res: Observable<HttpResponse<any>>) => {
              return res
          });
  }

  getPrepaidBalance(OTTSubscriberID: number) {
      var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
      headers = headers.append('Content-Type', 'application/json');
      return this.httpClient.get(this.userUrlService.getPrepaidBalance(OTTSubscriberID), { headers })
          .pipe((res: Observable<HttpResponse<any>>) => {
              return res
          });
  }

    subscriptionRequestWithPrepaidBalance(command: SubscriptionRequestWithPrepaidBalanceCommand) {
        var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
        headers = headers.append('Content-Type', 'application/json');
        return this.httpClient.post(this.userUrlService.subscriptionRequestWithPrepaidBalance(), command,{ headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    subscriptionRequestWithPayment(command: SubscriptionRequestWithPaymentCommand) {
        var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
        headers = headers.append('Content-Type', 'application/json');
        return this.httpClient.post(this.userUrlService.subscriptionRequestWithPayment(),command, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    initiatePaytmSubscription(command, orderId) {
      var headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      return this.httpClient.post(environment.SVOD_PAYTM.INITIAL_PAYTM_URL + '?mid=' + environment.SVOD_PAYTM.MID + '&orderId=' + orderId, JSON.stringify(command), { headers: headers })
        .pipe((res: Observable<HttpResponse<any>>) => {
          return res
        });
    }

    updatePaymentStatus(command: UpdatePaymentStatusCommand) {
        var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
        headers = headers.append('Content-Type', 'application/json');
        return this.httpClient.post(this.userUrlService.updatePaymentStatus(), JSON.stringify(command), { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getSubscriptionHistory(OTTSubscriberID: number) {
        var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
        headers = headers.append('Content-Type', 'application/json');
        return this.httpClient.get(this.userUrlService.getSubscriptionHistory(OTTSubscriberID), { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getRechargeHistory(OTTSubscriberID: number, SubscriptionCategory: any) {
      var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
      headers = headers.append('Content-Type', 'application/json');
      return this.httpClient.get(this.userUrlService.getRechargeHistory(OTTSubscriberID, SubscriptionCategory), { headers })
          .pipe((res: Observable<HttpResponse<any>>) => {
              return res
          });
  }

    getInvoice(OTTSubscriberID: number, InvoiceNo: number, SubscriptionCategory: string) {
        var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
        headers = headers.append('Content-Type', 'application/json');
        return this.httpClient.get(this.userUrlService.getInvoice(OTTSubscriberID, InvoiceNo, SubscriptionCategory), { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    cancelAutoRenewal(OTTSubscriberID: number) {
        var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
        headers = headers.append('Content-Type', 'application/json');
        return this.httpClient.get(this.userUrlService.cancelAutoRenewal(OTTSubscriberID), { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getSubscriberDetail(OTTSubscriberID: number) {
      var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
      headers = headers.append('Content-Type', 'application/json');
      return this.httpClient.get(this.userUrlService.getSubscriberDetail(OTTSubscriberID), { headers })
          .pipe((res: Observable<HttpResponse<any>>) => {
              return res
          });
  }

    getBestOfferForSubscriber(OTTSubscriberID: number, dishd2hSubscriberID: string, subscriberCategory: number) {
        var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
        headers = headers.append('Content-Type', 'application/json');
        return this.httpClient.get(this.userUrlService.getBestOfferForSubscriber(OTTSubscriberID, dishd2hSubscriberID, subscriberCategory), { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    generateTransactionforRecharge(command: GenerateTransactionforRechargeCommand) {
        var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
        headers = headers.append('Content-Type', 'application/json');
        return this.httpClient.post(this.userUrlService.generateTransactionforRecharge(), command, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    updatePaymentStatusRecharge(command: UpdatePaymentStatusRechargeCommand) {
        var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
        headers = headers.append('Content-Type', 'application/json');
        return this.httpClient.post(this.userUrlService.updatePaymentStatusRecharge(), command, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    initateCancelSubscriptionRequest(command) {
      var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
      headers = headers.append('Content-Type', 'application/json');
      return this.httpClient.post(this.userUrlService.getIntiateCancelSubscription(), command, { headers: headers })
        .pipe((res: Observable<HttpResponse<any>>) => {
          return res
        });
    }

    cancelPaytmSubscription(command) {
      var headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      return this.httpClient.post(environment.SVOD_PAYTM.INITIAL_CANCEL_SUBSCRIPTION_URL, JSON.stringify(command), { headers: headers })
        .pipe((res: Observable<HttpResponse<any>>) => {
          return res
        });
    }

    cancelSubscriptionRequest(command) {
      var headers = new HttpHeaders().set('Authorization', this.appUtilService.getAuthKey());
      headers = headers.append('Content-Type', 'application/json');
      return this.httpClient.post(this.userUrlService.getCancelSubscriptionRequest(), command, { headers: headers })
        .pipe((res: Observable<HttpResponse<any>>) => {
          return res
        });
    }
}
