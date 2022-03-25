import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateNativeAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbModalRef, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { environment } from '../../../../../../../environments/environment';
import { ParentalPinValidatorComponent } from '../../../../../shared/parental-pin-validator/parental-pin-validator.component';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { LoginMessageService } from '../../../../../shared/services/auth';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { MediaUploadService } from '../../../../../shared/services/media-upload.service';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { SmsFormService } from '../../../../../shared/services/sms-form.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { AppConstants, QUALITY, QUALITYBITRATE } from '../../../../../shared/typings/common-constants';
import { ChangePasswordCommand, UpdateUserProfileCommand, UserDetailsCommand } from '../../models/user';
import { NgbDateCustomParserFormatter } from '../../services/ngb-parser-formater.service';
import { UserFormService } from '../../services/user-form.service';



declare var $;
declare var Moengage: any;

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }]
})

export class SettingsComponent implements OnInit {

    @ViewChild('t') public tabs: NgbTabset;

    @ViewChild('uploadModal')
    uploadModalRef: ElementRef;

    @ViewChild('emailVerifyOTPModal') emailVerifyOTPModal: ElementRef;

    disabled: boolean = true;

    public loading = false;
    public modalLoading = false;

    userName: string;
    userEmail: string;
    userGender: string;
    userContactNumber: string;
    userDob: string;
    deviceList: any;
    devicesLimit: number;
    changePasswordcommand: ChangePasswordCommand;
    newPasswordError: boolean;
    confirmPasswordError: boolean;
    passwordMismatch: boolean;
    passwordErrorMessage: string;
    newPasswordToggleEye: string = "la la-eye-slash";
    newPasswordTextBoxType = "password";
    confirmPasswordToggleEye: string = "la la-eye-slash";
    confirmPasswordTextBoxType = "password";
    passwordEditButton: string = "Edit";
    arrowType = "keyboard_arrow_right"
    newUserGender: string;
    userDetailsCommand: UserDetailsCommand;
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
    updateUserProfileCommand: UpdateUserProfileCommand;
    userNameError: boolean;
    errorMessage: string;
    userGenderError: boolean;
    userDOBError: boolean;
    userDetailsarrowType: string = "keyboard_arrow_right";
    userDetailsEditButton: string = "Edit"
    showProfilrDisplayLoader: boolean = false;
    filename: string;
    videoQuality: string = 'Auto';
    isAutoPlay: boolean = false;
    toggleViewButton: string = 'View';
    restrictionArrowType: string = 'keyboard_arrow_right';
    isParentalActivated: boolean = false;
    pageIndex: number;
    pageSize: number;
    modalTitle: string;
    attribute: any;
    qaEnvironment: boolean = true;
    isBrowser;
    isMobileTabletView: boolean;
    isUserImage: boolean;
    isUserType: any;
    userSubscribedPlans: any[];
    noSubscriptionHistoryFound: boolean;
    userRecharges: any[];
    noRechargeHistoryFound: boolean;

    isD2hUser: boolean;
    isDishUser: boolean;
    browserDetails: any;
    isSigninSignup: boolean = false;
    userOtp: string;

    constructor(@Inject(PLATFORM_ID) private platformId, private userFormService: UserFormService, private router: Router, private config: NgbDatepickerConfig, public modalService: NgbModal,
        public loginMessageService: LoginMessageService, private smsService: SmsFormService,
        private kalturaAppService: KalturaAppService, private snackbarUtilService: SnackbarUtilService, private titleService: Title,
        private appUtilService: AppUtilService, public mediaUploadService: MediaUploadService, private platformIdentifierService: PlatformIdentifierService, private cdr: ChangeDetectorRef) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.userName = null;
        this.userEmail = null;
        this.userGender = null;
        this.userContactNumber = null;
        this.userDob = null;
        this.changePasswordcommand = {
            newPassword: null,
            confirmPassword: null

        }
        this.userDetailsCommand = {
            name: null,
            email: null,
            dateOfBirth: null,
            gender: null,
            mobileNo: null,
            emailVerified: false
        }
        this.updateUserProfileCommand = {
            Name: null,
            UserID: null,
            DateOfBirth: null,
            UserType: null,
            ProfileImagePath: null,
            Gender: null,
            OTTSubscriberID: null
        }

        let currentDate = new Date()

        config.minDate = { year: 1930, month: 1, day: 1 };
        config.maxDate = { year: currentDate.getFullYear() - 1, month: currentDate.getMonth() + 1, day: currentDate.getDate() };

        // days that don't belong to current month are not visible
        // config.outsideDays = 'hidden';
        this.userImage = "https://d1f8xt8ufwfd45.cloudfront.net/web/placeholder-images/user.png";
        this.pageIndex = 1;
        this.pageSize = 20;
        this.isUserImage = false;
        this.noSubscriptionHistoryFound = false;
        this.userSubscribedPlans = [];
        this.isD2hUser = false;
        this.isDishUser = false;
        this.userRecharges = [];
        this.noRechargeHistoryFound = false;
        this.browserDetails = this.appUtilService.getBrowserDetails();
        this.userOtp = null;
    }

    ngOnInit() {

        if (environment.env === "prod") {
            this.qaEnvironment = true;
        }

        this.selectMale();
        this.subscribeImageUploadStateHandler();

        this.titleService.setTitle("Set your preferences | " + AppConstants.APP_NAME_CAPS + "");
        this.getOttUser();
        // $('#checkBox').focus();
        this.cdr.detectChanges()

        if (this.isBrowser) {
            // detect mobile and render mobile side bar
            if (matchMedia('(max-width: 992px)').matches) {
                this.isMobileTabletView = true;
            }
            if (this.appUtilService.checkIfPWA()) {
                $(".maintitle").css("text-align", "center");
            }
            const userCategory = Number(localStorage.getItem(AppConstants.USER_CATEGORY));
            if (userCategory === 1) {
                this.isDishUser = true;
            } else if (userCategory === 2) {
                this.isD2hUser = true;
            }
        }
        this.isUserType = localStorage.getItem(AppConstants.USER_CATEGORY);
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        if (this.router.url.indexOf("your-devices") > 0 || this.router.url.indexOf("your-devices-limit-exceeded") > 0) {
            if (this.tabs) {
                this.tabs.select('your_devices');
            }
        }
    }

    getOttUser() {
        this.loading = true;
        this.kalturaAppService.getOttUser().then(res => {
            this.loading = false;

            this.userName = res.firstName;
            this.userEmail = res.email;
            this.userGender = null;
            this.userContactNumber = res.phone;
            this.userDob = null;

        }, reject => {
            this.loading = false;
            this.snackbarUtilService.showError(reject.message);
        });
    }


    toogleEyeIcon() {

    }

    logoutUser() {
        this.appUtilService.logoutUser();
        this.logoutMoEngageEvent();
        this.gtmTagEventButtonClicklogout();
    }

    toggleChangePasswordDiv() {
        if (this.passwordEditButton === "Edit") {
            this.passwordEditButton = "Close"
            this.arrowType = "keyboard_arrow_down"
            this.resetChangePasswordField();
        } else {
            this.passwordEditButton = "Edit"
            this.arrowType = "keyboard_arrow_right"
        }
        $('#changePasswordDiv').slideToggle()
    }

    changePassword() {
        this.loading = true;
        if (!this.validatePassword()) {
            this.loading = false;
            return;
        }
        let userId: string
        userId = this.appUtilService.getLoggedInUserSMSDetails().UserID.toString();
        this.loading = true;

        this.userFormService.changePassword(userId, this.changePasswordcommand.newPassword, this.appUtilService.getUserType()).subscribe((res: any) => {
            $('#changePasswordDiv').slideToggle();
            this.arrowType = "keyboard_arrow_right"
            this.passwordEditButton = "Edit";
            this.snackbarUtilService.showSnackbar(res.ResultDesc);
            this.loading = false;
            this.changePasswordcommand.newPassword = null;
            this.changePasswordcommand.confirmPassword = null;
            this.clickChangePasswordSuccessMoEngageEvent();
            this.gtmTagEventButtonClickChangePassword(true);
        }, error => {
            this.loading = false;
            this.snackbarUtilService.showSnackbar(error.ResultDesc);
            this.clickChangePasswordErrorMoEngageEvent();
            this.gtmTagEventButtonClickChangePassword(false);
        })
    }

    validatePassword(): boolean {
        if (!this.changePasswordcommand.newPassword || this.changePasswordcommand.newPassword.trim() === "") {
            this.newPasswordError = true;
            this.passwordErrorMessage = "Please enter New Password"
            // this.snackbarUtilService.showError("Please enter New Password");
        } else {
            if (this.changePasswordcommand.newPassword.match(/^(?=.*[!&^%$#@()\\_+-])[A-Za-z0-9\\d!&^%$#@()\\_+-]{8,20}$/)) {
                this.newPasswordError = false;
            } else {
                this.newPasswordError = true;
                this.passwordErrorMessage = "Please enter a password between 8 to 20 characters and must contain at least 1 special character";
            }

        }
        if (this.newPasswordError || (this.changePasswordcommand.newPassword === this.changePasswordcommand.confirmPassword)) {
            this.passwordMismatch = false;
        } else {
            this.passwordMismatch = true;
            this.passwordErrorMessage = "Password didn't match";
        }


        if (!this.newPasswordError && !this.passwordMismatch) {
            return true;
        } else {
            this.snackbarUtilService.showError(this.passwordErrorMessage)
            return false;
        }

    }

    toggleNewPasswordClass() {
        if (this.newPasswordToggleEye === "la la-eye-slash") {
            this.newPasswordToggleEye = "la la-eye";
            this.newPasswordTextBoxType = "text"
        } else {
            this.newPasswordToggleEye = "la la-eye-slash";
            this.newPasswordTextBoxType = "password"
        }
    }

    toggleConfirmPasswordClass() {
        if (this.confirmPasswordToggleEye === "la la-eye-slash") {
            this.confirmPasswordToggleEye = "la la-eye";
            this.confirmPasswordTextBoxType = "text"
        } else {
            this.confirmPasswordToggleEye = "la la-eye-slash";
            this.confirmPasswordTextBoxType = "password"
        }
    }

    toggleUserDetailsDiv() {
        if (this.userDetailsEditButton === "Edit") {
            this.userDetailsEditButton = "Close"
            this.userDetailsarrowType = "keyboard_arrow_down"
            this.appUtilService.moEngageEventTrackingWithNoAttribute("UPDATE_PROFILE_INITIATE");
        } else {
            this.userDetailsEditButton = "Edit"
            this.userDetailsarrowType = "keyboard_arrow_right"
        }
        $('#changeDetailsDiv').slideToggle()
    }

    selectMale() {

        $('#male').addClass("radcolor")
        $('#female').removeClass("radcolor")
        this.userDetailsCommand.gender = 'male'
    }
    selectFemale() {
        $('#female').addClass("radcolor")
        $('#male').removeClass("radcolor")
        this.userDetailsCommand.gender = 'female'
    }

    getUserDetails() {
        this.showProfilrDisplayLoader = true;
        let userId: string
        userId = this.appUtilService.getLoggedInUserSMSDetails().UserID.toString();
        this.showProfilrDisplayLoader = true;
        let supportWebpCluodFrontUrl: string = this.browserDetails.browser !== "Safari" ? environment.WEBP_JPEG_CLOUDFRONT_URL + environment.WEBP_CLOUDFRONT_URL : environment.WEBP_JPEG_CLOUDFRONT_URL + environment.JPEG_CLOUDFRONT_URL;
        this.userFormService.getUserDetails(userId, this.appUtilService.getUserType()).subscribe((res: any) => {
            let userDOB
            if (res.Result.DateOfBirth !== '0001-01-01T00:00:00') {
                userDOB = new Date(res.Result.DateOfBirth);
            } else {
                userDOB = null;
            }
            this.userDetailsCommand.name = res.Result.Name;
            this.userDetailsCommand.email = res.Result.EmailID;
            this.userDetailsCommand.dateOfBirth = userDOB;
            this.userDetailsCommand.mobileNo = res.Result.MobileNo;
            this.userDetailsCommand.emailVerified = res.Result.EmailVerified;
            try {
                if (res.Result.ProfileImagePath) {
                    this.userImage = supportWebpCluodFrontUrl + res.Result.ProfileImagePath;
                    if (this.userImage.indexOf('user.png') > 0) {
                        this.isUserImage = false;
                    } else {
                        this.isUserImage = true;
                    }
                }
            } catch (e) {

            }

            if (res.Result.Gender === 'm' || res.Result.Gender === 'M') {
                this.selectMale()
                this.userDetailsCommand.gender = "Male"
            } else {
                this.selectFemale();
                this.userDetailsCommand.gender = "Female"
            }

            this.showProfilrDisplayLoader = false;
        }, error => {
            this.loading = false;
            this.showProfilrDisplayLoader = false;
            this.snackbarUtilService.showSnackbar(error.ResultDesc);
        })

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
        this.isUserImage = true;
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
        this.loading = true;
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
        this.thumbnailCropped = false;
        this.thumbnailSelected = false;

        // commented as upload of images is not allowed in prod
        $('#uploadThumbnailFile').click();

    }

    updateUserProfile() {
        if (!this.validateUserUpdateForm()) {
            return;
        }
        this.showProfilrDisplayLoader = true;

        this.updateUserProfileCommand.Name = this.userDetailsCommand.name;
        if (this.userDetailsCommand.dateOfBirth) {
            this.updateUserProfileCommand.DateOfBirth = this.userDetailsCommand.dateOfBirth.toDateString();
        }
        this.updateUserProfileCommand.Gender = this.userDetailsCommand.gender;
        this.updateUserProfileCommand.UserID = this.appUtilService.getLoggedInUserSMSDetails().UserID.toString();
        this.updateUserProfileCommand.OTTSubscriberID = this.appUtilService.getLoggedInUserDetails().externalId.toString();
        this.updateUserProfileCommand.UserType = this.appUtilService.getUserType();;
        this.updateUserProfileCommand.ProfileImagePath = this.userImage;
        this.userFormService.updateUserDetails(this.updateUserProfileCommand).subscribe((res: any) => {

            this.showProfilrDisplayLoader = false;
            this.snackbarUtilService.showSnackbar('Profile updated successfully')
            this.clickSaveChangesSuccessfullyMoEngageEvent();
            this.gtmTagEventButtonClickUpdateUserProfile(true);
            localStorage.setItem(AppConstants.USER_DETAILS_SMS, JSON.stringify(res.Result));
            this.loginMessageService.imageChangedMessage(true);
            this.userDetailsEditButton = "Edit"
            this.userDetailsarrowType = "keyboard_arrow_right"
            $('#changeDetailsDiv').slideToggle()
        }, error => {
            this.showProfilrDisplayLoader = false;
            this.snackbarUtilService.showSnackbar(error.ResultDesc)
            this.clickSaveChangesErrorMoEngageEvent();
            this.gtmTagEventButtonClickUpdateUserProfile(false);
        })

    }

    validateUserUpdateForm(): boolean {
        if (this.userDetailsCommand.name === null || this.userDetailsCommand.name === undefined || this.userDetailsCommand.name.trim() === '') {
            this.userNameError = true;
            this.errorMessage = "Name is required";
            this.snackbarUtilService.showSnackbar(this.errorMessage);
            return false
        }

        if (!this.userNameError) {
            return true
        }
    }

    selectQualityPrefences() {
        if (this.platformIdentifierService.isBrowser()) {
            if (this.videoQuality === QUALITY[QUALITY.Auto]) {
                localStorage.setItem(AppConstants.VIDEO_QUALITY, QUALITYBITRATE.Auto.toString());
            } else if (this.videoQuality === QUALITY[QUALITY.High]) {
                localStorage.setItem(AppConstants.VIDEO_QUALITY, QUALITYBITRATE.High.toString());
            } else if (this.videoQuality === QUALITY[QUALITY.Medium]) {
                localStorage.setItem(AppConstants.VIDEO_QUALITY, QUALITYBITRATE.Medium.toString());
            } else {
                localStorage.setItem(AppConstants.VIDEO_QUALITY, QUALITYBITRATE.Low.toString());
            }

            if (this.isAutoPlay) {
                localStorage.setItem(AppConstants.AUTOPLAY, this.isAutoPlay.toString())
            } else {
                localStorage.setItem(AppConstants.AUTOPLAY, this.isAutoPlay.toString())
            }

            this.snackbarUtilService.showSnackbar("Updated Successfully");
            this.clickVideoQualitySuccessMoEngageEvent();
            this.gtmTagEventButtonClickVideoQuality();
        }

    }

    videoQualityTab() {
        if (this.platformIdentifierService.isBrowser()) {
            let videoQuality = localStorage.getItem(AppConstants.VIDEO_QUALITY)
            if (videoQuality) {
                if (videoQuality === QUALITYBITRATE.Auto) {
                    this.videoQuality = QUALITY[QUALITY.Auto].toString();
                } else if (videoQuality === QUALITYBITRATE.High) {
                    this.videoQuality = QUALITY[QUALITY.High].toString()
                } else if (videoQuality === QUALITYBITRATE.Medium) {
                    this.videoQuality = QUALITY[QUALITY.Medium].toString()
                } else {
                    this.videoQuality = QUALITY[QUALITY.Low].toString()
                }
            } else {
                this.videoQuality = QUALITY[QUALITY.Auto].toString();
            }


            if (localStorage.getItem(AppConstants.AUTOPLAY)) {
                if (localStorage.getItem(AppConstants.AUTOPLAY) === 'true') {
                    this.isAutoPlay = true;
                } else {
                    this.isAutoPlay = false;
                }
            } else {
                localStorage.setItem(AppConstants.AUTOPLAY, 'false');
                this.isAutoPlay = false;
            }
        }
        this.gtmTagOnVideoQuality();
    }

    openChangePinValidatorModal() {
        if (this.isParentalActivated) {
            const modalRef = this.modalService.open(ParentalPinValidatorComponent, { backdrop: 'static', size: 'sm' });
            modalRef.componentInstance.name = 'Validate PIN';
            modalRef.componentInstance.pinOptions = 'validate';
            modalRef.componentInstance.buttonName = "Validate"
        } else {
            const modalRef = this.modalService.open(ParentalPinValidatorComponent, { backdrop: 'static', size: 'sm' });
            modalRef.componentInstance.name = 'Set PIN';
            modalRef.componentInstance.pinOptions = 'disable';
            modalRef.componentInstance.buttonName = "Set"
            modalRef.result.then(() => { this.isParentalActivated = !this.isParentalActivated; }, () => { })
        }

    }

    toggleRestrictionBox() {
        if (this.toggleViewButton === "View") {
            this.toggleViewButton = "Close"
            this.restrictionArrowType = "keyboard_arrow_down"
        } else {
            this.toggleViewButton = "View"
            this.restrictionArrowType = "keyboard_arrow_right"
        }
        $('#restriction-table').slideToggle()

    }

    activateParental(event: any) {
        if (this.isParentalActivated) {
            event.srcElement.blur();
            event.preventDefault();
            const modalRef = this.modalService.open(ParentalPinValidatorComponent, { backdrop: 'static', size: 'sm' });
            modalRef.componentInstance.name = 'Enter PIN';
            modalRef.componentInstance.pinOptions = 'enable';
            modalRef.componentInstance.buttonName = "Validate"
            modalRef.result.then(() => {
                this.isParentalActivated = !this.isParentalActivated
            }, () => {
            })
        } else {
            event.srcElement.blur();
            event.preventDefault();
            const modalRef = this.modalService.open(ParentalPinValidatorComponent, { backdrop: 'static', size: 'sm' });
            modalRef.componentInstance.name = 'Set PIN';
            modalRef.componentInstance.pinOptions = 'disable';
            modalRef.componentInstance.buttonName = "Set"
            modalRef.result.then(() => {
                this.isParentalActivated = !this.isParentalActivated
            }, () => {
            })
            this.cdr.detectChanges();
        }
        this.appUtilService.moEngageEventTrackingWithNoAttribute("UPDATE_PARENTAL_SETTING");
    }


    getParentalStatus() {
        this.toggleViewButton = "View"
        this.restrictionArrowType = "keyboard_arrow_right"
        this.loading = true;
        this.kalturaAppService.getOttUser().then((res: any) => {
            this.loading = false;
            if (res.dynamicData.ParentalRestrictions) {
                this.modalTitle = "Set-PIN"
                if (res.dynamicData.ParentalRestrictions.value.toLowerCase() === 'active') {
                    this.isParentalActivated = true;
                } else {
                    this.isParentalActivated = false;
                }
            } else if (res.dynamicData.ParentalRestrictions === undefined) {
                this.isParentalActivated = false;
                this.modalTitle = "Set-PIN"
            } else {
                this.isParentalActivated = false;
                this.modalTitle = "Set-PIN"
            }
        }, reject => {
            this.loading = false;
            this.snackbarUtilService.showError(reject.message);
        });
        this.gtmTagOnParentalControl();
    }

    resetButtons() {
        this.passwordEditButton = "Edit";
        this.arrowType = "keyboard_arrow_right";
        this.userDetailsarrowType = "keyboard_arrow_right";
        this.userDetailsEditButton = "Edit"
        this.gtmTagOnYourAccount();
    }

    mobileView(id) {
        if (this.isMobileTabletView) {
            if (id === '#changeDetailsDiv' && this.userDetailsEditButton === 'Edit') {
                this.userDetailsEditButton = 'Close';
                this.userDetailsarrowType = 'keyboard_arrow_down';
            } else if (id === '#changeDetailsDiv' && this.userDetailsEditButton === 'Close') {
                this.userDetailsEditButton = 'Edit';
                this.userDetailsarrowType = 'keyboard_arrow_right';
            } else if (id === '#changePasswordDiv' && this.passwordEditButton === 'Edit') {
                this.passwordEditButton = 'Close';
                this.arrowType = 'keyboard_arrow_down';
                this.resetChangePasswordField();
            } else if (id === '#changePasswordDiv' && this.passwordEditButton === 'Close') {
                this.passwordEditButton = 'Edit';
                this.arrowType = 'keyboard_arrow_right';
            } else if (id === '#restriction-table' && this.toggleViewButton === 'View') {
                this.toggleViewButton = 'Close';
                this.restrictionArrowType = 'keyboard_arrow_down'
            } else if (id === '#restriction-table' && this.toggleViewButton === 'Close') {
                this.toggleViewButton = 'View';
                this.restrictionArrowType = 'keyboard_arrow_right';
            }
            if (id === '#logoutUser') {
                this.logoutUser();
            } else {
                $(id).slideToggle();
            }
        }
    }

    clearUploadedImage() {
        this.isUserImage = false;
        this.userImage = "https://d1f8xt8ufwfd45.cloudfront.net/web/placeholder-images/user.png";
    }

    resetChangePasswordField() {
        this.changePasswordcommand.newPassword = "";
        this.changePasswordcommand.confirmPassword = "";
        this.newPasswordToggleEye = "la la-eye-slash";
        this.confirmPasswordToggleEye = "la la-eye-slash";
        this.newPasswordTextBoxType = "password";
        this.confirmPasswordTextBoxType = "password";
    }

    clickYourDevicesPageMoEngage() {
        this.appUtilService.moEngageEventTrackingWithNoAttribute("VISIT_DEVICE_MANAGEMENT_PAGE");
    }

    clickSaveChangesSuccessfullyMoEngageEvent() {
        this.attribute = {
            status: "update_successful"
        }
        this.appUtilService.moEngageEventTracking("UPDATE_PROFILE_SAVE", this.attribute);
    }

    clickSaveChangesErrorMoEngageEvent() {
        this.attribute = {
            status: "update_error"
        }
        this.appUtilService.moEngageEventTracking("UPDATE_PROFILE_SAVE", this.attribute);
    }

    clickChangePasswordSuccessMoEngageEvent() {
        this.attribute = {
            status: "change_successful"
        }
        this.appUtilService.moEngageEventTracking("CHANGE_PASSWORD_SUCCESS", this.attribute);
    }

    clickChangePasswordErrorMoEngageEvent() {
        this.attribute = {
            status: "change_error"
        }
        this.appUtilService.moEngageEventTracking("CHANGE_PASSWORD_SUCCESS", this.attribute);
    }

    clickVideoQualitySuccessMoEngageEvent() {
        this.attribute = {
            status: "update_successful"
        }
        this.appUtilService.moEngageEventTracking("UPDATE_STREAMING_SETTING", this.attribute);
    }

    gtmTagEventButtonClicklogout() {
        let dataLayerJson: any;
        dataLayerJson = {
            'button_id': 'logout',
            'button_name': 'Logout',
            'button_location': 'Your_Account_Page',
            'redirection_url': null,
            'button_image': null,
            'successful': 'Successful'
        };
        this.appUtilService.getGTMTag(dataLayerJson, 'logout');
    }

    gtmTagEventButtonClickChangePassword(success: boolean) {
        let dataLayerJson: any;
        if (success === true) {
            dataLayerJson = {
                'button_id': 'change_password',
                'button_name': 'Change Password',
                'button_location': 'Your_Account_Page',
                'redirection_url': null,
                'button_image': null,
                'successful': 'Successful'
            };
        } else {
            dataLayerJson = {
                'button_id': 'change_password',
                'button_name': 'Change Password',
                'button_location': 'Your_Account_Page',
                'redirection_url': null,
                'button_image': null,
                'successful': 'Click Error'
            };
        }
        this.appUtilService.getGTMTag(dataLayerJson, 'change_password');
    }

    gtmTagEventButtonClickUpdateUserProfile(success: boolean) {
        let dataLayerJson: any;
        if (success === true) {
            dataLayerJson = {
                'button_id': 'your_details',
                'button_name': 'save changes',
                'button_location': 'Your_Account_Page',
                'redirection_url': null,
                'button_image': null,
                'successful': 'Successful'
            };
        } else {
            dataLayerJson = {
                'button_id': 'your_details',
                'button_name': 'save changes',
                'button_location': 'Your_Account_Page',
                'redirection_url': null,
                'button_image': null,
                'successful': 'Click Error'
            };
        }
        this.appUtilService.getGTMTag(dataLayerJson, 'your_details');
    }

    gtmTagEventButtonClickVideoQuality() {
        let dataLayerJson: any;
        dataLayerJson = {
            'button_id': 'video_quality',
            'button_name': 'update video quality',
            'button_location': 'settings',
            'redirection_url': null,
            'button_image': null,
            'successful': 'Successful'
        };
        this.appUtilService.getGTMTag(dataLayerJson, 'button_click');
    }

    gtmTagOnParentalControl() {
        let dataLayerJson = {
            'button_id': 'parental_control',
            'button_name': 'Parental Control',
            'redirection_url': null,
            'button_image': null,
            'successful': 'Successful',
            'button_location': 'Account_&_Settings_Page'
        };
        this.appUtilService.getGTMTag(dataLayerJson, 'parental_control');
    }

    gtmTagOnVideoQuality() {
        let dataLayerJson = {
            'button_id': 'video_quality',
            'button_name': 'Video Quality',
            'redirection_url': null,
            'button_image': null,
            'successful': 'Successful',
            'button_location': 'Account_&_Settings_Page'
        };
        this.appUtilService.getGTMTag(dataLayerJson, 'video_quality');
    }

    gtmTagOnYourAccount() {
        let dataLayerJson = {
            'button_id': 'your_account',
            'button_name': 'Your Account',
            'redirection_url': null,
            'button_image': null,
            'successful': 'Successful',
            'button_location': 'Account_&_Settings_Page'
        };
        this.appUtilService.getGTMTag(dataLayerJson, 'your_account');
    }

    logoutMoEngageEvent() {
        // Moengage.destroy_session();
        this.appUtilService.moEngageEventTrackingWithNoAttribute("LOGOUT");
    }

    getUserSubscriptionHistory() {
        this.gtmTagEventButtonClickViewSubscriptionHistory();
        this.noSubscriptionHistoryFound = false;
        this.loading = true;
        this.userFormService.getSubscriptionHistory(this.appUtilService.getLoggedInUserSMSDetails().OTTSubscriberID).subscribe((res: any) => {
            this.loading = false;
            if (res.ResultCode === 0) {
                if (res.Result.length > 0) {
                    this.userSubscribedPlans = res.Result;
                } else {
                    this.noSubscriptionHistoryFound = true;
                }
            } else {
                this.noSubscriptionHistoryFound = true;
                this.snackbarUtilService.showError(res.ResultDesc);
            }
        }, (err: any) => {
            this.noSubscriptionHistoryFound = true;
            this.loading = false;
            console.error(err);
            this.snackbarUtilService.showError();
        });
    }

    getUserRechargeHistory() {
        this.noRechargeHistoryFound = false;
        this.loading = true;
        this.userFormService.getRechargeHistory(this.appUtilService.getLoggedInUserSMSDetails().OTTSubscriberID, 
        this.appUtilService.getLoggedInUserSMSDetails().UserCategory).subscribe((res: any) => {
            this.loading = false;
            if (res.ResultCode === 0) {
                if (res.Result.length > 0) {
                    this.userRecharges = res.Result;
                } else {
                    this.noRechargeHistoryFound = true;
                }
            } else {
                this.noRechargeHistoryFound = true;
                this.snackbarUtilService.showError(res.ResultDesc);
            }
        }, (err: any) => {
            this.noRechargeHistoryFound = true;
            this.loading = false;
            console.error(err);
            this.snackbarUtilService.showError();
        });
    }

    downloadInvoice(InvoiceNo: number, SubscribedPlan: string, SubscriptionStartDate: string, SubscriptionCategory: string) {
        this.userFormService.getInvoice(this.appUtilService.getLoggedInUserSMSDetails().OTTSubscriberID, InvoiceNo, SubscriptionCategory).subscribe((res: any) => {
            if (res.ResultCode === 0) {
                var blob = new Blob([this.base64ToArrayBuffer(res.Result)], {type: "application/pdf"});
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                var fileName = SubscribedPlan + '_' +SubscriptionStartDate + '.pdf';
                link.download = fileName;
                link.click();
            } else {
                this.snackbarUtilService.showError(res.ResultDesc);
            }
        }, (err) => {
            console.error(err);
            this.snackbarUtilService.showError();
        });
    }

    base64ToArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }

    gtmTagEventButtonClickViewSubscriptionHistory() {
        let dataLayerJson: any;
        dataLayerJson = {
            'type': this.appUtilService.getUserTypeAsName(),
            'userid': Math.ceil(new Date().getTime() / 1000)
        };
        this.appUtilService.getGTMTag(dataLayerJson, 'view_subscription_history');
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
                this.validateOtpForRegisterEmail();
            }, 500)
          }
        }
      }

    getPinValueRegister() {
        let val = $("#codeBoxRegister1").val() + $("#codeBoxRegister2").val() + $("#codeBoxRegister3").val() + $("#codeBoxRegister4").val();
        this.userOtp = val;
    }

    resendOtpForEmail() {
        this.loading = true;
        this.userOtp = null;
        this.smsService.ResendOtpForEmail(this.userDetailsCommand.email, this.appUtilService.getLoggedInUserSMSDetails().OTTSubscriberID.toString(), this.appUtilService.getAuthKey()).subscribe((res: any) => {
            this.loading = false;
            if (res.ResultCode === 0) {
                this.modalService.open(this.emailVerifyOTPModal);
                this.snackbarUtilService.showSnackbar('We have sent you an OTP on ' + this.userDetailsCommand.email + '. it is valid for 5 miniutes.');
            } else {
                this.modalService.open(this.emailVerifyOTPModal);
                // this.snackbarUtilService.showError(res.ResultDesc);
                this.snackbarUtilService.showError("An OTP has been sent to your e-mail id. Please enter OTP to validate your e-mail address");
            }
        }, (error) => {
            this.loading = false;
            // this.modalService.dismissAll();
            this.snackbarUtilService.showError();
        })
    }

    validateOtpForRegisterEmail() {
        this.loading = true;
        this.smsService.ValidateRegisterOTPForEmail(this.userDetailsCommand.email, this.userOtp, this.appUtilService.getLoggedInUserSMSDetails().OTTSubscriberID.toString(), this.appUtilService.getAuthKey()).subscribe((res: any) => {
            if (res.ResultCode === 0) {
                this.getUserDetails();
                this.snackbarUtilService.showSnackbar(res.ResultDesc);
                this.modalService.dismissAll();
            } else {
                this.snackbarUtilService.showError('The OTP entered by you is not correct or has expired. Please enter the correct OTP or request for a new OTP.');
            }
            this.loading = false;
            this.userOtp = null;
        }, (error) => {
            this.loading = false;
            this.snackbarUtilService.showError('The OTP entered by you is not correct or has expired. Please enter the correct OTP or request for a new OTP.');
        })
    }

    backButton() {
        this.modalService.dismissAll();
    }
}
