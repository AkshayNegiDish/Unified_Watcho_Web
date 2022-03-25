import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { MyDishTvSpaceService } from '../../services/mydishtvspace.service';

@Component({
  selector: 'app-upgrade-box',
  templateUrl: './upgrade-box.component.html',
  styleUrls: ['./upgrade-box.component.scss']
})
export class UpgradeBoxComponent implements OnInit {
  upgradeBoxForm: FormGroup
  platform: string;
  OTTSubscriberID: string;
  token: string;
  userCategory: string;
  loading: boolean = true;
  edit: boolean = true;
  userDetails: any;
  languages = [
    { id: 1, value: 'HINDI' },
    { id: 2, value: 'GUJRATI' },
    { id: 3, value: 'MARATHI' },
    { id: 4, value: 'TELEGU' },
    { id: 5, value: 'KANNADA' },
    { id: 6, value: 'MALYALAM' },
    { id: 7, value: 'TAMIL' },
    { id: 8, value: 'BENGALI' },
    { id: 9, value: 'ORIYA' },
    { id: 10, value: 'PUNJABI' },
    { id: 11, value: 'ENGLISH' },
  ]
  constructor(
    private mydishtvspaceservice: MyDishTvSpaceService,
    private snackbarUtilService: SnackbarUtilService,
    private router: Router,
    public fb: FormBuilder,
  ) {
    this.token = this.mydishtvspaceservice.getOttApiToken();
    this.OTTSubscriberID = this.mydishtvspaceservice.getOTTSubscriberID(); //'33621995'
    this.userCategory = this.mydishtvspaceservice.getUserCategory();
    this.platform = this.userCategory == '1' ? 'mydishtvspace' : 'myd2hspace';
  }
  ngOnInit() {
    this.upgradeBoxForm = this.fb.group({
      alternateNumber: [''],
      language: ['']
    })
    this.mydishtvspaceservice.getUserAccountDetails(this.token, this.OTTSubscriberID).subscribe((response: any) => {
      if (response.ResultDesc === "Success") {
        this.userDetails = response.Result[0]
        // this.upgradeBoxForm.patchValue({ alternateNumber: this.userDetails.MobileNumber })
        this.upgradeBoxForm.patchValue({ language: 1 })
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }

  onclickSubmit() {
    let formValue = this.upgradeBoxForm.value
    this.loading = true;
    let sendValue = {
      SubscriberCategory: this.userDetails.SubscriberCategory,
      Remarks: `Test`,
      Name: this.userDetails.Name,
      MobileNo: this.userDetails.MobileNumber,
      EmailID: this.userDetails.EmailId,
      AlternateNo: formValue.alternateNumber,
      VCNo: this.userDetails.Dishd2hSubscriberID,
      Source: `APP`,
      UserId: this.userDetails.UserID,
      LanguageId:formValue.language,
      OTTSubscriberID: this.userDetails.Dishd2hSubscriptionID,
    }
    this.mydishtvspaceservice.upgradeBox(this.token, sendValue).subscribe((response: any) => {
      this.loading = false;
      this.snackbarUtilService.showSnackbar(response.ResultDesc);
      this.edit = true
    })
  }
}
