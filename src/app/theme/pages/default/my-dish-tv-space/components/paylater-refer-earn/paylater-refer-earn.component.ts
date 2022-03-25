import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyDishTvSpaceService } from '../../services/mydishtvspace.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { NgbModal, ModalDismissReasons }
  from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-paylater-refer-earn',
  templateUrl: './paylater-refer-earn.component.html',
  styleUrls: ['./paylater-refer-earn.component.scss']
})
export class PaylaterReferEarnComponent implements OnInit {

  platform: string;
  OTTSubscriberID: string;
  token: string;
  userCategory: string;
  eurl: string = '/';
  loading: boolean = false;
  show: boolean = false;
  showD2h: boolean = false;
  menuTabs: boolean = true;
  menuTabs_d2h: boolean = true;
  refer_Earn: boolean = false;
  refer_Earn_d2h: boolean = false;
  instant_credit: boolean = false;
  instant_credit_d2h: boolean = false;
  userDetails: any;
  zeePlax: string;
  boxServicePlan: string;
  troubleShooting: string;
  consumerCorner: string;
  friendsRecharge: string;
  referEarn: string;
  d2hCombo: string;
  paylater: string;
  smartKIT: string;
  traiRedirect: string;
  d2hStream: string;
  allAccount: any;
  constructor(
    private router: Router,
    private mydishtvspaceservice: MyDishTvSpaceService,
    private snackbarUtilService: SnackbarUtilService,
    private _activatedRoute: ActivatedRoute
  ) {
    this.token = this.mydishtvspaceservice.getOttApiToken();
    this.OTTSubscriberID = this.mydishtvspaceservice.getOTTSubscriberID(); //'33621995'
    this.userCategory = this.mydishtvspaceservice.getUserCategory();
    this.platform = this.userCategory == '1' ? 'mydishtvspace' : 'myd2hspace';
  }

  ngOnInit() {
    this._activatedRoute.params.subscribe(parameter => {
      if (this.userCategory == '1') {
        if (parameter.tabs == 'dishPaylater') {
          this.instant_credit = true
        }
        else {

        }
      }
      else {
        if (parameter.tabs == 'd2hPaylater') {
          this.instant_credit_d2h = true
        }
        else {

        }
      }
    })
    this.getData(this.OTTSubscriberID, 1)
  }

  onClickRecharge() {
    this.router.navigate(['/user/rechargedetail']);
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
          this.zeePlax = `${dishtv}/Pages/Services/Zeeplex.aspx?Link=Internal&param=${data.Result}`
          this.boxServicePlan = `${dishtv}/Pages/set-top-box-service-warranty.aspx?Link=Internal&param=${data.Result}`
          this.troubleShooting = `${dishtv}/Pages/DIY/Technical-Trouble-Shooting.aspx?Link=Internal&param=${data.Result}`
          this.consumerCorner = `${dishtv}/Pages/Offers/Consumer-Corner.aspx`
          this.referEarn = `${dishtv}/Pages/Others/Refer-A-Friend.aspx?Link=Internal&param=${data.Result}`
        }
      });
    } else {
      this.loading = false;
      this.consumerCorner = `${d2h}/consumerCorner`
      this.paylater = `${d2h}/myaccount/recharge?emailid=${btoa(Dishd2hData.MobileNumber)}&password=OTP`
      this.d2hCombo = `${d2h}/subscription-plan/d2h-combo?emailid=${btoa(Dishd2hData.MobileNumber)}&password=OTP`
      this.friendsRecharge = `${d2h}/myaccount/recharge?emailid=${btoa(Dishd2hData.MobileNumber)}&password=OTP`
      this.referEarn = `${d2h}/home/external-login?emailid=${btoa(Dishd2hData.MobileNumber)}&password=&source=Watcho&returnUrl=myaccount/refer-n-earn`
      this.eurl = `${d2h}/home/external-login?emailid=${btoa(Dishd2hData.MobileNumber)}&password=&source=Watcho&returnUrl=myaccount/manage-pack`;
      this.zeePlax = `${d2h}/home/external-login?emailid=${btoa(Dishd2hData.MobileNumber)}&password=&source=Watcho&returnUrl=zee-plex`
      this.boxServicePlan = `${d2h}/home/external-login?emailid=${btoa(Dishd2hData.MobileNumber)}&password=&source=Watcho&returnUrl=selfhelp/extended-box-warranty`
      this.smartKIT = `${d2h}/d2h-magic`
      this.traiRedirect = `${d2h}/regulatory/trai?emailid=${btoa(Dishd2hData.MobileNumber)}&password=OTP`
      this.d2hStream = `${d2h}/set-top-box/d2h-stream`
    }
  }
  onClickVCNumber(vcNumber) {
    this.getData(this.OTTSubscriberID, vcNumber)
  }
  onClickAvailNowD2h() {
    this.loading = true;
    this.mydishtvspaceservice.InsertPayLater(this.token, this.OTTSubscriberID, this.userCategory).subscribe((response: any) => {
      if (response.ResultCode === 200) {
        console.log(response, "++++++++++++++++")
        this.snackbarUtilService.showSnackbar(response.ResultDesc);
        this.loading = false;
      }
      else {
        this.snackbarUtilService.showSnackbar(response.ResultDesc);
        this.loading = false;
      }
    })
    // this.mydishtvspaceservice.IsEligibleForPayLater(this.token, this.OTTSubscriberID, this.userCategory).subscribe((response: any) => {
    //   if (response.ResultCode === 200) {
    //     this.loading = false;

    //   }
    //   else {
    //     this.loading = false;
    //     this.snackbarUtilService.showSnackbar(response.ResultDesc);
    //   }
    // })
  }

  onClickAvailNow() {
    this.loading = true;
    this.mydishtvspaceservice.InsertPayLater(this.token, this.OTTSubscriberID, this.userCategory).subscribe((response: any) => {
      if (response.ResultCode === 200) {
        this.loading = false;
        this.snackbarUtilService.showSnackbar(response.ResultDesc);
      }
      else {
        this.loading = false;
        this.snackbarUtilService.showSnackbar(response.ResultDesc);
      }
    })
  }
}
