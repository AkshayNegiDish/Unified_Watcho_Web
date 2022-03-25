import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import {AppUtilService} from '../../../../../shared/services/app-util.service';
import {UserFormService} from '../../services/user-form.service';
import {SnackbarUtilService} from '../../../../../shared/services/snackbar-util.service';

@Component({
  selector: 'app-user-detils',
  templateUrl: './user-detils.component.html',
  styleUrls: ['./user-detils.component.scss']
})
export class UserDetilsComponent implements OnInit {

  loading: boolean;
  selectedSubscriptionId: number;
  userSmsDetails: any;
  userDetails: any;

  pincode: number;

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute, private appUtilService: AppUtilService,
              private userFormService: UserFormService, private snackbarUtilService: SnackbarUtilService) {
    this.loading = false;
    this.pincode = null;
  }

  ngOnInit() {
    this.loading = true;
    this.selectedSubscriptionId = Number(this._activatedRoute.snapshot.queryParams['id']);
    this.userDetails = this.appUtilService.getLoggedInUserDetails();
    this.userSmsDetails = this.appUtilService.getLoggedInUserSMSDetails();
    this.getUserDetails();
  }

  getUserDetails() {
    this.loading = true;
    this.userFormService.getUserDetails(this.userSmsDetails.EmailID? this.userSmsDetails.EmailID : this.userSmsDetails.MobileNo,
        this.userSmsDetails.EmailID?'Email':'Mobile').subscribe((res:any) => {
      if (res.ResultCode === 100) {
        this.userSmsDetails = res.Result;
        if (this.userSmsDetails.Address.PinCode && this.userSmsDetails.Address.PinCode.trim().length > 0) {
          this.pincode = this.userSmsDetails.Address.PinCode;
        }
      } else {
        this.snackbarUtilService.showError();
      }
      this.loading = false;
    }, (error: any) => {
      console.error(error);
      this.loading = false;
      this.snackbarUtilService.showError();
    });
  }

  proceedToPay() {
    if (this.pincode) {
      if (this.pincode.toString().match('[0-9]')) {
        if (this.pincode.toString().length === 6) {

        } else {
          this.snackbarUtilService.showError('Invalid Pin Code');
          return;
        }
      } else {
        this.snackbarUtilService.showError('Invalid Pin Code');
        return;
      }
    } else {
      this.snackbarUtilService.showError('Pin Code is required');
      return;
    }
    this.loading = true;
    this.userSmsDetails.Address.PinCode = this.pincode;
    this.userFormService.updateUserDetails(this.userSmsDetails).subscribe((res: any) => {
      this.loading = false;
      if (res.ResultCode === 100) {
        this._router.navigate(['/user/subscriptiondetail'], {
          queryParams: {
            id: this.selectedSubscriptionId
          }
        });
      } else {
        this.snackbarUtilService.showError();
      }
    }, (error: any) => {
      this.loading = false;
      console.error(error);
      this.snackbarUtilService.showError();
    });
  }

}
