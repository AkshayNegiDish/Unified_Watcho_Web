import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { MyDishTvSpaceService } from '../../services/mydishtvspace.service';

@Component({
  selector: 'app-get-second-connections',
  templateUrl: './get-second-connections.component.html',
  styleUrls: ['./get-second-connections.component.scss']
})
export class GetSecondConnectionsComponent implements OnInit {
  platform: string;
  OTTSubscriberID: string;
  token: string;
  userCategory: string;
  loading: boolean = true;
  edit: boolean = true;
  userDetails: any;

  constructor(
    private mydishtvspaceservice: MyDishTvSpaceService,
    private snackbarUtilService: SnackbarUtilService,
    private router: Router,

  ) {
    this.token = this.mydishtvspaceservice.getOttApiToken();
    this.OTTSubscriberID = this.mydishtvspaceservice.getOTTSubscriberID(); //'33621995'
    this.userCategory = this.mydishtvspaceservice.getUserCategory();
    this.platform = this.userCategory == '1' ? 'mydishtvspace' : 'myd2hspace';
  }
  ngOnInit() {
    this.mydishtvspaceservice.getUserAccountDetails(this.token, this.OTTSubscriberID).subscribe((response: any) => {
      if (response.ResultDesc === "Success") {
        this.userDetails = response.Result[0]
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }

  onClickEdit() {
    this.edit = false
  }

  onclickSubmit() {
    this.loading = true;
    let sendValue = {
      SubscriberCategory: this.userDetails.SubscriberCategory,
      Remarks: `Test`,
      Name: this.userDetails.Name,
      MobileNo: this.userDetails.MobileNumber,
      EmailID: this.userDetails.EmailId,
      AlternateNo: this.userDetails.MobileNumber,
      VCNo: this.userDetails.Dishd2hSubscriberID,
      Source: `APP`,
      UserId: this.userDetails.UserID,
      LanguageId: 2,
      OTTSubscriberID: this.userDetails.Dishd2hSubscriptionID,
    }
    this.mydishtvspaceservice.SubmitUserRequestToGetOtherConnection(this.token, sendValue).subscribe((response: any) => {
      this.loading = false;
      this.snackbarUtilService.showSnackbar(response.ResultDesc);
      this.edit = true
      // this.router.navigate([`/user/${this.platform}`]);
    })
  }
}
