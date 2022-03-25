import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConstants } from '../typings/common-constants';
import { SignInCommand, SignInCommandMob } from '../typings/shared-typing';
import { SmsUrlService } from './sms-url.service';


@Injectable({
    providedIn: 'root',
})

export class SmsFormService {


    constructor(private httpClient: HttpClient, private smsUrlService: SmsUrlService) { }


    validateUser(emailId: string, type: string, usertype: string) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient.get(this.smsUrlService.register(emailId, type, usertype), { headers }).pipe((res: any) => {
            return res;
        },
            (error) => {
                return error;
            });

    }

    LoginPassword(command: SignInCommand, token: string): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.append(AppConstants.AUTH_HEADER_KEY, token)
        let options = {
            headers: headers,
            observe: 'response' as 'response'
        }
        return this.httpClient.post(this.smsUrlService.login(), command, { headers }).pipe((res: Observable<HttpResponse<any>>) => {

            return res;
        }, (error) => {
            return error;
        });
    }
    LoginPasswordMob(command: SignInCommandMob, token: string): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.append(AppConstants.AUTH_HEADER_KEY, token)

        return this.httpClient.post(this.smsUrlService.login(), command, { headers }).pipe((res: Observable<HttpResponse<any>>) => {

            return res;
        }, (error) => {
            return error;
        });
    }


    ResetPasswordLink(emailId: string, type: string, token: string) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.append(AppConstants.AUTH_HEADER_KEY, token)
        return this.httpClient.get(this.smsUrlService.resetlink(emailId, type), { headers }).pipe((res: any) => {
            return res;
        },
            (error) => {
                return error;
            });
    }

    RegisterUser(command: any, token: any): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.append(AppConstants.AUTH_HEADER_KEY, token)

        return this.httpClient.post(this.smsUrlService.registerUser(), command, { headers }).pipe((res: Observable<HttpResponse<any>>) => {

            return res;
        }, (error) => {
            return error;
        });
    }

    ValidateRegisterOTP(contact: string, otp: string, token) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.append(AppConstants.AUTH_HEADER_KEY, token)

        return this.httpClient.get(this.smsUrlService.ValidateOTP(contact, otp), { headers }).pipe((res: any) => {
            return res;
        },
            (error) => {
                return error;
            });
    }

    ResendOtp(emailId: string, type: string, token: string) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.append(AppConstants.AUTH_HEADER_KEY, token)

        return this.httpClient.get(this.smsUrlService.generateOtp(emailId, type), { headers }).pipe((res: any) => {
            return res;
        },
            (error) => {
                return error;
            });
    }


    ChangePassword(emailId: string, command: string, type: string) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.append(AppConstants.AUTH_HEADER_KEY, localStorage.getItem(AppConstants.AUTH_HEADER_KEY))

        return this.httpClient.get(this.smsUrlService.ChangePassword(emailId, command, type), { headers }).pipe((res: any) => {
            return res;
        },
            (error) => {
                return error;
            });
    }
    //   CheckAPI(){
    //         let headers = new HttpHeaders().set('Content-Type', 'application/json');
    //         headers = headers.append(AppConstants.AUTH_HEADER_KEY, localStorage.getItem(AppConstants.AUTH_HEADER_KEY))

    //         return this.httpClient.get(this.smsUrlService.chackapi() ,{ headers }).pipe((res: any) => {
    //             return res;
    //         },
    //             (error) => {
    //                 return error;
    //             });
    //   }

    getUserDetail(userName: string, loginType, token: string) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.append(AppConstants.AUTH_HEADER_KEY, token)

        return this.httpClient.get(this.smsUrlService.getUserDetail(userName, loginType), { headers }).pipe((res: any) => {
            return res;
        },
            (error) => {
                return error;
            });
    }

    ValidateRegisterOTPForEmail(emailId: string, otp: string, ottSMSID: string, token: string) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.append(AppConstants.AUTH_HEADER_KEY, token)

        return this.httpClient.get(this.smsUrlService.validateOTPForEmail(emailId, otp, ottSMSID), { headers }).pipe((res: any) => {
            return res;
        },
            (error) => {
                return error;
            });
    }

    ResendOtpForEmail(emailId: string, ottSMSID: string, token: string) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.append(AppConstants.AUTH_HEADER_KEY, token)

        return this.httpClient.get(this.smsUrlService.generateOtpForEmail(emailId, ottSMSID), { headers }).pipe((res: any) => {
            return res;
        },
            (error) => {
                return error;
            });
    }
}
