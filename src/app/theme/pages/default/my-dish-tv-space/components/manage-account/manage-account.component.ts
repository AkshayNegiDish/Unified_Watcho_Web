import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MyDishTvSpaceService } from '../../services/mydishtvspace.service';
import { Router } from '@angular/router';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';


@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit {
  token: string;
  user: any;
  OTTSubscriberID: string;
  Name: string;
  Dishd2hSubscriberID: string;
  Dishd2hSubscriptionID: number;
  SubscriberCategory: number;
  RechargeDueDate: string;
  SwitchOffDate: string;
  AccountBalance: string;
  MobileNumber: string;
  EmailId: string;
  UserID: string;
  Address: string;
  SubscribePack: string;
  RechargeAmount: string;
  loading: boolean = false;
  editmobile: boolean = false;
  editemail: boolean = false;
  tempEmail: string = '';
  tempMobile: string = '';
  userCategory: string;
  platform: string;
  rootPlatform: string;
  eurl: string = '/';

  constructor(private router: Router, private mydishtvspaceservice: MyDishTvSpaceService, private snackbarUtilService: SnackbarUtilService) {
    this.token = this.mydishtvspaceservice.getOttApiToken();
    this.OTTSubscriberID = this.mydishtvspaceservice.getOTTSubscriberID();
    this.userCategory = this.mydishtvspaceservice.getUserCategory();
    this.platform = this.userCategory == '1' ? 'dishtv' : 'd2h';
    this.rootPlatform = this.userCategory == '1' ? 'mydishtvspace' : 'myd2hspace';
  }
  ngOnInit() {
    this.loading = true;
    this.mydishtvspaceservice.getUserAccountDetails(this.token, this.OTTSubscriberID).subscribe((response: any) => {
      if (response.ResultDesc === "Success" && response.Result) {
        response.Result.sort(function(a, b) {
          return a.Status - b.Status;
        });
        this.Name = response.Result[0].Name;
        this.Dishd2hSubscriberID = response.Result[0].Dishd2hSubscriberID;
        this.Dishd2hSubscriptionID = response.Result[0].Dishd2hSubscriptionID
        this.RechargeDueDate = response.Result[0].RechargeDueDate;
        this.SwitchOffDate = response.Result[0].SwitchOffDate;
        this.AccountBalance = response.Result[0].AccountBalance;
        this.MobileNumber = response.Result[0].MobileNumber;
        this.EmailId = response.Result[0].EmailId;
        this.SubscribePack = response.Result[0].SubscribePack;
        this.RechargeAmount = response.Result[0].RechargeAmount;
        this.SubscriberCategory = response.Result[0].SubscriberCategory;
        this.UserID = response.Result[0].UserID;
        this.Address = response.Result[0].Address;
        if (this.SubscriberCategory === 1) {
          this.mydishtvspaceservice.getencryptedUrl(this.token, response.Result[0].Dishd2hSubscriptionID).subscribe((data: any) => {
            if (!data.Result) {
              this.snackbarUtilService.showSnackbar('Something went wrong');
            } else {
              this.eurl = `https://www.dishtv.in/Pages/map.aspx?Link=Internal&param=${data.Result}`;
            }
          });
        } else {
          this.eurl = `https://www.d2h.com/home/mobile-nto?emailid=${btoa(response.Result[0].MobileNumber)}&password=OTP`;
        }
      } else {
        this.snackbarUtilService.showSnackbar('Something went wrong');
      }
      this.loading = false;
    });
  }
  refresh() {
    this.loading = true;
    this.mydishtvspaceservice.refreshAccount(this.token, this.Dishd2hSubscriptionID).subscribe((response: any) => {
      if (response.ResultDesc === "Success") {
        this.AccountBalance = response.Result;
        this.snackbarUtilService.showSnackbar(response.ResultDesc);
      } else {
        this.snackbarUtilService.showSnackbar('Something went wrong');
      }
      this.loading = false;
    });
  }
  onMobileEdit(val: boolean, mobileEl) {
    if (!val) {
      this.editmobile = true;
      setTimeout(function() {
        mobileEl.focus();
      }, 0);
    } else {
      if (!this.tempMobile.match(/^\d{10}$/)) {
        this.snackbarUtilService.showSnackbar('Please enter a valid number');
        this.editmobile = true;
      } else {
        this.loading = true;
        let reqObj = {
          MobileNUmber: this.tempMobile,
          Dishd2hSubscriptionID: this.Dishd2hSubscriptionID,
          Dishd2hSubscriberID: this.Dishd2hSubscriberID,
          SubscriberCategory: this.SubscriberCategory
        }
        this.mydishtvspaceservice.updateMobileNumber(this.token, reqObj).subscribe((response: any) => {
          if (response.ResultDesc === "Success") {
            this.tempMobile = '';
            this.editmobile = false;
            this.snackbarUtilService.showSnackbar(response.Result);
          } else {
            this.snackbarUtilService.showSnackbar(response.ResultDesc);
          }
          this.loading = false;
        });
      }
    }
  }
  onEmailEdit(val: boolean, event, emailEl) {
    if (!val) {
      this.editemail = true;
      setTimeout(function() {
        emailEl.focus();
      }, 0);
      event.target.focus();
    } else {
      if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.tempEmail))) {
        this.snackbarUtilService.showSnackbar('Please enter a valid email');
        this.editemail = true;
      } else {
        this.loading = true;
        let reqObj = {
          Emailid: this.tempEmail,
          Dishd2hSubscriptionID: this.Dishd2hSubscriptionID,
          Dishd2hSubscriberID: this.Dishd2hSubscriberID,
          SubscriberCategory: this.SubscriberCategory
        }
        this.mydishtvspaceservice.updateEmailId(this.token, reqObj).subscribe((response: any) => {
          if (response.ResultDesc === "Success") {
            this.tempEmail = '';
            this.editemail = false;
            this.snackbarUtilService.showSnackbar(response.Result);
          } else {
            this.snackbarUtilService.showSnackbar(response.ResultDesc);
          }
          this.loading = false;
        });
      }
    }
  }
  mobileChange(event: any) {
    this.tempMobile = event.target.textContent;
  }
  emailChange(event: any) {
    this.tempEmail = event.target.textContent;
  }
  nextRechargeClick() {
    this.router.navigate([`/user/${this.rootPlatform}/manage-account/nextrecharge-detail`]);
  }
  onClickChangePack() {
    window.location.href = this.eurl;
  }
}