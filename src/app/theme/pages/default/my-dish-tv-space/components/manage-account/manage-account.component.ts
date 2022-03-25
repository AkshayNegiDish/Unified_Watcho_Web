import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MyDishTvSpaceService } from '../../services/mydishtvspace.service';
import { Router } from '@angular/router';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { NgbModal, ModalDismissReasons }
  from '@ng-bootstrap/ng-bootstrap';

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
  closeResult = '';
  block: number;
  valueType: string;
  value: string;
  userDetails: any;
  allAccount: any;

  constructor(
    private router: Router,
    private mydishtvspaceservice: MyDishTvSpaceService,
    private snackbarUtilService: SnackbarUtilService,
    private modalService: NgbModal
  ) {
    this.token = this.mydishtvspaceservice.getOttApiToken();
    this.OTTSubscriberID = this.mydishtvspaceservice.getOTTSubscriberID();
    this.userCategory = this.mydishtvspaceservice.getUserCategory();
    this.platform = this.userCategory == '1' ? 'dishtv' : 'd2h';
    this.rootPlatform = this.userCategory == '1' ? 'mydishtvspace' : 'myd2hspace';
  }
  ngOnInit() {
    this.getData(this.OTTSubscriberID, 1)
  }


  getData(OTTSubscriberID, status) {
    this.loading = true;
    this.mydishtvspaceservice.getUserAccountDetails(this.token, OTTSubscriberID).subscribe((response: any) => {
      if (response.ResultDesc === "Success") {
        response.Result.sort(function (a, b) {
          return a.Status - b.Status;
        });
        this.allAccount = response.Result
        if (status == 1) {
          this.userDetails = response.Result[0]
          this.getAutoLoginURLs(this.userDetails)
        }
        else {
          let value = this.allAccount.find(element => element.Dishd2hSubscriberID == status);
          this.userDetails = value
          this.getAutoLoginURLs(this.userDetails)
        }
      } else {
        this.loading = false;
      }
    });
  }

  onClickVCNumber(vcNumber) {
    this.getData(this.OTTSubscriberID, vcNumber)
  }
  getAutoLoginURLs(Dishd2hData) {
    let dishtv = `https://www.dishtv.in`
    // let dishtv = `https://beta.dishtv.in`
    let d2h = `https://www.d2h.com`
    // let d2h = `https://1www.d2h.com`

    if (this.userCategory === "1") {
      this.mydishtvspaceservice.getencryptedUrl(this.token, Dishd2hData.Dishd2hSubscriptionID).subscribe((data: any) => {
        if (!data.Result) {
          this.loading = false;
          this.snackbarUtilService.showSnackbar('Something went wrong');
        } else {
          this.loading = false;
          this.eurl = `${dishtv}/Pages/map.aspx?Link=Internal&param=${data.Result}`;
        }
      });
    } else {
      this.loading = false;
      this.eurl = `${d2h}/home/external-login?emailid=${btoa(Dishd2hData.MobileNumber)}&password=&source=Watcho&returnUrl=myaccount/manage-pack`;
    }
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
      setTimeout(function () {
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
          Dishd2hSubscriptionID: this.userDetails.Dishd2hSubscriptionID,
          Dishd2hSubscriberID: this.userDetails.Dishd2hSubscriberID,
          SubscriberCategory: this.userDetails.SubscriberCategory
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
  async onEmailEdit(val: boolean, event, emailEl) {
    if (!val) {
      this.editemail = true;
      setTimeout(function () {
        emailEl.focus();
      }, 0);
      event.target.focus();
    } else {
      let emailStatus = await this.ValidateEmail(this.tempEmail)
      if (!emailStatus) {
        this.snackbarUtilService.showSnackbar('Please enter a valid email');
        this.editemail = true;
      } else {
        this.loading = true;
        let reqObj = {
          Emailid: this.tempEmail,
          Dishd2hSubscriptionID: this.userDetails.Dishd2hSubscriptionID,
          Dishd2hSubscriberID: this.userDetails.Dishd2hSubscriberID,
          SubscriberCategory: this.userDetails.SubscriberCategory
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

  ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true)
    }
    else {
      return (false)
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

  onMobileEditPopUp(content) {
    this.modalService.open(content,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'first-box'
      }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onMobileConfirm(flag, otpContent) {
    if (flag == 'Yes') {
      this.block = 1
      this.valueType = "Mobile";
      this.value = this.userDetails.MobileNumber
    }
    else {
      this.block = 2
      this.valueType = "VCNO";
      this.value = this.userDetails.Dishd2hSubscriberID
    }
    let reqObj = {
      ValueType: this.valueType,
      Value: this.value,
      Source: `WEB`,
      Dishd2hSubscriptionID: this.userDetails.Dishd2hSubscriptionID,
      Dishd2hSubscriberID: this.userDetails.Dishd2hSubscriberID,
      SubscriberCategory: this.userDetails.SubscriberCategory
    }
    this.mydishtvspaceservice.GenerateMobileOTP(this.token, reqObj).subscribe((response: any) => {
      if (response.ResultDesc === "Success") {
        this.modalService.open(otpContent,
          {
            ariaLabelledBy: 'modal-basic-title',
            windowClass: 'second-box'
          }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
      }
      else {
        this.snackbarUtilService.showSnackbar(response.ResultDesc);
      }
    })
  }
  submitOtp() {
    let reqObj = {
      ValueType: this.valueType,
      Value: this.value,
      Source: `WEB`,
      Dishd2hSubscriptionID: this.userDetails.Dishd2hSubscriptionID,
      Dishd2hSubscriberID: this.userDetails.Dishd2hSubscriberID,
      SubscriberCategory: this.userDetails.SubscriberCategory,
      OTP: ' '
    }
    this.mydishtvspaceservice.GenerateMobileOTP(this.token, reqObj).subscribe((response: any) => {
      console.log(response, "***********")
      if (response.ResultDesc === "Success") {

      }
      else {

      }
    })
  }
}