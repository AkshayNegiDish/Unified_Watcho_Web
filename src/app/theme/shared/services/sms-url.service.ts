import { Injectable } from '@angular/core';
import { SMSConstants } from '../typings/common-constants';
import { AppUtilService } from './app-util.service';



@Injectable({
  providedIn: 'root',
})
export class SmsUrlService {

  DMS: any;

  constructor(private appUtilService: AppUtilService) {
    this.DMS = this.appUtilService.getDmsConfig('sms url');
  }

  register(emailId: string, type: string, usertype: string): string {
    return `${this.DMS.params.SMSURL}${SMSConstants.API_VERSION}ValidateUserID/${emailId}/${type}/${usertype}`
  }

  login(): string {
    return `${this.DMS.params.SMSURL}${SMSConstants.API_VERSION}Login`

  }
  resetlink(emailId: string, type: string): string {
    return `${this.DMS.params.SMSURL}${SMSConstants.API_VERSION}SendResetPasswordLink/${emailId}/${type}`
  }
  registerUser(): string {
    return `${this.DMS.params.SMSURL}${SMSConstants.API_VERSION}RegisterUser`

  }

  ValidateOTP(contact: string, otp: string): string {
    return `${this.DMS.params.SMSURL}${SMSConstants.API_VERSION}ValidateOTP/${contact}/${otp}`
  }
  chackapi() {
    return `${this.DMS.params.SMSURL}${SMSConstants.API_VERSION}ResetPassword?userID=new123@gmail.com`

  }
  generateOtp(emailId: string, type: string): string {
    return `${this.DMS.params.SMSURL}${SMSConstants.API_VERSION}GenerateOTP/${emailId}/${type}`
  }

  ChangePassword(emailId: string, command: string, type: string): string {
    return `${this.DMS.params.SMSURL}${SMSConstants.API_VERSION}ChangePassword/${emailId}/${command}/${type}`
  }

  getUserDetail(userName: string, type: string): string {
    return `${this.DMS.params.SMSURL}${SMSConstants.API_VERSION}GetUserDetails/${userName}/${type}`;
  }

  generateOtpForEmail(emailId: string, ottSMSID: string): string {
    return `${this.DMS.params.SMSURL}${SMSConstants.API_VERSION}GenerateOTPForEmail/${emailId}/${ottSMSID}`;
  }

  validateOTPForEmail(emailId: string, otp: string, ottSMSID: string): string {
    return `${this.DMS.params.SMSURL}${SMSConstants.API_VERSION}ValidateOTPForEmail/${emailId}/${otp}/${ottSMSID}`;
  }
}