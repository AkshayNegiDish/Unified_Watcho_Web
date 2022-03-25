import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDateAdapter, NgbDateNativeAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { environment } from '../../../../environments/environment';
import { NgbDateCustomParserFormatter } from '../../pages/default/user-management/services/ngb-parser-formater.service';
import { AppUtilService } from '../services/app-util.service';
import { LoginMessageService } from '../services/auth';
import { KalturaAppService } from '../services/kaltura-app.service';
import { MediaUploadService } from '../services/media-upload.service';
import { PlatformIdentifierService } from '../services/platform-identifier.service';
import { UUID } from 'angular2-uuid';
import { SmsFormService } from '../services/sms-form.service';
import { SnackbarUtilService } from '../services/snackbar-util.service';
import { AppConstants, LoginModalName, SMSConstants, UserAttributes } from '../typings/common-constants';
import { FacebookCommand, NewUserRegisterCommand, SignInCommand, SignInCommandMob, SignUpCommand, UserDetails } from '../typings/shared-typing';
import { UserFormService } from '../../pages/default/user-management/services/user-form.service';



declare var $: any
declare var FB: any
declare var Moengage: any;

@Component({
  selector: 'signIn-modal',
  templateUrl: './signIn-signUp-modal.component.html',
  styleUrls: ['./signIn-signUp-modal.component.scss'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }]
})
export class SignInSignUpModalComponent implements OnInit {
  @ViewChild('uploadModal')
  uploadModalRef: ElementRef;

  @ViewChild('recommendationModal') recommendationModal: ElementRef;
  isBrowser: any

  fbAppID: string

  registerFormPasswordInputType: string
  eyeIconClass: string
  validationToken: string

  signInCommandMob: SignInCommandMob
  signUpCommand: SignUpCommand
  signInCommand: SignInCommand
  userDetails: UserDetails

  newUserRegisterCommand: NewUserRegisterCommand

  showLoginModal: boolean
  showRegisterModal: boolean
  showRegisterFormModal: boolean
  showOtpModal: boolean
  showForgotPasswordModal: boolean
  showOtpModalRegister: boolean
  showPasswordModal: boolean

  showPasswordInRegisterModal: boolean

  showLoader: boolean

  facebookRequest: FacebookCommand = new FacebookCommand()
  isSocialLogin: boolean

  isTab1Active: boolean
  isTab2Active: boolean

  termsOfUse: string = AppConstants.TERMS_OF_USE
  privacyPolicy: string = AppConstants.PRIVACY_POLICY

  userEmailContactInput: string
  userPassword: string
  userOtp: string
  newUserDateOfBirth: Date;
  newUserName: string
  newUserPassword: string
  newUserGender: string

  userEmailContactInputErrorMessage: string
  userPasswordErrorMessage: string
  userOtpErrorMessage: string

  newUserNameErrorMessage: string
  newUserPasswordErrorMessage: string
  newUserDateOfBirthErrorMessage: string

  loading: boolean

  devicesLimit: number
  householdId: number

  isDeviceAlreadyAdded: boolean
  imageChangedEvent: any;
  thumbnailSelected: boolean = false;
  thumbnailImageType: string;
  thumbnailCropped: boolean = false;
  thumbnailBase64Data: string;
  showThumbnailUploadLoader: boolean = false;
  selectedThumbnailFile: Blob;

  enableUploadButton: boolean;
  userPicUploadLink: any;
  uploadModalResultRef: NgbModalRef;
  userImage: string = "https://d1f8xt8ufwfd45.cloudfront.net/web/placeholder-images/user.png";
  userNameError: boolean;
  errorMessage: string;
  userGenderError: boolean;
  userDOBError: boolean;
  showProfilrDisplayLoader: boolean = false;
  modalLoading: boolean;
  filename: string;
  showLoginWithPassword: boolean = true;
  attribute: any;
  isUserImage: boolean = false;
  userAttributes: UserAttributes;
  isSigninSignup: boolean = false;
  isRegisteredWithEmailId: boolean = false;
  currentURL: string;

  constructor(@Inject(PLATFORM_ID) private platformId, public activeModal: NgbActiveModal, private modalService: NgbModal, private zone: NgZone,
    private loginMessageService: LoginMessageService, private smsService: SmsFormService, private userFormService: UserFormService,
    private kalturaAppService: KalturaAppService, private snackbarUtilService: SnackbarUtilService, private router: Router,
    private appUtilService: AppUtilService, private config: NgbDatepickerConfig, public mediaUploadService: MediaUploadService, private platformIdentifierService: PlatformIdentifierService) {

    // this.subscription = this.loginMessageService.currentMessage$.subscribe(message =>  this.message = message );
    this.isBrowser = isPlatformBrowser(platformId)
    this.signUpCommand = {
      OTTSubscriberID: null,
      UserID: null,
      Name: null,
      MobileNo: null,
      MobileVerified: null,
      EmailID: null,
      EmailVerified: null,
      Password: null,
      DateOfBirth: null,
      Gender: null,
      AccountStatus: null,
      isRegisteredWithSocialID: null,
      SocialAccountType: null,
      UniqueDeviceID: null,
      Platform: null
    }
    this.currentURL = router.url
    this.userDetails = {
      name: null,
      password: null,
      email: null,
      id: null
    }

    this.fbAppID = environment.FACEBOOK_APP_ID
    this.isSocialLogin = false

    this.isTab1Active = true
    this.isTab2Active = false

    this.showLoginModal = true
    this.showRegisterModal = false
    this.showRegisterFormModal = false
    this.showOtpModal = false
    this.showForgotPasswordModal = false
    this.showPasswordModal = false
    this.showOtpModalRegister = false

    this.registerFormPasswordInputType = 'password'
    this.eyeIconClass = 'la eye la-eye-slash'

    this.showPasswordInRegisterModal = false

    this.userEmailContactInputErrorMessage = null
    this.userPasswordErrorMessage = null
    this.userOtpErrorMessage = null

    this.userEmailContactInput = null
    this.userPassword = null
    this.userOtp = null
    this.newUserDateOfBirth = null
    this.newUserName = null
    this.newUserPassword = null
    this.newUserGender = null


    this.newUserNameErrorMessage = null
    this.newUserPasswordErrorMessage = null
    this.newUserDateOfBirthErrorMessage = null

    this.loading = false

    this.devicesLimit = null
    this.householdId = null

    this.isDeviceAlreadyAdded = false

    let currentDate = new Date()

    config.minDate = { year: 1930, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear() - 1, month: currentDate.getMonth() + 1, day: currentDate.getDate() };

    this.isRegisteredWithEmailId = false;
  }

  ngOnInit() {
    this.initializeFacebook();
    this.otpModalInputFocus();
    this.subscribeImageUploadStateHandler();
    if (this.platformIdentifierService.isBrowser()) {
      localStorage.setItem(AppConstants.IS_DISH_USER, 'false');
    }

    $(document).ready(() => {
      $("#otpInput2").keyup(function () { if ($(this).val().length == 4) { setTimeout(function () { $("#pin").focus() }, 5) } })
      $("#otpInput1").keyup(function () { if ($(this).val().length == 4) { setTimeout(function () { $("#otp2").focus() }, 5) } });
    });

  }

  initializeFacebook() {
    FB.init({
      appId: this.fbAppID,
      cookie: true,  // enable cookies to allow the server to access
      // the session
      xfbml: true,  // parse social plugins on this page
      version: 'v2.8' // use graph api version 2.8
    })
  }

  loginWithFB(getEmail?, inactiveUserModal?) {
    let data: any
    FB.login((result: any) => {
      data = result
      FB.api('/me', { fields: 'id,email,name,picture,permissions' }, (fbResponse: Object) => {
        this.zone.run(() => {

          if (data != undefined && data != null && data.authResponse != undefined && data.authResponse != null && fbResponse != undefined && fbResponse != null) {
            this.facebookRequest.accessToken = data.authResponse.accessToken
            this.facebookRequest.fbId = fbResponse['id']
            this.facebookRequest.emailId = fbResponse['email']
            this.facebookRequest.name = fbResponse['name']
            if (fbResponse['picture'] != null && fbResponse['picture']['data'] != null) {
              this.facebookRequest.profilePicUrl = fbResponse['picture']['data']['url']
            } else {
              this.facebookRequest.profilePicUrl = ""
            }

          }
          if (this.facebookRequest.emailId === undefined || this.facebookRequest.emailId === null) {
            this.facebookRequest.fbMail = false
            this.facebookRequest.emailId = ""
          } else {
            this.facebookRequest.fbMail = true
          }


          this.loginWithFacebook(this.facebookRequest, getEmail, inactiveUserModal)


        })
      })
    }, { scope: 'email,public_profile' })
  }



  loginWithFacebook(facebookRequest, getEmail?, inactiveUserModal?) {
    if (this.showRegisterModal) {
      this.validateNewUserFacebookEmail(facebookRequest);
      this.registeredInitiatedMoEngageEventWithFB();
    }
    if (this.showLoginModal) {
      this.validateFacebookEmail(facebookRequest);
    }

  }

  validateFacebookEmail(facebookRequest) {
    if (facebookRequest.fbMail) {
      this.isSocialLogin = true
      let userLoginType = SMSConstants.USER_SOCIAL_LOGIN_KEY
      let userInputType = SMSConstants.FACEBOOK_LOGIN_KEY
      this.loading = true
      this.smsService.validateUser(facebookRequest.emailId, userLoginType, userInputType).subscribe((response: any) => {
        this.loading = false
        if (response.ResultCode > 0) { // 1000 on success
          this.validationToken = response.Result
          if (this.isBrowser) {
          }
          this.getUserDetails(facebookRequest.emailId, response.Result)
        } else {
          if (this.isSocialLogin) {
            this.validateNewUserFacebookEmail(facebookRequest);
          } else {
            this.snackbarUtilService.showSnackbar(response.ResultDesc)
          }
        }
      }, (error) => {
        this.loading = false
        this.snackbarUtilService.showError()
      })
    } else {
      this.snackbarUtilService.showError('Your Email ID could not be retrieved via Facebook. <br> Please Enter your email id in Facebook and then try. <br>OR<br> Use another login mechanism')
    }
  }

  validateNewUserFacebookEmail(facebookRequest) {
    if (facebookRequest.fbMail) {
      this.newUserName = facebookRequest.name
      this.isSocialLogin = true
      let userLoginType = SMSConstants.NEW_USER_REGISTER_KEY
      let userInputType = SMSConstants.REGISTER_TYPE_EMAIL_KEY
      this.loading = true
      this.smsService.validateUser(facebookRequest.emailId, userLoginType, userInputType).subscribe((response: any) => {
        this.loading = false
        if (response.ResultCode > 0) { // 1000 on success
          this.validationToken = response.Result
          this.userEmailContactInput = facebookRequest.emailId
          if (this.isBrowser) {
            // localStorage.setItem(AppConstants.AUTH_HEADER_KEY, response.Result);
          }
          this.toogleModals(LoginModalName.REGISTER_FORM)
          this.gtmTagEventButtonClickFbRegistration();
        } else {
          this.snackbarUtilService.showSnackbar(response.ResultDesc)
        }
      }, (error) => {
        this.loading = false
        this.snackbarUtilService.showError()
      })
    } else {
      this.snackbarUtilService.showError('Your Email ID could not be retrieved via Facebook. <br> Please Enter your email id in Facebook and then try. <br>OR<br> Use another login mechanism')
      this.registeredInitiatedMoEngageEventWithFBError();
    }
  }



  getUserDetails(userName: string, token: any) {
    this.loading = true
    this.smsService.getUserDetail(userName, SMSConstants.FACEBOOK_LOGIN_KEY, token).subscribe((res: any) => {
      this.loading = false
      if (res.ResultCode > 0) {
        localStorage.setItem(AppConstants.USER_CATEGORY, 'social-login');
        localStorage.setItem(AppConstants.USER_DETAILS_SMS, JSON.stringify(res.Result));
        localStorage.removeItem(AppConstants.IS_DISH_USER);
        if (Number(res.Result.UserCategory === 1) || Number(res.Result.UserCategory === 2)) {
          localStorage.setItem(AppConstants.IS_DISH_USER, 'true');
        } else if (Number(res.Result.UserCategory === 3)) {
          localStorage.setItem(AppConstants.IS_DISH_USER, 'false');
        } else {
          localStorage.setItem(AppConstants.IS_DISH_USER, 'false');
        }
        this.loading = true
        this.kalturaAppService.userLogin(res.Result.OTTSubscriberID, res.Result.DishToken).then(response => {
          this.loading = false
          if (response.loginSession.ks) {
            this.loginMessageService.sendLoginMessage(true)
            if (this.isBrowser) {
              localStorage.removeItem(AppConstants.AUTH_HEADER_KEY)
              localStorage.setItem(AppConstants.AUTH_HEADER_KEY, this.validationToken)
              // localStorage.removeItem(AppConstants.KS_KEY)
              localStorage.setItem(AppConstants.KS_KEY, response.loginSession.ks)
              localStorage.removeItem(AppConstants.USER_DETAILS)
              localStorage.setItem(AppConstants.USER_DETAILS, JSON.stringify(response.user))
            }
            this.kalturaAppService.setKs()
            this.activeModal.close(response.user)
            this.snackbarUtilService.showSnackbar('Logged in successfully');
            this.gtmTagEventButtonClickFbLogin();
            this.houseHold();
            this.extendToken()
            // this.getSubscriptionHistory();
            this.showRecommendationModal(false);
          }
        }, reject => {
          this.loading = false
          this.snackbarUtilService.showError()
        })
      } else {
        this.snackbarUtilService.showSnackbar(res.ResultDesc)
      }
    }, (error) => {
      this.loading = false
      this.snackbarUtilService.showError()
    })
  }

  isValidEmail(input): boolean {
    // if (input.trim().match(/^.+@[^\.].*\.[a-z]{2,}$/)) {
    if (input.trim().match(/^([A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}?$)/)) {
      return true
    } else {
      return false
    }
  }

  isValidContactNumber(input): boolean {
    if (input.match(/^([0|\+[0-9]{1,5})?([0-9][0-9]{9})$/)) {
      return true
    } else {
      return false
    }
  }


  isUserEmailContactInputValid(): boolean {
    if (!this.userEmailContactInput) {
      this.userEmailContactInputErrorMessage = "Please enter a valid 10-digit Mobile Number or a valid Email Address"
      this.snackbarUtilService.showSnackbar(this.userEmailContactInputErrorMessage);
    } else if (this.isValidEmail(this.userEmailContactInput)) {
      this.userEmailContactInputErrorMessage = null
    } else if (this.isValidContactNumber(this.userEmailContactInput)) {
      this.userEmailContactInputErrorMessage = null
    } else {
      this.userEmailContactInputErrorMessage = "Please enter a valid 10-digit Mobile Number or valid Email Address"
      this.snackbarUtilService.showSnackbar(this.userEmailContactInputErrorMessage);
    }
    if (this.userEmailContactInputErrorMessage) {
      return false
    } else {
      return true
    }
  }

  validateUserLoginInput() {
    this.showLoginWithPassword = true;
    if (!this.isUserEmailContactInputValid()) {
      return
    }
    let userLoginType = ''
    let userInputType = ''
    let isInputEmail = false
    if (this.isValidEmail(this.userEmailContactInput)) {
      isInputEmail = true
      userLoginType = SMSConstants.WATCHO_LOGIN_KEY
      userInputType = SMSConstants.REGISTER_TYPE_EMAIL_KEY
    } else {
      isInputEmail = false
      userLoginType = SMSConstants.WATCHO_LOGIN_KEY
      userInputType = SMSConstants.REGISTER_TYPE_MOBILE_KEY
    }
    this.loading = true
    this.smsService.validateUser(this.userEmailContactInput.trim(), userLoginType, userInputType).subscribe((response: any) => {
      this.loading = false
      if (response.ResultCode > 0) { // 1000 on success
        this.validationToken = response.Result
        if (this.isBrowser) {
          // localStorage.setItem(AppConstants.AUTH_HEADER_KEY, response.Result);
        }
        if (isInputEmail) {
          this.toogleModals(LoginModalName.PASSWORD)
          this.gtmTagEventButtonClickContinueWatchoUser();
        } else {
          this.snackbarUtilService.showSnackbar('We have sent you an OTP on ' + this.userEmailContactInput.substr(0, 4) + 'xxxxxx. it is valid for 5 miniutes.')
          this.toogleModals(LoginModalName.OTP)
          this.gtmTagOnEnteredMobile();
        }
        this.loginInitiatedMoEngageEvent(this.userEmailContactInput);
      } else {
        this.snackbarUtilService.showSnackbar(response.ResultDesc)
        if (response.ResultCode === -1001) {
          this.loginInitiatedMoEngageEventWithIDError(this.userEmailContactInput);
        }
      }
    }, (error) => {
      this.loading = false
      this.snackbarUtilService.showError()
      this.loginInitiatedMoErrorEngageEvent(this.userEmailContactInput);
    })
  }

  isValidPassword(): boolean {
    if (!this.userPassword) {
      this.userPasswordErrorMessage = 'Please enter a password between 8 to 20 characters and must contain at least 1 special character'
      this.snackbarUtilService.showSnackbar(this.userPasswordErrorMessage);
    } else {
      if (this.userPassword.match(/^(?=.*[!&^%$#@()\\_+-])[A-Za-z0-9\\d!&^%$#@()\\_+-]{8,20}$/)) {
        this.userPasswordErrorMessage = null
      } else {
        this.userPasswordErrorMessage = 'Please enter a password between 8 to 20 characters and must contain at least 1 special character'
        this.snackbarUtilService.showSnackbar(this.userPasswordErrorMessage);
      }
    }
    if (this.userPasswordErrorMessage) {
      return false
    } else {
      return true
    }
  }

  isValidOtp() {
    if (this.showOtpModal) {
      this.getPinValue();
    }
    if (this.showOtpModalRegister) {
      this.getPinValueRegister();
    }
    if (!this.userOtp) {
      this.userOtpErrorMessage = 'The OTP entered by you is not correct or has been expired. Please enter the correct OTP or request for a new OTP'
      this.snackbarUtilService.showSnackbar(this.userOtpErrorMessage);
    } else {
      if (this.userOtp.toString().match(/^\d{4}$/)) {
        this.userOtpErrorMessage = null
      } else {
        this.userOtpErrorMessage = 'The OTP entered by you is not correct or has been expired. Please enter the correct OTP or request for a new OTP'
        this.snackbarUtilService.showSnackbar(this.userOtpErrorMessage);
      }
    }
    if (this.userOtpErrorMessage) {
      return false
    } else {
      return true
    }
  }

  userLogin() {
    if (this.showPasswordModal) {
      if (!this.isValidPassword()) {
        return
      }
      if (this.isValidEmail(this.userEmailContactInput)) {
        this.loginWithEmail()
      } else {
        this.loginWithPasswordFromPhoneNumber()
      }
    } else {
      if (!this.isValidOtp()) {
        this.loginCompleteMoEngageEventWithOTP();
        return
      }
      this.loginWithMobile()
    }
  }

  loginWithEmail(isFacebookLogin?: boolean) {
    let command = new SignInCommand()

    command.UserID = this.userEmailContactInput
    command.Platform = 'web'
    command.UserIDType = SMSConstants.REGISTER_TYPE_EMAIL_KEY

    if (isFacebookLogin) {
      command.Password = ''
    } else {
      command.Password = this.userPassword
    }

    this.loading = true
    this.smsService.LoginPassword(command, this.validationToken).subscribe((res: any) => {
      this.loading = false
      if (res.ResultCode > 0) {
        // 1003 is success
        localStorage.setItem(AppConstants.USER_CATEGORY, JSON.stringify(res.Result.UserCategory));
        localStorage.setItem(AppConstants.USER_DETAILS_SMS, JSON.stringify(res.Result));
        localStorage.removeItem(AppConstants.IS_DISH_USER);
        if (Number(res.Result.UserCategory === 1) || Number(res.Result.UserCategory === 2)) {
          localStorage.setItem(AppConstants.IS_DISH_USER, 'true');
        } else if (Number(res.Result.UserCategory === 3)) {
          localStorage.setItem(AppConstants.IS_DISH_USER, 'false');
        } else {
          localStorage.setItem(AppConstants.IS_DISH_USER, 'false');
        }
        this.loading = true
        this.kalturaAppService.userLogin(res.Result.OTTSubscriberID, res.Result.DishToken).then(response => {
          this.loading = false
          if (response.loginSession.ks) {
            this.loginMessageService.sendLoginMessage(true)
            if (this.isBrowser) {
              localStorage.removeItem(AppConstants.AUTH_HEADER_KEY)
              localStorage.setItem(AppConstants.AUTH_HEADER_KEY, this.validationToken)
              // localStorage.removeItem(AppConstants.KS_KEY)
              localStorage.setItem(AppConstants.KS_KEY, response.loginSession.ks)
              localStorage.removeItem(AppConstants.USER_DETAILS)
              localStorage.setItem(AppConstants.USER_DETAILS, JSON.stringify(response.user))
            }
            this.kalturaAppService.setKs()
            this.activeModal.close(response.user)
            this.snackbarUtilService.showSnackbar('Logged in successfully')
            this.houseHold();
            this.extendToken();
            this.loginCompleteMoEngageEvent(this.userEmailContactInput);
            this.gtmTagOnSignIn();
            // this.getSubscriptionHistory();
            this.showRecommendationModal(false);
          }
        }, reject => {
          this.loading = false
          this.snackbarUtilService.showError()
        })
      } else {
        this.snackbarUtilService.showError(res.ResultDesc)
        this.loginCompleteMoEngageWithInvalidPassword(this.userEmailContactInput);
      }
    }, (error) => {
      this.loading = false
      this.snackbarUtilService.showError()
    })
  }

  loginWithMobile() {
    let commandmob: SignInCommandMob = {
      UserID: this.userEmailContactInput,
      password: this.userOtp,
      IsLoggedInFromOTP: 'true',
      UserIDType: SMSConstants.REGISTER_TYPE_MOBILE_KEY,
    }

    this.loading = true
    this.smsService.LoginPasswordMob(commandmob, this.validationToken).subscribe((res: any) => {
      this.loading = false
      if (res.ResultCode > 0) { // 1003 is success
        localStorage.setItem(AppConstants.USER_CATEGORY, JSON.stringify(res.Result.UserCategory));
        localStorage.setItem(AppConstants.USER_DETAILS_SMS, JSON.stringify(res.Result));
        localStorage.removeItem(AppConstants.IS_DISH_USER);
        if (Number(res.Result.UserCategory === 1) || Number(res.Result.UserCategory === 2)) {
          localStorage.setItem(AppConstants.IS_DISH_USER, 'true');
        } else if (Number(res.Result.UserCategory === 3)) {
          localStorage.setItem(AppConstants.IS_DISH_USER, 'false');
        } else {
          localStorage.setItem(AppConstants.IS_DISH_USER, 'false');
        }
        this.loading = true
        this.kalturaAppService.userLogin(res.Result.OTTSubscriberID, res.Result.DishToken).then(response => {
          this.loading = false
          if (response.loginSession.ks) {
            this.loginMessageService.sendLoginMessage(true)
            if (this.isBrowser) {
              localStorage.removeItem(AppConstants.AUTH_HEADER_KEY)
              localStorage.setItem(AppConstants.AUTH_HEADER_KEY, this.validationToken)
              // localStorage.removeItem(AppConstants.KS_KEY)
              localStorage.setItem(AppConstants.KS_KEY, response.loginSession.ks)
              localStorage.removeItem(AppConstants.USER_DETAILS)
              localStorage.setItem(AppConstants.USER_DETAILS, JSON.stringify(response.user))
            }
            this.kalturaAppService.setKs()
            this.activeModal.close(response.user)
            this.snackbarUtilService.showSnackbar('Logged in successfully')
            this.houseHold();
            this.extendToken();
            this.loginCompleteMoEngageEventWithOTPForMobileNo();
            this.gtmTagOnEnteredOTP();
            // this.getSubscriptionHistory();
            this.showRecommendationModal(false);
            let category = res.Result.UserCategory
            let platform = category == '1' ? 'mydishtvspace' : 'myd2hspace';
            if (this.currentURL == '/bookDTH') {
              this.router.navigate([`/user/${platform}`]);
            }
          } else {
            this.snackbarUtilService.showError()
          }
        }, reject => {
          this.loading = false
          this.snackbarUtilService.showError()
        })
      } else {
        this.snackbarUtilService.showError('The OTP entered by you is not correct or has expired. Please enter the correct OTP or request for a new OTP.')
        this.loginCompleteMoEngageEventWithOTP();
      }
    }, (error) => {
      this.loading = false
      this.snackbarUtilService.showError()
    })
  }

  loginWithPasswordFromPhoneNumber() {
    let commandmob: SignInCommandMob = {
      UserID: this.userEmailContactInput,
      password: this.userPassword,
      IsLoggedInFromOTP: 'false',
      UserIDType: SMSConstants.REGISTER_TYPE_MOBILE_KEY,
    }

    this.loading = true
    this.smsService.LoginPasswordMob(commandmob, this.validationToken).subscribe((res: any) => {
      this.loading = false
      if (res.ResultCode > 0) { // 1003 is success
        localStorage.setItem(AppConstants.USER_CATEGORY, JSON.stringify(res.Result.UserCategory));
        localStorage.setItem(AppConstants.USER_DETAILS_SMS, JSON.stringify(res.Result));
        localStorage.removeItem(AppConstants.IS_DISH_USER);
        if (Number(res.Result.UserCategory === 1) || Number(res.Result.UserCategory === 2)) {
          localStorage.setItem(AppConstants.IS_DISH_USER, 'true');
        } else if (Number(res.Result.UserCategory === 3)) {
          localStorage.setItem(AppConstants.IS_DISH_USER, 'false');
        } else {
          localStorage.setItem(AppConstants.IS_DISH_USER, 'false');
        }
        this.loading = true
        this.kalturaAppService.userLogin(res.Result.OTTSubscriberID, res.Result.DishToken).then(response => {
          this.loading = false
          if (response.loginSession.ks) {
            this.loginMessageService.sendLoginMessage(true)
            if (this.isBrowser) {
              localStorage.removeItem(AppConstants.AUTH_HEADER_KEY)
              localStorage.setItem(AppConstants.AUTH_HEADER_KEY, this.validationToken)
              // localStorage.removeItem(AppConstants.KS_KEY)
              localStorage.setItem(AppConstants.KS_KEY, response.loginSession.ks)
              localStorage.removeItem(AppConstants.USER_DETAILS)
              localStorage.setItem(AppConstants.USER_DETAILS, JSON.stringify(response.user))
            }
            this.kalturaAppService.setKs()
            this.activeModal.close(response.user)
            this.snackbarUtilService.showSnackbar('Logged in successfully')
            this.houseHold();
            this.extendToken();
            this.loginCompleteMoEngageEventWithOTPOrPassword();
            // this.getSubscriptionHistory();
            this.showRecommendationModal(false);
          } else {
            this.snackbarUtilService.showError()
          }
        }, reject => {
          this.loading = false
          this.snackbarUtilService.showError()
        })
      } else {
        this.snackbarUtilService.showError(res.ResultDesc)
        this.loginCompleteMoEngageWithInvalidPassword(this.userEmailContactInput);
      }
    }, (error) => {
      this.loading = false
      this.snackbarUtilService.showError()
    })
  }

  resendOtp() {
    this.loading = true
    this.smsService.ResendOtp(this.userEmailContactInput, this.userEmailContactInput, this.validationToken).subscribe((res: any) => {
      this.loading = false
      if (res.ResultCode > 0) {
        this.snackbarUtilService.showSnackbar('We have sent you an OTP on ' + this.userEmailContactInput.substr(0, 4) + 'xxxxxx. it is valid for 5 miniutes.')
      } else {
        this.snackbarUtilService.showError(res.ResultDesc)
      }
    }, (error) => {
      this.loading = false
      this.snackbarUtilService.showError()
    })
  }

  resendOtpForEmail() {
    this.loading = true
    this.smsService.ResendOtpForEmail(this.userEmailContactInput, '0', this.validationToken).subscribe((res: any) => {
      this.loading = false
      if (res.ResultCode === 0) {
        this.snackbarUtilService.showSnackbar('We have sent you an OTP on ' + this.userEmailContactInput + '. it is valid for 5 miniutes.')
      } else {
        this.snackbarUtilService.showError(res.ResultDesc)
      }
    }, (error) => {
      this.loading = false
      this.snackbarUtilService.showError()
    })
  }

  isDishD2hUserInputValid(): boolean {
    if (!this.userEmailContactInput) {
      this.userEmailContactInputErrorMessage = "Please enter a valid 10-digit Mobile Number"
      this.snackbarUtilService.showSnackbar(this.userEmailContactInputErrorMessage);
    } else if (this.isValidContactNumber(this.userEmailContactInput)) {
      this.userEmailContactInputErrorMessage = null
    } else {
      this.userEmailContactInputErrorMessage = "Please enter a valid 10-digit Mobile Number"
      this.snackbarUtilService.showSnackbar(this.userEmailContactInputErrorMessage);
    }
    if (this.userEmailContactInputErrorMessage) {
      return false
    } else {
      return true
    }
  }

  signInDishD2hUser() {
    this.showLoginWithPassword = false;
    if (!this.isDishD2hUserInputValid()) {
      return
    }
    let userLoginType = SMSConstants.DISH_LOGIN_KEY
    let userInputType = SMSConstants.REGISTER_TYPE_MOBILE_KEY

    this.loading = true
    this.smsService.validateUser(this.userEmailContactInput, userLoginType, userInputType).subscribe((response: any) => {
      this.loading = false
      if (response.ResultCode > 0) { // 1000 on success
        this.validationToken = response.Result;
        if (this.isBrowser) {
          // localStorage.setItem(AppConstants.AUTH_HEADER_KEY, response.Result);
        }
        this.toogleModals(LoginModalName.OTP)
        this.loginInitiatedMoEngageEventForD2H(this.userEmailContactInput);
        this.gtmTagEventButtonClickContinueD2HUserSuccess();
      } else {
        this.snackbarUtilService.showSnackbar(response.ResultDesc)
        if (response.ResultCode === -1001) {
          this.loginInitiatedMoEngageEventForD2HWithIDError(this.userEmailContactInput);
        }
        this.gtmTagEventButtonClickContinueD2HUserUnSuccess();
      }
    }, (error) => {
      this.loading = false
      this.snackbarUtilService.showError()
      this.loginInitiatedMoErrorEngageEventForD2H(this.userEmailContactInput);
    })

  }

  forgotPassword() {
    if (!this.isUserEmailContactInputValid()) {
      return
    }
    let userLoginType = ''
    let userInputType = ''
    let isInputEmail = false
    if (this.isValidEmail(this.userEmailContactInput)) {
      isInputEmail = true
      userLoginType = SMSConstants.WATCHO_LOGIN_KEY
      userInputType = SMSConstants.REGISTER_TYPE_EMAIL_KEY
    } else {
      isInputEmail = false
      userLoginType = SMSConstants.WATCHO_LOGIN_KEY
      userInputType = SMSConstants.REGISTER_TYPE_MOBILE_KEY
    }
    this.loading = true
    this.smsService.validateUser(this.userEmailContactInput.trim(), userLoginType, userInputType).subscribe((response: any) => {
      this.loading = false
      if (response.ResultCode > 0) { // 1000 on success
        if (this.isBrowser) {
          // localStorage.setItem(AppConstants.AUTH_HEADER_KEY, response.Result);
        }
        this.sendRestPasswordLink(response.Result)
        this.clickForgotPasswordSuccessMoEngageEvent();
      } else {
        this.snackbarUtilService.showSnackbar(response.ResultDesc)
        this.clickForgotPasswordErrorMoEngageEvent();
      }
    }, (error) => {
      this.loading = false
      this.snackbarUtilService.showError()
    })
  }

  sendRestPasswordLink(token: string) {
    let userInputType = ''
    if (this.isValidEmail(this.userEmailContactInput)) {
      userInputType = SMSConstants.REGISTER_TYPE_EMAIL_KEY
    } else {
      userInputType = SMSConstants.REGISTER_TYPE_MOBILE_KEY
    }
    this.loading = true
    this.smsService.ResetPasswordLink(this.userEmailContactInput.trim(), userInputType, token).subscribe((response: any) => {
      this.loading = false
      if (response.ResultCode > 0) { // 1010 on success
        if (this.isBrowser) {
        }
        this.toogleModals(LoginModalName.LOGIN)
        this.snackbarUtilService.showSnackbar(response.ResultDesc)
      } else {
        this.snackbarUtilService.showSnackbar(response.ResultDesc)
      }
    }, (error) => {
      this.loading = false
      this.snackbarUtilService.showError()
    })
  }

  validateOtpForRegister() {

    if (!this.isValidOtp()) {
      return
    }

    this.loading = true
    this.smsService.ValidateRegisterOTP(this.userEmailContactInput, this.userOtp, this.validationToken).subscribe((res: any) => {
      this.loading = false
      if (res.ResultCode > 0) {
        this.snackbarUtilService.showSnackbar(res.ResultDesc)
        this.toogleModals(LoginModalName.REGISTER_FORM)
        this.registerCompleteMoEngagEvent(this.userEmailContactInput);
      } else {
        this.snackbarUtilService.showError('The OTP entered by you is not correct or has expired. Please enter the correct OTP or request for a new OTP.')
        this.registeredInitiatedForOTPMoEngageEvent();
      }
    }, (error) => {
      this.loading = false
      this.snackbarUtilService.showError()
      this.registerCompleteMoEngagEventError(this.userEmailContactInput);
    })


  }

  validateOtpForRegisterEmail() {
    if (!this.isValidOtp()) {
      return
    }

    this.loading = true
    this.smsService.ValidateRegisterOTPForEmail(this.userEmailContactInput, this.userOtp, '0', this.validationToken).subscribe((res: any) => {
      this.loading = false
      if (res.ResultCode === 0) {
        this.snackbarUtilService.showSnackbar(res.ResultDesc)
        this.toogleModals(LoginModalName.REGISTER_FORM)
        this.registerCompleteMoEngagEvent(this.userEmailContactInput);
      } else {
        this.snackbarUtilService.showError('The OTP entered by you is not correct or has expired. Please enter the correct OTP or request for a new OTP.')
        this.registeredInitiatedForOTPMoEngageEvent();
      }
    }, (error) => {
      this.loading = false
      this.snackbarUtilService.showError()
      this.registerCompleteMoEngagEventError(this.userEmailContactInput);
    })
  }

  newUserValidateInput() {
    if (!this.isUserEmailContactInputValid()) {
      return
    }

    let userLoginType = ''
    let userInputType = ''
    let isInputEmail = false
    if (this.isValidEmail(this.userEmailContactInput)) {
      this.isRegisteredWithEmailId = true;
      isInputEmail = true
      userLoginType = SMSConstants.NEW_USER_REGISTER_KEY
      userInputType = SMSConstants.REGISTER_TYPE_EMAIL_KEY
    } else {
      this.isRegisteredWithEmailId = false;
      isInputEmail = false
      userLoginType = SMSConstants.NEW_USER_REGISTER_KEY
      userInputType = SMSConstants.REGISTER_TYPE_MOBILE_KEY
    }
    this.loading = true
    this.smsService.validateUser(this.userEmailContactInput.trim(), userLoginType, userInputType).subscribe((response: any) => {
      this.loading = false
      if (response.ResultCode > 0) { // 1000 on success
        this.validationToken = response.Result
        if (this.isBrowser) {
          // localStorage.setItem(AppConstants.AUTH_HEADER_KEY, response.Result);
        }
        if (isInputEmail) {
          // this.toogleModals(LoginModalName.REGISTER_FORM)
          this.toogleModals(LoginModalName.OTP_REGISTER);
          this.resendOtpForEmail();
          this.snackbarUtilService.showSnackbar('We have sent an OTP on ' + this.userEmailContactInput + '. it is valid for 5 miniutes.')
          this.gtmTagEventButtonClickNewUserContinue();
        } else {
          this.snackbarUtilService.showSnackbar('We have sent an OTP on ' + this.userEmailContactInput.substr(0, 4) + 'xxxxxx. it is valid for 5 miniutes.')
          this.toogleModals(LoginModalName.OTP_REGISTER)
          this.gtmTagEventButtonClickNewUserContinue();
        }
        this.registeredInitiatedMoEngageEvent(this.userEmailContactInput);
      } else {
        this.snackbarUtilService.showSnackbar(response.ResultDesc)
        if (response.ResultCode === -1002) {
          this.registeredInitiatedForDuplicationIDMoEngageEvent(this.userEmailContactInput);
        }
      }
    }, (error) => {
      this.loading = false
      this.snackbarUtilService.showError()
      this.registeredInitiatedErrorMoEngageEvent(this.userEmailContactInput);
    })

  }

  isNewUserInputValid() {
    // signUpCommand.Password
    // signUpCommand.Name
    // userDateOfBirth
    if (this.newUserName) {
      this.newUserNameErrorMessage = null
    } else {
      this.newUserNameErrorMessage = 'Name is required'
      this.snackbarUtilService.showSnackbar(this.newUserNameErrorMessage);
      return;
    }

    if (this.showPasswordInRegisterModal) {
      if (this.newUserPassword) {
        if (this.newUserPassword.match(/^(?=.*[!&^%$#@()\\_+-])[A-Za-z0-9\\d!&^%$#@()\\_+-]{8,20}$/)) {
          this.newUserPasswordErrorMessage = null
        } else {
          this.newUserPasswordErrorMessage = 'Please enter a password between 8 to 20 characters and must contain at least 1 special character'
          this.snackbarUtilService.showSnackbar(this.newUserPasswordErrorMessage);
          return;
        }
      } else {
        this.newUserPasswordErrorMessage = 'Password is required'
        this.snackbarUtilService.showSnackbar(this.newUserPasswordErrorMessage);
        return;
      }
    }

    // if (this.newUserDateOfBirth) {
    //   this.newUserDateOfBirthErrorMessage = null
    // } else {
    //   this.newUserDateOfBirthErrorMessage = 'dob is required'
    // }

    if (this.isSocialLogin) {
      this.newUserPasswordErrorMessage = null
    }

    if (this.newUserNameErrorMessage || this.newUserPasswordErrorMessage) {
      return false
    } else {
      return true
    }

  }

  newUserRegistration() {
    if (!this.isNewUserInputValid()) {
      if (this.isSocialLogin) {
        this.registerCompleteMoEngagEventForFBErrorMandatoryField();
      } else {
        this.registerCompleteMoEngagEventErrorForMandatoryField(this.userEmailContactInput);
      }
      return
    }
    // this.signUpCommand.OTTSubscriberID = 0;
    // this.signUpCommand.UserID = this.userEmailContactInput;
    // this.signUpCommand.Name = null;
    // this.signUpCommand.MobileNo = null;
    // this.signUpCommand.MobileVerified = false;
    // this.signUpCommand.EmailID = this.userEmailContactInput;
    // this.signUpCommand.EmailVerified = false;
    // this.signUpCommand.Password = null;
    // this.signUpCommand.DateOfBirth = this.newUserDateOfBirth.day + '-' + this.newUserDateOfBirth.month + '-' + this.newUserDateOfBirth.year;
    // this.signUpCommand.Gender = null;
    // this.signUpCommand.AccountStatus = "";
    // this.signUpCommand.isRegisteredWithSocialID = false;
    // this.signUpCommand.SocialAccountType = 0;

    // {
    //   "UserID": "maverick9739@gmail.com",
    //   "Name": "Saurav Tripathi",
    //   "EmailID": "maverick9739@gmail.com",
    //   "isRegisteredWithSocialID": true,
    //   "MobileNo": "",
    //   "SocialAccountType": 1,
    //   "Password": "",
    //   "DateOfBirth": "3/December/2000",
    //   "Gender": "Male"
    // }

    let registerCommand = new NewUserRegisterCommand()
    registerCommand.ProfileImagePath = this.userImage;
    registerCommand.Gender = this.newUserGender
    registerCommand.Name = this.newUserName
    registerCommand.UserID = this.userEmailContactInput
    registerCommand.Platform = "Web";
    if (this.userImage) {
      registerCommand.ProfileImagePath = this.userImage;
    } else {
      registerCommand.ProfileImagePath = 'https://d1f8xt8ufwfd45.cloudfront.net/web/placeholder-images/user.png';
    }
    if (this.newUserDateOfBirth) {
      registerCommand.DateOfBirth = this.newUserDateOfBirth.toDateString();
    } else {
      registerCommand.DateOfBirth = '';
    }
    if (this.isValidEmail(this.userEmailContactInput)) {
      if (!this.isSocialLogin) {
        registerCommand.EmailVerified = true;
      }
      registerCommand.EmailID = this.userEmailContactInput
      registerCommand.MobileNo = ''
    } else {
      registerCommand.EmailID = ''
      registerCommand.MobileNo = this.userEmailContactInput
    }

    if (this.isSocialLogin) {
      registerCommand.isRegisteredWithSocialID = true
      registerCommand.SocialAccountType = 1
      registerCommand.Password = ''
    } else {
      registerCommand.isRegisteredWithSocialID = false
      registerCommand.SocialAccountType = 0
      registerCommand.Password = this.newUserPassword
    }
    registerCommand.UniqueDeviceID = 'WEB-' + UUID.UUID();
    localStorage.setItem(AppConstants.UDID_KEY, registerCommand.UniqueDeviceID);

    this.loading = true
    this.smsService.RegisterUser(registerCommand, this.validationToken).subscribe((res: any) => {
      this.loading = false;
      if (this.isSocialLogin) {
        this.registerCompleteMoEngagEventForFB();
      } else {
        this.registerCompleteMoEngagEvent(this.userEmailContactInput);
      }
      localStorage.setItem(AppConstants.USER_CATEGORY, JSON.stringify(res.Result.UserCategory));
      localStorage.setItem(AppConstants.USER_DETAILS_SMS, JSON.stringify(res.Result));
      localStorage.removeItem(AppConstants.IS_DISH_USER);
      if (Number(res.Result.UserCategory === 1) || Number(res.Result.UserCategory === 2)) {
        localStorage.setItem(AppConstants.IS_DISH_USER, 'true');
      } else if (Number(res.Result.UserCategory === 3)) {
        localStorage.setItem(AppConstants.IS_DISH_USER, 'false');
      } else {
        localStorage.setItem(AppConstants.IS_DISH_USER, 'false');
      }
      if (res.ResultCode > 0) {
        this.loading = true
        this.kalturaAppService.userLogin(res.Result.OTTSubscriberID, res.Result.DishToken).then(response => {
          if (response.loginSession.ks) {
            if (this.isBrowser) {
              // localStorage.removeItem(AppConstants.KS_KEY)
              localStorage.setItem(AppConstants.KS_KEY, response.loginSession.ks)
              localStorage.removeItem(AppConstants.USER_DETAILS)
              localStorage.setItem(AppConstants.USER_DETAILS, JSON.stringify(response.user))
              localStorage.removeItem(AppConstants.AUTH_HEADER_KEY)
              localStorage.setItem(AppConstants.AUTH_HEADER_KEY, this.validationToken)
            }
            this.kalturaAppService.setKs()
            this.loginMessageService.sendLoginMessage(true)
            this.activeModal.close(response.user)
            this.snackbarUtilService.showSnackbar('Registration successful')
            this.gtmTagOnRegisterSuccessful(registerCommand.Gender);
            this.houseHold();
            this.extendToken()
            this.loginMessageService.imageChangedMessage(true);
            this.showRecommendationModal(true);
          }
        }, reject => {
          this.loading = false
          this.snackbarUtilService.showError()
        })
      }
      else {
        this.snackbarUtilService.showError(res.ResultDesc)
      }
    }, (error) => {
      this.loading = false
      this.snackbarUtilService.showError()
      if (this.isSocialLogin) {
        this.registerCompleteMoEngagEventForFBError();
      } else {
        this.registerCompleteMoEngagEventError(this.userEmailContactInput);
      }
    })

  }

  registerUser() {

  }

  resetRegisterFormError(inputNumber?: number) {
    if (inputNumber) {
      if (inputNumber === 0) {
        this.newUserNameErrorMessage = null
      }

      if (inputNumber === 2) {
        this.newUserPasswordErrorMessage = null
      }

      if (inputNumber === 3) {
        this.newUserDateOfBirthErrorMessage = null
      }
    } else {
      this.newUserNameErrorMessage = null
      this.newUserPasswordErrorMessage = null
      this.newUserDateOfBirthErrorMessage = null
    }
  }

  extendToken() {
    // if (this.isBrowser) {
    //   setTimeout(() => {
    this.loading = true
    this.kalturaAppService.addToken().then(res => {
      this.loading = false
      // this.houseHold()
    }, reject => {
      this.loading = false
      this.snackbarUtilService.showError()
    })
    // }, 100)
  }

  // }

  houseHold() {
    this.loading = true
    this.kalturaAppService.getHousehold().then(res => {
      this.loading = false
      this.devicesLimit = res.devicesLimit
      this.householdId = res.id
      this.getHouseholdDeviceList()
    }, reject => {
      this.loading = false
      this.snackbarUtilService.showError()
    })
  }

  getHouseholdDeviceList() {
    this.loading = true
    this.kalturaAppService.getHouseholdList().then(res => {

      this.loading = false
      // if (res.totalCount > this.devicesLimit) {
      //   this.router.navigate(['/user/settings/your-devices-limit-exceeded']);
      // } else if (res.totalCount === this.devicesLimit) {
      //   if (this.checkDeviceAlreadyAdded(res)) {
      //     // user logged in
      //     this.reloadActivatedRoute();
      //   } else {
      //     this.router.navigate(['/user/settings/your-devices-limit-exceeded']);
      //   }
      // } else {
      if (this.checkDeviceAlreadyAdded(res)) {
        // user logged in
        this.reloadActivatedRoute();
      } else {
        this.addDeviceToHousehold();
      }
      // }

    }, reject => {
      this.loading = false
      this.snackbarUtilService.showError()
    })
  }

  checkDeviceAlreadyAdded(res): boolean {
    let isDeviceAdded = false
    if (this.isBrowser) {
      let udid = this.appUtilService.getDeviceId();
      if (res.objects) {
        res.objects.forEach((element, index) => {
          if (element.udid === udid) {
            isDeviceAdded = true
          }
        })
      }
      return isDeviceAdded
    }
  }

  addDeviceToHousehold() {
    this.loading = true
    this.kalturaAppService.addHouseholdDevice(this.appUtilService.getBrowserDetails()).then(response => {
      // this.snackbarUtilService.showError('device added..');
      this.reloadActivatedRoute();
    }, reject => {
      this.loading = false
      this.snackbarUtilService.showError(reject.message);
    })
  }

  toogleTabs(id) {
    this.resetErrors()
    this.resetValues()
    if (id === 1) {
      this.isTab1Active = true
      this.isTab2Active = false
      // For Watcho user identifier
      if (this.platformIdentifierService.isBrowser()) {
        localStorage.setItem(AppConstants.IS_DISH_USER, 'false');
        this.gtmTagEventButtonClickWatchoUser();
      }
    } else {
      // For Dish D2H user identifier
      if (this.platformIdentifierService.isBrowser()) {
        localStorage.setItem(AppConstants.IS_DISH_USER, 'true');
        this.gtmTagEventButtonClickD2HUserSuccess();
      }
      this.isTab1Active = false
      this.isTab2Active = true
    }
  }

  gotoForgotPasswordModal() {
    this.toogleModals(LoginModalName.FORGOT_PASSWORD)
    this.appUtilService.moEngageEventTrackingWithNoAttribute("FORGOT_PASSWORD");
    this.gtmTagEventButtonClickForgotPassword();
  }

  gotoLoginModal() {
    this.toogleModals(LoginModalName.LOGIN)
    this.appUtilService.moEngageEventTrackingWithNoAttribute("EXISTING_USER_LINK_CLICKED");
  }

  gotoRegisterModal() {
    this.toogleModals(LoginModalName.REGISTER)
    this.appUtilService.moEngageEventTrackingWithNoAttribute("NEW_USER_LINK_CLICKED");
    this.gtmTagOnNewUser();
  }

  gotoRegisterFormModal() {
    this.toogleModals(LoginModalName.REGISTER_FORM)
  }

  gotoPasswordModal() {
    this.toogleModals(LoginModalName.PASSWORD);
  }

  toogleModals(modalName: any) {
    this.resetErrors()
    if (modalName === LoginModalName.LOGIN) {
      this.resetValues()
      this.showLoginModal = true
      this.showRegisterModal = false
      this.showRegisterFormModal = false
      this.showOtpModal = false
      this.showForgotPasswordModal = false
      this.showPasswordModal = false
      this.showOtpModalRegister = false
    } else if (modalName === LoginModalName.REGISTER) {
      this.resetValues()
      this.showLoginModal = false
      this.showRegisterModal = true
      this.showRegisterFormModal = false
      this.showOtpModal = false
      this.showForgotPasswordModal = false
      this.showPasswordModal = false
      this.showOtpModalRegister = false
    } else if (modalName === LoginModalName.REGISTER_FORM) {
      // this.resetValues();
      if (this.isSocialLogin) {
        this.showPasswordInRegisterModal = false
      } else {
        this.showPasswordInRegisterModal = true
      }
      this.selectMale()
      this.showLoginModal = false
      this.showRegisterModal = false
      this.showRegisterFormModal = true
      this.showOtpModal = false
      this.showForgotPasswordModal = false
      this.showPasswordModal = false
      this.showOtpModalRegister = false
    } else if (modalName === LoginModalName.OTP) {
      this.showLoginModal = false
      this.showRegisterModal = false
      this.showRegisterFormModal = false
      this.showOtpModal = true
      this.showForgotPasswordModal = false
      this.showPasswordModal = false
      this.showOtpModalRegister = false
      $("#codeBox1").val('');
      $("#codeBox2").val('');
      $("#codeBox3").val('');
      $("#codeBox4").val('');
      $("#codeBox1").focus();
    } else if (modalName === LoginModalName.FORGOT_PASSWORD) {
      this.resetValues()
      this.showLoginModal = false
      this.showRegisterModal = false
      this.showRegisterFormModal = false
      this.showOtpModal = false
      this.showForgotPasswordModal = true
      this.showPasswordModal = false
      this.showOtpModalRegister = false
    } else if (modalName === LoginModalName.PASSWORD) {
      this.showLoginModal = false
      this.showRegisterModal = false
      this.showRegisterFormModal = false
      this.showOtpModal = false
      this.showForgotPasswordModal = false
      this.showPasswordModal = true
      this.showOtpModalRegister = false
    } else if (modalName === LoginModalName.OTP_REGISTER) {
      // this.resetValues();
      this.showLoginModal = false
      this.showRegisterModal = false
      this.showRegisterFormModal = false
      this.showOtpModal = false
      this.showForgotPasswordModal = false
      this.showPasswordModal = false
      this.showOtpModalRegister = true
      $("#codeBoxRegister1").val('');
      $("#codeBoxRegister2").val('');
      $("#codeBoxRegister3").val('');
      $("#codeBoxRegister4").val('');
      $("#codeBoxRegister1").focus();

    }

  }

  resetErrors() {
    this.userEmailContactInputErrorMessage = null
    this.userPasswordErrorMessage = null
    this.userOtpErrorMessage = null
    this.resetRegisterFormError()
  }

  resetValues() {
    this.userEmailContactInput = null
    this.userPassword = null
    this.userOtp = null
    this.newUserName = null
    this.newUserPassword = null
    this.newUserDateOfBirth = null
    this.newUserGender = null
    this.isSocialLogin = false;
    this.userImage = null;
    this.thumbnailSelected = false;
    this.thumbnailCropped = false;
    this.showThumbnailUploadLoader = false;
    this.enableUploadButton = false;
    this.selectedThumbnailFile = null;
    if (this.isBrowser) {
      $('#female, #male').removeClass("radcolor")
    }
    $("#codeBoxRegister1").val('');
    $("#codeBoxRegister2").val('');
    $("#codeBoxRegister3").val('');
    $("#codeBoxRegister4").val('');
    $("#codeBox1").val('');
    $("#codeBox2").val('');
    $("#codeBox3").val('');
    $("#codeBox4").val('');
  }

  validateUser() {

  }


  selectMale() {
    if (this.isBrowser) {
      $('#male').toggleClass("radcolor")
      $('#female').removeClass("radcolor")
    }
    this.newUserGender = 'male'
  }
  selectFemale() {
    if (this.isBrowser) {
      $('#female').toggleClass("radcolor")
      $('#male').removeClass("radcolor")
    }
    this.newUserGender = 'female'
  }

  toogleEyeIcon() {
    if (this.registerFormPasswordInputType === "password") {
      this.registerFormPasswordInputType = "text"
      this.eyeIconClass = 'la eye la-eye'
    }
    else {
      this.registerFormPasswordInputType = "password"
      this.eyeIconClass = 'la eye la-eye-slash'
    }
  }

  backButton() {
    this.gotoLoginModal()
    this.gtmTagOnBackButton();
  }

  changeOnRegisterForm() {
    this.toogleModals(LoginModalName.REGISTER)
  }

  reloadActivatedRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/search', { skipLocationChange: true }).then(() =>
      this.router.navigateByUrl(currentUrl));
  }

  otpModalInputFocus() {


  }

  openImageUploadModal() {
    this.uploadModalResultRef = this.modalService.open(this.uploadModalRef);
  }

  videoThumbnailSelected(e) {
    if (e.target.files.length > 0) {
      this.openImageUploadModal();
      this.imageChangedEvent = e;
      this.thumbnailSelected = true;

      var fileName: string = e.target.files[0].name;

      this.thumbnailImageType = fileName.slice(fileName.lastIndexOf('.'), fileName.length);
    }
  }

  cropImage(imageCropper: ImageCropperComponent) {
    imageCropper.crop();
  }

  cancelImageSelect(imageCropper: ImageCropperComponent) {
    $('#uploadThumbnailFile').val('');
    this.uploadModalResultRef.close();
    this.thumbnailSelected = false;
    this.thumbnailImageType = null;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.thumbnailCropped = true;
    this.thumbnailBase64Data = event.base64;
    $('.thumbnail-img').attr('src', this.thumbnailBase64Data);
  }

  croppedImageLoaded() {
    this.showThumbnailUploadLoader = true;
    fetch(this.thumbnailBase64Data)
      .then(res => res.blob())
      .then(blob => {
        this.selectedThumbnailFile = new Blob([blob]);
        this.filename = new Date().getTime() + this.thumbnailImageType;
        // upload to s3
        this.uploadThumbnailToS3();
      })
  }

  uploadThumbnailToS3() {
    this.modalLoading = true;
    this.mediaUploadService.uploadImageToS3(null, "userPic", this.selectedThumbnailFile, this.filename);
    $('#uploadThumbnailFile').val('');
  }

  subscribeImageUploadStateHandler() {
    this.mediaUploadService.imageUploadStateSubject$.subscribe((msgObserver: any) => {
      if (msgObserver !== null && msgObserver !== undefined) {
        this.showThumbnailUploadLoader = false;
        this.enableUploadButton = true;
        this.userPicUploadLink = msgObserver.Location;
        this.userImage = environment.PROFILE_PIC_CLOUDFRONT_URL + this.userPicUploadLink.slice(this.userPicUploadLink.lastIndexOf('/') + 1, this.userPicUploadLink.length);
        if (this.uploadModalResultRef) {
          this.uploadModalResultRef.close();
        }
        this.thumbnailSelected = false;
        this.thumbnailCropped = false;
        this.showThumbnailUploadLoader = false;
        this.enableUploadButton = false;
        this.selectedThumbnailFile = null;
      }
    });
  }

  browseThumbnail() {
    //commented as this functionality is not is scope right now
    $('#uploadThumbnailFile').click();
  }

  loginWithPassword() {
    this.gotoPasswordModal();
    this.gtmTagOnLoginWithPassword();
  }

  clickForgotPasswordSuccessMoEngageEvent() {
    this.attribute = {
      status: "initiated_successfully"
    }
    this.appUtilService.moEngageEventTracking("FORGOT_PASSWORD_INITIATE", this.attribute);
  }

  clickForgotPasswordErrorMoEngageEvent() {
    this.attribute = {
      status: "id_validation_error"
    }
    this.appUtilService.moEngageEventTracking("FORGOT_PASSWORD_INITIATE", this.attribute);
  }

  getCodeBoxElement(index: number): any {
    return document.getElementById('codeBox' + index);
  }
  onKeyUpEvent(index: number, event: any) {
    const eventCode = event.which || event.keyCode;
    if (this.getCodeBoxElement(index).value.length === 1) {
      if (index !== 4) {
        this.getCodeBoxElement(index + 1).focus();
      } else {
        this.getCodeBoxElement(index).blur();
        this.getPinValue();
        $("#codeBox4").focus();
      }
    }
    if (eventCode === 8 && index !== 1) {
      this.getCodeBoxElement(index - 1).focus();
    }
  }
  onFocusEvent(index) {
    for (let item = 1; item < index; item++) {
      const currentElement = this.getCodeBoxElement(item);
      if (!currentElement.value) {
        currentElement.focus();
        break;
      }
    }
  }

  getPinValue() {
    let val = $("#codeBox1").val() + $("#codeBox2").val() + $("#codeBox3").val() + $("#codeBox4").val();
    this.userOtp = val;
  }

  getCodeBoxElementRegister(index: number): any {
    return document.getElementById('codeBoxRegister' + index);
  }
  onKeyUpEventRegister(index: number, event: any) {
    const eventCode = event.which || event.keyCode;
    if (this.getCodeBoxElementRegister(index).value.length === 1) {
      if (index !== 4) {
        this.getCodeBoxElementRegister(index + 1).focus();
      } else {
        this.getCodeBoxElementRegister(index).blur();
        this.getPinValueRegister();
        $("#codeBoxRegister4").focus();
      }
    }
    if (eventCode === 8 && index !== 1) {
      this.getCodeBoxElementRegister(index - 1).focus();
    }
  }
  onFocusEventRegister(index) {
    for (let item = 1; item < index; item++) {
      const currentElement = this.getCodeBoxElementRegister(item);
      if (!currentElement.value) {
        currentElement.focus();
        break;
      }
    }
  }

  getPinValueRegister() {
    let val = $("#codeBoxRegister1").val() + $("#codeBoxRegister2").val() + $("#codeBoxRegister3").val() + $("#codeBoxRegister4").val();
    this.userOtp = val;
  }

  loginInitiatedMoEngageEvent(userEmailContactInput: any) {
    let loginInitiated: any;
    if (this.isValidEmail(userEmailContactInput)) {
      loginInitiated = {
        id_type: 'email_id_watcho',
        source: 'header_web',
        status: 'validation_successful'
      }
    } else if (this.isValidContactNumber(userEmailContactInput)) {
      loginInitiated = {
        id_type: 'mobile_number_watcho',
        source: 'header_web',
        status: 'validation_successful'
      }
    }
    this.appUtilService.moEngageEventTracking('LOGIN_INITIATED', loginInitiated);
  }

  loginInitiatedMoErrorEngageEvent(userEmailContactInput: any) {
    let loginInitiated: any;
    if (this.isValidEmail(userEmailContactInput)) {
      loginInitiated = {
        id_type: 'email_id_watcho',
        source: 'header_web',
        status: 'other_error'
      }
    } else if (this.isValidContactNumber(userEmailContactInput)) {
      loginInitiated = {
        id_type: 'mobile_number_watcho',
        source: 'header_web',
        status: 'other_error'
      }
    }
    this.appUtilService.moEngageEventTracking('LOGIN_INITIATED', loginInitiated);
  }

  loginInitiatedMoEngageEventForD2H(userEmailContactInput: any) {
    let loginInitiated: any;
    if (this.isValidContactNumber(userEmailContactInput)) {
      loginInitiated = {
        id_type: 'rmn_dishd2h',
        source: 'header_web',
        status: 'validation_successful'
      }
    }
    this.appUtilService.moEngageEventTracking('LOGIN_INITIATED', loginInitiated);
  }

  loginInitiatedMoErrorEngageEventForD2H(userEmailContactInput: any) {
    let loginInitiated: any;
    if (this.isValidContactNumber(userEmailContactInput)) {
      loginInitiated = {
        id_type: 'rmn_dishd2h',
        source: 'header_web',
        status: 'other_error'
      }
    }
    this.appUtilService.moEngageEventTracking('LOGIN_INITIATED', loginInitiated);
  }

  loginInitiatedMoEngageEventWithIDError(userEmailContactInput: any) {
    let registeredInitiated: any;
    if (this.isValidEmail(userEmailContactInput)) {
      registeredInitiated = {
        id_type: 'email_id_watcho',
        source: 'header_web',
        status: 'ID_not_found'
      }
    } else if (this.isValidContactNumber(userEmailContactInput)) {
      registeredInitiated = {
        id_type: 'mobile_number_watcho',
        source: 'header_web',
        status: 'ID_not_found'
      }
    }
    this.appUtilService.moEngageEventTracking('LOGIN_INITIATED', registeredInitiated);
  }

  loginInitiatedMoEngageEventForD2HWithIDError(userEmailContactInput: any) {
    let registeredInitiated: any;
    if (this.isValidContactNumber(userEmailContactInput)) {
      registeredInitiated = {
        id_type: 'rmn_dishd2h',
        source: 'header_web',
        status: 'ID_not_found'
      }
    }
    this.appUtilService.moEngageEventTracking('LOGIN_INITIATED', registeredInitiated);
  }

  loginCompleteMoEngageEvent(userEmailContactInput: any) {
    let loginComplete: any;
    let user_sms = this.appUtilService.getLoggedInUserSMSDetails();
    // Moengage.add_user_name(user_sms.Name);
    // Moengage.add_gender(user_sms.Gender);
    // Moengage.add_user_attribute(UserAttributes.dateOfBirth, new Date(user_sms.DateOfBirth));
    // Moengage.add_unique_user_id(this.appUtilService.getDeviceId());
    // Moengage.add_user_attribute(UserAttributes.emailVerified, user_sms.EmailVerified);
    // Moengage.add_user_attribute(UserAttributes.ottSubscriberId, user_sms.OTTSubscriberID);
    // Moengage.add_user_attribute(UserAttributes.accountStatus, user_sms.AccountStatus);
    if (this.isValidEmail(userEmailContactInput)) {
      // Moengage.add_email(userEmailContactInput);
      loginComplete = {
        id_type: 'email_id_watcho',
        authentication_type: 'password',
        status: 'login_successful'
      }
    } else if (this.isValidContactNumber(userEmailContactInput)) {
      // Moengage.add_mobile(userEmailContactInput);
      loginComplete = {
        id_type: 'mobile_number_watcho',
        authentication_type: 'password',
        status: 'login_successful'
      }
    }
    this.appUtilService.moEngageEventTracking('LOGIN_COMPLETE', loginComplete);
  }

  loginCompleteMoEngageEventWithOTPForMobileNo() {
    let user_sms = this.appUtilService.getLoggedInUserSMSDetails();
    // Moengage.add_user_name(user_sms.Name);
    // Moengage.add_mobile(this.userEmailContactInput);
    // Moengage.add_gender(user_sms.Gender);
    // Moengage.add_user_attribute(UserAttributes.dateOfBirth, new Date(user_sms.DateOfBirth));
    // Moengage.add_unique_user_id(this.appUtilService.getDeviceId());
    // Moengage.add_user_attribute(UserAttributes.emailVerified, user_sms.EmailVerified);
    // Moengage.add_user_attribute(UserAttributes.ottSubscriberId, user_sms.OTTSubscriberID);
    // Moengage.add_user_attribute(UserAttributes.accountStatus, user_sms.AccountStatus);
    let loginComplete = {
      id_type: 'mobile_number_watcho',
      authentication_type: 'OTP',
      status: 'login_successful'
    }
    this.appUtilService.moEngageEventTracking('LOGIN_COMPLETE', loginComplete);
  }

  loginCompleteMoEngageEventWithOTP() {
    let loginComplete = {
      id_type: 'mobile_number_watcho',
      authentication_type: 'OTP',
      status: 'invalid_OTP'
    }
    this.appUtilService.moEngageEventTracking('LOGIN_COMPLETE', loginComplete);
  }

  loginCompleteMoEngageWithInvalidPassword(userEmailContactInput: any) {
    let loginComplete: any;
    if (this.isValidEmail(userEmailContactInput)) {
      loginComplete = {
        id_type: 'email_id_watcho',
        authentication_type: 'password',
        status: 'incorrect_password'
      }
    } else if (this.isValidContactNumber(userEmailContactInput)) {
      loginComplete = {
        id_type: 'mobile_number_watcho',
        authentication_type: 'password',
        status: 'incorrect_password'
      }
    }
    this.appUtilService.moEngageEventTracking('LOGIN_COMPLETE', loginComplete);
  }

  loginCompleteMoEngageEventForD2H() {
    let loginComplete = {
      id_type: 'rmn_dishd2h',
      authentication_type: 'OTP',
      status: 'invalid_OTP'
    }
    this.appUtilService.moEngageEventTracking('LOGIN_COMPLETE', loginComplete);
  }

  loginCompleteMoEngageEventWithOTPOrPassword() {
    let loginComplete: any;
    let user_sms = this.appUtilService.getLoggedInUserSMSDetails();
    // Moengage.add_user_name(user_sms.Name);
    // Moengage.add_mobile(this.userEmailContactInput);
    // Moengage.add_gender(user_sms.Gender);
    // Moengage.add_user_attribute(UserAttributes.dateOfBirth, new Date(user_sms.DateOfBirth));
    // Moengage.add_unique_user_id(this.appUtilService.getDeviceId());
    // Moengage.add_user_attribute(UserAttributes.emailVerified, user_sms.EmailVerified);
    // Moengage.add_user_attribute(UserAttributes.ottSubscriberId, user_sms.OTTSubscriberID);
    // Moengage.add_user_attribute(UserAttributes.accountStatus, user_sms.AccountStatus);
    if (this.showPasswordModal) {
      loginComplete = {
        id_type: 'mobile_number_watcho',
        authentication_type: 'password',
        status: 'login_successful'
      }
    } else {
      loginComplete = {
        id_type: 'mobile_number_watcho',
        authentication_type: 'OTP',
        status: 'login_successful'
      }
    }
    this.appUtilService.moEngageEventTracking('LOGIN_COMPLETE', loginComplete);
  }

  registeredInitiatedMoEngageEvent(userEmailContactInput: any) {
    let registeredInitiated: any;
    if (this.isValidEmail(userEmailContactInput)) {
      registeredInitiated = {
        id_type: 'email',
        source: 'new_user_link',
        status: 'validation_successful'
      }
    } else if (this.isValidContactNumber(userEmailContactInput)) {
      registeredInitiated = {
        id_type: 'mobile_number',
        source: 'new_user_link',
        status: 'validation_successful'
      }
    }
    this.appUtilService.moEngageEventTracking('REGISTRATION_INITIATED', registeredInitiated);
  }

  registeredInitiatedErrorMoEngageEvent(userEmailContactInput: any) {
    let registeredInitiated: any;
    if (this.isValidEmail(userEmailContactInput)) {
      registeredInitiated = {
        id_type: 'email',
        source: 'new_user_link',
        status: 'other_error'
      }
    } else if (this.isValidContactNumber(userEmailContactInput)) {
      registeredInitiated = {
        id_type: 'mobile_number',
        source: 'new_user_link',
        status: 'other_error'
      }
    }
    this.appUtilService.moEngageEventTracking('REGISTRATION_INITIATED', registeredInitiated);
  }

  registeredInitiatedForOTPMoEngageEvent() {
    let registeredInitiated: any;
    if (this.isValidOtp()) {
      registeredInitiated = {
        id_type: 'mobile_number',
        source: 'new_user_link',
        status: 'OTP_verification_error'
      }
    }
    this.appUtilService.moEngageEventTracking('REGISTRATION_INITIATED', registeredInitiated);
  }

  registeredInitiatedForDuplicationIDMoEngageEvent(userEmailContactInput: any) {
    let registeredInitiated: any;
    if (this.isValidEmail(userEmailContactInput)) {
      registeredInitiated = {
        id_type: 'email',
        source: 'new_user_link',
        status: 'duplicate_ID_error'
      }
    } else if (this.isValidContactNumber(userEmailContactInput)) {
      registeredInitiated = {
        id_type: 'mobile_number',
        source: 'new_user_link',
        status: 'duplicate_ID_error'
      }
    }
    this.appUtilService.moEngageEventTracking('REGISTRATION_INITIATED', registeredInitiated);
  }

  registeredInitiatedMoEngageEventWithFB() {
    let registeredInitiated = {
      id_type: 'facebook',
      source: 'new_user_link',
      status: 'validation_successful'
    }
    this.appUtilService.moEngageEventTracking('REGISTRATION_INITIATED', registeredInitiated);
  }

  registeredInitiatedMoEngageEventWithFBError() {
    let registeredInitiated = {
      id_type: 'facebook',
      source: 'new_user_link',
      status: 'other_error'
    }
    this.appUtilService.moEngageEventTracking('REGISTRATION_INITIATED', registeredInitiated);
  }

  registerCompleteMoEngagEvent(userEmailContactInput: any) {
    let registerComplete: any;
    if (this.isValidEmail(userEmailContactInput)) {
      registerComplete = {
        id_type: 'email',
        status: 'registration_successful'
      }
    } else if (this.isValidContactNumber(userEmailContactInput)) {
      registerComplete = {
        id_type: 'mobile_number',
        status: 'registration_successful'
      }
    }
    this.appUtilService.moEngageEventTracking('REGISTRATION_COMPLETE', registerComplete);
  }

  registerCompleteMoEngagEventError(userEmailContactInput: any) {
    let registerComplete: any;
    if (this.isValidEmail(userEmailContactInput)) {
      registerComplete = {
        id_type: 'email',
        status: 'other_error'
      }
    } else if (this.isValidContactNumber(userEmailContactInput)) {
      registerComplete = {
        id_type: 'mobile_number',
        status: 'other_error'
      }
    }
    this.appUtilService.moEngageEventTracking('REGISTRATION_COMPLETE', registerComplete);
  }

  registerCompleteMoEngagEventErrorForMandatoryField(userEmailContactInput: any) {
    let registerComplete: any;
    if (this.isValidEmail(userEmailContactInput)) {
      registerComplete = {
        id_type: 'email',
        status: 'mandatory_field_error'
      }
    } else if (this.isValidContactNumber(userEmailContactInput)) {
      registerComplete = {
        id_type: 'mobile_number',
        status: 'mandatory_field_error'
      }
    }
    this.appUtilService.moEngageEventTracking('REGISTRATION_COMPLETE', registerComplete);
  }

  registerCompleteMoEngagEventForFB() {
    let registerComplete = {
      id_type: 'facebook',
      status: 'registration_successful'
    }
    this.appUtilService.moEngageEventTracking('REGISTRATION_COMPLETE', registerComplete);
  }

  registerCompleteMoEngagEventForFBError() {
    let registerComplete = {
      id_type: 'facebook',
      status: 'other error'
    }
    this.appUtilService.moEngageEventTracking('REGISTRATION_COMPLETE', registerComplete);
  }

  registerCompleteMoEngagEventForFBErrorMandatoryField() {
    let registerComplete = {
      id_type: 'facebook',
      status: 'mandatory_field_error'
    }
    this.appUtilService.moEngageEventTracking('REGISTRATION_COMPLETE', registerComplete);
  }

  gtmTagEventButtonClickContinueWatchoUser() {
    let dataLayerJson: any;
    dataLayerJson = {
      'button_id': 'watcho_user_continue',
      'button_name': 'continue',
      'button_location': 'Sign_In_Page',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'continue');
  }


  gtmTagEventButtonClickContinueD2HUserSuccess() {
    let dataLayerJson: any;
    dataLayerJson = {
      'button_id': 'dishD2h_user_continue',
      'button_name': 'continue',
      'button_location': 'HEADER',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'button_click');
  }

  gtmTagEventButtonClickContinueD2HUserUnSuccess() {
    let dataLayerJson: any;
    dataLayerJson = {
      'button_id': 'dishD2h_user_continue',
      'button_name': 'continue',
      'button_location': 'HEADER',
      'redirection_url': null,
      'button_image': null,
      'click_error': 'Click Error'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'button_click');
  }

  gtmTagEventButtonClickForgotPassword() {
    let dataLayerJson: any;
    dataLayerJson = {
      'button_id': 'watcho_user_forgot_password',
      'button_name': 'forgot password',
      'button_location': 'Sign_In_Page',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'forgot_password');
  }

  gtmTagEventButtonClickNewUserContinue() {
    let dataLayerJson: any;
    dataLayerJson = {
      'button_id': 'new_user_registration_continue',
      'button_name': 'Register User Continue',
      'button_location': 'Sign_In_Page',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'registration_initiate');
  }

  gtmTagEventButtonClickFbRegistration() {
    let dataLayerJson: any;
    dataLayerJson = {
      'button_id': 'new_user_fb_registration',
      'button_name': 'Facebook Registration',
      'button_location': 'Sign_In_Page',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'registration_with_facebook');
  }

  gtmTagEventButtonClickFbLogin() {
    let dataLayerJson: any;
    dataLayerJson = {
      'button_id': 'fb_login',
      'button_name': 'Facebook Login',
      'button_location': 'Sign_In_Page',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'login_with_facebook');
  }

  onKeyDownEvent(id: String, e: any, placement: string) {
    if (isNaN(e.target.value)) {
      $(id).val('');
      $(id).focus();
    }

    if (e.keyCode === 8) {
      if (placement === 'REGISTER') {
        $("#codeBoxRegister1").val('');
        $("#codeBoxRegister2").val('');
        $("#codeBoxRegister3").val('');
        $("#codeBoxRegister4").val('');
        $("#codeBoxRegister1").focus();
      } else {
        $("#codeBox1").val('');
        $("#codeBox2").val('');
        $("#codeBox3").val('');
        $("#codeBox4").val('');
        $("#codeBox1").focus();
      }
    } else {
      if (placement === 'REGISTER' && id === "#codeBoxRegister4") {
        setTimeout(() => {
          if (this.isRegisteredWithEmailId) {
            this.validateOtpForRegisterEmail();
          } else {
            this.validateOtpForRegister();
          }
        }, 500)
      } else {
        if (id === "#codeBox4") {
          setTimeout(() => {
            this.userLogin();
          }, 500)
        }
      }
    }
  }

  gtmTagEventButtonClickWatchoUser() {
    let dataLayerJson: any;
    dataLayerJson = {
      'button_id': 'watcho_sign_in',
      'button_name': 'Watcho Sign in',
      'button_location': 'Sign_In_Page',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'watcho_login');
  }

  gtmTagEventButtonClickD2HUserSuccess() {
    let dataLayerJson: any;
    dataLayerJson = {
      'button_id': 'dish_d2h_sign_in',
      'button_name': 'Dish D2H Sign In',
      'button_location': 'Sign_In_Page',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'dish_d2h_user');
  }


  gtmTagOnTermsAndConditions() {
    let dataLayerJson = {
      'button_id': 'terms_of_use',
      'button_name': 'Terms of Use',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful',
      'button_location': 'Sign_In_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'terms_of_use');
  }

  gtmTagOnPrivacyPolicy() {
    let dataLayerJson = {
      'button_id': 'privacy_policy',
      'button_name': 'Privacy Policy',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful',
      'button_location': 'Sign_In_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'privacy_policy');
  }

  gtmTagOnNewUser() {
    let dataLayerJson = {
      'button_id': 'new_user_click_here',
      'button_name': 'New User Click Here',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful',
      'button_location': 'Sign_In_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'new_user_click_here');
  }

  gtmTagOnBackButton() {
    let dataLayerJson = {
      'button_id': 'back_icon',
      'button_name': 'Back Icon',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful',
      'button_location': 'Sign_In_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'back_icon');
  }

  gtmTagOnLoginWithPassword() {
    let dataLayerJson = {
      'button_id': 'login_with_password',
      'button_name': 'Login_with_Password',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful',
      'button_location': 'Sign_In_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'login_with_password');
  }

  gtmTagOnSignIn() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'button_id': 'sign_in_with_watcho_user',
      'button_name': 'Sign In',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful',
      'user_id': getTimeStamp,
      'button_location': 'Sign_In_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'sign_in');
  }

  gtmTagOnEnteredMobile() {
    let dataLayerJson = {
      'button_id': 'continue_with_entered_mobile_no',
      'button_name': 'Continue',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful',
      'button_location': 'Sign_In_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'continue_mobile');
  }

  gtmTagOnEnteredOTP() {
    let dataLayerJson = {
      'button_id': 'continue_with_entered_otp',
      'button_name': 'Continue',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful',
      'button_location': 'Sign_In_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'continue_otp');
  }

  gtmTagOnRegisterSuccessful(gender) {
    let dataLayerJson = {
      'button_id': 'registration_success',
      'button_name': 'Register',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful',
      'gender': gender ? gender : '',
      'button_location': 'Register_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'registration_success');
  }

  // getSubscriptionHistory() {
  //   this.userFormService.getSubscriptionHistory(this.appUtilService.getLoggedInUserSMSDetails().OTTSubscriberID).subscribe((res: any) => {
  //     if (res.ResultCode === 0) {
  //       if (res.Result.length > 0) {
  //         for (let result of res.Result) {
  //           if (result.SubscriptionStatus.toLowerCase() === "active") {
  //             localStorage.setItem("subscriptionEndDate", result.SubscriptionEndDate);
  //           }
  //         }
  //       }
  //     }
  //   });
  // }

  showRecommendationModal(registrationEvent?: boolean) {
    if (this.appUtilService.isUserLoggedIn()) {
      this.appUtilService.getUserInterestList().subscribe((res: any) => {
        if (res.result.totalCount === 0) {
          this.isSigninSignup = registrationEvent ? false : true;
          const modalRef = this.modalService.open(this.recommendationModal);
          modalRef.result.then(() => {
          }, () => {
            if (!registrationEvent) {
              this.isSigninSignup = false;
            }
          });
        } else {
          if (!registrationEvent) {
            this.isSigninSignup = false;
          }
        }
      }, reject => {
        console.error(reject);
      })
    }
  }
}

