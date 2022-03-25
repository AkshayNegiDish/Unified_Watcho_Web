import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyDishTvSpaceService } from '../../services/mydishtvspace.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { NgbModal, ModalDismissReasons }
  from '@ng-bootstrap/ng-bootstrap';
import { AppUtilService } from '../../../../../shared/services/app-util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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
    private modalService: NgbModal,
    private appUtilService: AppUtilService,
  ) {
    this.token = this.mydishtvspaceservice.getOttApiToken();
    this.OTTSubscriberID = this.mydishtvspaceservice.getOTTSubscriberID(); //'33621995'
    this.userCategory = this.mydishtvspaceservice.getUserCategory();
    this.platform = this.userCategory == '1' ? 'mydishtvspace' : 'myd2hspace';
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

  onClickPoster1() {
    window.location.href = this.d2hStream;
    // let url = `https://s3.ap-southeast-1.amazonaws.com/ads.assets/watchodishtvspacebanners/footer/Mobile/d2h/url1.txt`;
    // fetch(url)
    //   .then(function (response) {
    //     return response.text()
    //   })
    //   .then(function (data) {
    //     console.log(data, '/*/*/*/*/*/*/*/*');
    //   })
    //   .catch(function (err) {
    //     console.log('Something went wrong!', err);
    //   });
  }

  onClickPoster2() {
    window.location.href = this.smartKIT;
  }

  onClickD2hStream() {
    window.location.href = this.d2hStream;
  }

  onClickSDHD() {
    window.location.href = this.d2hCombo;
  }

  onClickSmartKit() {
    window.location.href = this.smartKIT;
  }
  onClickPayLater() {
    window.location.href = this.paylater
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
    window.location.href = this.eurl;
  }

  onClickRecharge() {
    this.router.navigate(['/user/rechargedetail']);
  }

  onClickContactus() {
    this.router.navigate([`/user/${this.platform}/contact-us`]);
  }

  toggleDisplayDivIf() {
    this.show = !this.show;
  }

  toggleDisplayDivIfD2h() {
    this.showD2h = !this.showD2h;
  }
  onClickReferEarn() {
    window.location.href = this.referEarn
  }

  onClickReferEarnd2h() {
    window.location.href = this.referEarn
  }

  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  onClickKnowMoreD2h() {
    window.location.href = this.referEarn
  }

  onClickInstantCredit() {
    this.router.navigate([`/user/${this.platform}/mySpace/dishPaylater`]);
  }

  onClickSelfHelp() {
    this.router.navigate([`/user/${this.platform}/self-help`]);
  }

  onClickInstantRecharge() {
    this.router.navigate([`/user/${this.platform}/mySpace/d2hPaylater`]);
  }

  onClickConsumerCorner() {
    window.location.href = this.consumerCorner
  }

  onClickZeePlex() {
    window.location.href = this.zeePlax
  }

  onClickGetSecondConnections() {
    this.router.navigate([`/user/${this.platform}/get-second-connections`]);

  }
  onClickBoxServicePlan() {
    window.location.href = this.boxServicePlan
  }

  onClickTroubleShooting() {
    window.location.href = this.troubleShooting
  }

  closeResult = '';

  onClickWhatsappConsent(content) {
    this.loading = true;
    this.mydishtvspaceservice.IsEligibleForWhatsAppConsentFlag(this.token, this.OTTSubscriberID, this.userCategory).subscribe((response: any) => {
      if (response.ResultCode === 200) {
        this.loading = false;
        this.modalService.open(content,
          {
            ariaLabelledBy: 'modal-basic-title',
            windowClass: 'my-class'
          }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
      }
      else {
        this.loading = false;
        this.snackbarUtilService.showSnackbar(response.ResultDesc);
      }
    })
  }

  onClickWhatsappConsentd2h(content) {
    this.loading = true;
    this.mydishtvspaceservice.IsEligibleForWhatsAppConsentFlag(this.token, this.OTTSubscriberID, this.userCategory).subscribe((response: any) => {
      if (response.ResultCode === 200) {
        this.loading = false;
        this.modalService.open(content,
          {
            ariaLabelledBy: 'modal-basic-title',
            windowClass: 'my-class'
          }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
      }
      else {
        this.loading = false;
        this.snackbarUtilService.showSnackbar(response.ResultDesc);
      }
    })
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

  onClickImIn() {
    this.mydishtvspaceservice.InsertWhatsAppConsentDetails(this.token, this.OTTSubscriberID, this.userCategory).subscribe((response: any) => {
      if (response.ResultCode === 200) {
        this.snackbarUtilService.showSnackbar(response.ResultDesc);
      }
      else {
        this.snackbarUtilService.showSnackbar(response.ResultDesc);
      }
    })
  }

  onClickFriendsRecharge() {
    window.location.href = this.friendsRecharge
  }

  onClickKnowMore() {
    window.location.href = this.referEarn
  }

  onClickTRAI() {
    window.location.href = this.traiRedirect
  }

  onClickAvailNow() {
    this.loading = true;
    this.mydishtvspaceservice.InsertPayLater(this.token, this.OTTSubscriberID, this.userCategory).subscribe((response: any) => {
      if (response.ResultCode === 200) {
        this.loading = false;
        this.snackbarUtilService.showSnackbar(response.ResultDesc);
      }
      else {
        this.snackbarUtilService.showSnackbar(response.ResultDesc);
      }
    })
  }
  onClickAvailNowD2h() {
    this.loading = true;
    this.mydishtvspaceservice.InsertPayLater(this.token, this.OTTSubscriberID, this.userCategory).subscribe((response: any) => {
      if (response.ResultCode === 200) {
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

  saveGaGtmEvents(eventName) {
    if (this.userCategory == '1') {
      var location = `My_Dish_Web`
    }
    let datalayerJson = {
      'button_id': `${eventName}`,
      'button_name': `${eventName}`,
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful',
      'button_location': 'My_Dish_Web'
    };
    this.appUtilService.getGTMTag(datalayerJson, `${eventName}`);
  }
}
