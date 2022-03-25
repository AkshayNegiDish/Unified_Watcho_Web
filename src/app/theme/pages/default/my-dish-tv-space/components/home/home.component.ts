import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyDishTvSpaceService } from '../../services/mydishtvspace.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  platform : string;
  OTTSubscriberID: string;
  token: string;
  userCategory: string;
  eurl : string = '/';
  loading: boolean = false;
  constructor(private router: Router, private mydishtvspaceservice : MyDishTvSpaceService, private snackbarUtilService: SnackbarUtilService) { 
    this.token = this.mydishtvspaceservice.getOttApiToken();
    this.OTTSubscriberID = this.mydishtvspaceservice.getOTTSubscriberID(); //'33621995'
    this.userCategory = this.mydishtvspaceservice.getUserCategory();
    this.platform = this.userCategory == '1' ? 'mydishtvspace' : 'myd2hspace';
  }

  ngOnInit() {
      this.loading = true;
      this.mydishtvspaceservice.getUserAccountDetails(this.token, this.OTTSubscriberID).subscribe((response: any) => {
        if (response.ResultDesc === "Success") {
          response.Result.sort(function(a, b) {
            return a.Status - b.Status;
          });
          if(this.userCategory === "1") {
            this.mydishtvspaceservice.getencryptedUrl(this.token,response.Result[0].Dishd2hSubscriptionID).subscribe((data: any) => {
              if(!data.Result) {
                this.loading = false;
                this.snackbarUtilService.showSnackbar('Something went wrong');
              } else {
                this.loading = false;
                this.eurl = `https://www.dishtv.in/Pages/map.aspx?Link=Internal&param=${data.Result}`;
              }
            });
          } else {
              this.loading = false;
              this.eurl = `https://www.d2h.com/home/mobile-nto?emailid=${btoa(response.Result[0].MobileNumber)}&password=OTP`;
          }
        } else {
          this.loading = false;
        }
      });
  }

  onClickChannelGuide() {
    this.router.navigate([`/user/${this.platform}/channel-guide`]);
  }

  onClickChannelFinder() {
    this.router.navigate([`/user/${this.platform}/channels`]);
  }

  onClickManageAccount() {
    this.router.navigate([`/user/${this.platform}/manage-account`]);
  }

  onClickChangePack() {
    // this.router.navigate([`/user/${this.platform}/change-pack`]);
    window.location.href = this.eurl;
  }

  onClickRecharge() {
    this.router.navigate(['/user/rechargedetail']);
  }

  onClickContactus() {
    this.router.navigate([`/user/${this.platform}/contact-us`]);
  }
}
