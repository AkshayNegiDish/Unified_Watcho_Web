import { Component, OnInit } from '@angular/core';
import { AppUtilService } from '../../services/app-util.service';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AppConstants } from '../../typings/common-constants';
import { SnackbarUtilService } from '../../services/snackbar-util.service';
import { PlatformIdentifierService } from '../../services/platform-identifier.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss']
})
export class CreateTicketComponent implements OnInit {

  form: FormGroup
  email: string;
  formType: string;
  isFeedbackChecked: boolean = true;
  isComplaintChecked: boolean = false;
  userImage: any = '';
  attachedUrl: any;
  isEmailID: boolean;
  selectedThumbnailFile: Blob;
  loading: boolean = false;
  isUserLoggedIn: boolean = false;
  callCategories: any[] = ['Login / OTP Related', 'Video Playback Related', 'Content Related', 'App Crash Related', 'Other Functional Related'];

  constructor(private appUtilService: AppUtilService, private router: Router, private fb: FormBuilder ,
      private snackbarUtilService: SnackbarUtilService, private platformIdentifierService: PlatformIdentifierService) {
    if (JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS))) {
      let usersms = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
      localStorage.removeItem('ZD-email');
      if (usersms.EmailID !== "") {
        this.isEmailID = true;
        this.email = usersms.EmailID;
      } else {
        this.isEmailID = false;
        this.email = '';
      }
    } else if(localStorage.getItem('ZD-email')) {
      let zdEmail: any = localStorage.getItem('ZD-email');
      if (zdEmail !== "" && zdEmail !== undefined) {
        if (this.appUtilService.isUserLoggedIn()) {
        this.isEmailID = true;
        this.email = zdEmail;
        }
      } else {
        this.isEmailID = false;
        this.email = '';
      }
    }
    this.form = this.fb.group({
      email: [{value: this.email, disabled: this.isEmailID}, Validators.required],
      userName: ['', Validators.required],
      subject: ['', Validators.required],
      callCategories: ['', Validators.required],
      description: ['', Validators.required],
      uploads: ['']
    });
    this.formType = 'feedback';
  }

  ngOnInit() {}

  submit() {
    this.loading = true;
    let callData: string = this.form.controls.callCategories.value.trim().toLowerCase();
    for (let i = 0; i < callData.length; i++) {
      if (!callData.charAt(i).match('[a-z 0-9]') && callData.charAt(i) !== '/') {
        callData = callData.replace(callData.charAt(i), ' ');
      }
      if (callData.charAt(i) === ' ' && callData.charAt(i) !== '/') {
        callData = callData.replace(callData.charAt(i), '_');
      }
    }
    if (this.form.valid) {
      let userType: any = null;
      let ottSubscriberId: any = null;
      let rmn: any = null;
      let category: any = null;

      if (this.platformIdentifierService.isBrowser()) {
        const userSmsDetails = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
        category = Number(localStorage.getItem(AppConstants.USER_CATEGORY));
        if (category === 1) {
          userType = 'dish';
        } else if (category === 2) {
          userType = 'd2h';
        } else if (category === 3) {
          userType = 'watcho';
        } else {
          userType = null;
        }

        if (userSmsDetails && userSmsDetails.OTTSubscriberID) {
          ottSubscriberId = userSmsDetails.OTTSubscriberID;
        } else {
          ottSubscriberId = null;
        }
        if (category === 1 || category === 2) {
          if (userSmsDetails && userSmsDetails.MobileNo) {
            rmn = userSmsDetails.MobileNo;
          } else {
            rmn = null;
          }
        }
      }
      let requests: any = {
        "request": {
          "subject": this.form.controls.subject.value,
          "tags": ["web_widget", this.formType, callData],
          "comment": {
            "body": this.form.controls.description.value,
            "uploads": [this.attachedUrl],
          },
          "requester": {
            "name": this.form.controls.userName.value,
            "email": this.form.controls.email.value
          },
          "fields": {
            "360019726591": this.formType,
            "360020707571": this.form.controls.userName.value,
            "360026860791": callData
          }
        }
      }
      requests.request.fields['360027870991'] = ottSubscriberId.toString();
      requests.request.fields['360027808972'] = userType;
      if (category === 1 || category === 2) {
        requests.request.fields['360027810832'] = rmn;
      }
      this.appUtilService.createTicket(requests).subscribe((response: any) => {
        this.snackbarUtilService.showSnackbar("Your ticket accepted and update shortly");
        this.loading= false;
        this.router.navigateByUrl('/help');
        if (response.request.requester_id ) {
          localStorage.setItem('ZD-email', this.form.controls.email.value);
        }
      }, error => { 
        this.loading= false;
        console.error(error);
      });
    }
    this.loading = false;
  }

  getCheckboxValue(event) {
    try {
      if (event.target.value === 'feedback') {
        if (this.isFeedbackChecked) {
          this.isComplaintChecked = false;
          this.formType = 'feedback';
        } else {
          this.formType = 'feedback';
        }
      } else {
        if (this.isComplaintChecked) {
          this.isFeedbackChecked = false;
          this.formType = 'complaint';
        } else {
          this.formType = 'feedback';
        }
      }
    } catch(e) {}
  }

  onSelectFile(event) {
    this.loading = true
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      var files = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.userImage = event.target.result;
        fetch(this.userImage)
          .then(res => res.blob())
          .then(blob => {
            this.selectedThumbnailFile = new Blob([blob]);
            this.appUtilService.uploadImageonZD(files.name, this.selectedThumbnailFile).subscribe((response: any) => {
              this.loading = false;
              this.attachedUrl = response.upload.token;
              this.userImage = response.upload.attachment.content_url;
          }, error => { 
            this.loading= false;
            console.error(error);
          });
        })
      }
    }
  }
}
