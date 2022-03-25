import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { MyDishTvSpaceService } from '../../services/mydishtvspace.service';

@Component({
  selector: 'app-self-help',
  templateUrl: './self-help.component.html',
  styleUrls: ['./self-help.component.scss']
})
export class SelfHelpComponent implements OnInit {
  platform: string;
  OTTSubscriberID: string;
  token: string;
  userCategory: string;
  userDetails: any;
  emailId: string;
  complaintForm: FormGroup

  d2h: `https://www.d2h.com`
  // d2h: any = `https://1www.d2h.com`
  complaintContainer: boolean = false;
  resultStatus: any;
  complaintID: any;
  viewBlock: boolean = false;
  constructor(
    private router: Router,
    private mydishtvspaceservice: MyDishTvSpaceService,
    private snackbarUtilService: SnackbarUtilService,
    private modalService: NgbModal,
    public fb: FormBuilder,
  ) {
    this.token = this.mydishtvspaceservice.getOttApiToken();
    this.OTTSubscriberID = this.mydishtvspaceservice.getOTTSubscriberID(); //'33621995'
    this.userCategory = this.mydishtvspaceservice.getUserCategory();
    this.platform = this.userCategory == '1' ? 'mydishtvspace' : 'myd2hspace';
  }

  ngOnInit(): void {
    this.complaintForm = this.fb.group({
      complaintID: [''],
    })
    this.mydishtvspaceservice.getUserAccountDetails(this.token, this.OTTSubscriberID).subscribe((response: any) => {
      if (response.ResultDesc === "Success") {
        this.userDetails = response.Result[0]
        response.Result.sort(function (a, b) {
          return a.Status - b.Status;
        });
        this.emailId = `${btoa(response.Result[0].MobileNumber)}`
      }
    })
  }

  onClickAccountBalanceIssue() {
    window.location.href = `${this.d2h}/home/external-login?emailid=${this.emailId}&password=&source=Watcho&returnUrl=self-help/know-your-account-info`
  }

  onClickRechargeFailure() {
    window.location.href = `${this.d2h}/home/external-login?emailid=${this.emailId}&password=&source=Watcho&returnUrl=self-help/complaint`
  }

  onClickRaiseServiceRequest() {
    window.location.href = `${this.d2h}/home/external-login?emailid=${this.emailId}&password=&source=Watcho&returnUrl=raise-a-request`
  }

  onClickSelfTroubleshoting() {
    window.location.href = `${this.d2h}/home/external-login?emailid=${this.emailId}&password=&source=Watcho&returnUrl=selfhelp/solutions-to-solve-your-problems`
  }

  onClickHelpForUsingProduct() {
    window.location.href = `${this.d2h}/home/external-login?emailid=${this.emailId}&password=&source=Watcho&returnUrl=self-help/faq`
  }

  onClickAddAnotherConnection() {
    this.router.navigate([`/user/${this.platform}/get-second-connections`]);
  }

  onClickUpgradeTheHardware() {
    this.router.navigate([`/user/${this.platform}/upgrade-box`]);
  }

  onClickDealerLocator() {
    window.location.href = `${this.d2h}/dealer-locator?emailid=${this.emailId}&password=OTP`
  }

  onClickNodalOfficer() {
    window.location.href = `${this.d2h}/nodal-officer?emailid=${this.emailId}&password=OTP`
  }

  onClickTrackComplaintStatus() {
    this.complaintContainer = true
  }

  onClickSubmit() {
    this.viewBlock = false
    let formValue = this.complaintForm.value
    this.complaintID = parseInt(formValue.complaintID)
    this.mydishtvspaceservice.getComplaintIDStatus(this.token, this.complaintID).subscribe((response: any) => {
      if (response.ResultDesc === "Success") {
        this.resultStatus = response.Result
        this.snackbarUtilService.showSnackbar(response.ResultDesc);
        this.viewBlock = true
      }
      else{
        this.snackbarUtilService.showSnackbar(response.ResultDesc);

      }
    })
  }
}
