import { Component, OnInit } from '@angular/core';
import { MyDishTvSpaceService } from '../../../services/mydishtvspace.service';

@Component({
  selector: 'app-next-recharge',
  templateUrl: './next-recharge.component.html',
  styleUrls: ['./next-recharge.component.scss']
})
export class NextRechargeComponent implements OnInit {
  user : any;
  token: string;
  OTTSubscriberID: string;
  details : any[];
  Dishd2hSubscriberID : string;
  platform : string;
  loading : boolean = false;
  userCategory : string;

  constructor(private mydishtvspaceservice: MyDishTvSpaceService) { 
    this.token = this.mydishtvspaceservice.getOttApiToken();
    this.userCategory = this.mydishtvspaceservice.getUserCategory();
    this.OTTSubscriberID = this.mydishtvspaceservice.getOTTSubscriberID();
    this.platform = this.userCategory == '1' ? 'dishtv' : 'd2h';
  }
  ngOnInit() {
    this.loading = true;
    this.mydishtvspaceservice.getUserAccountDetails(this.token, this.OTTSubscriberID).subscribe((response: any) => {
      if (response.ResultDesc === "Success") {
        response.Result.sort(function(a, b) {
          return a.Status - b.Status;
        });
        this.Dishd2hSubscriberID = response.Result[0].Dishd2hSubscriberID;
        this.mydishtvspaceservice.getpackageDetails(this.token,response.Result[0].Dishd2hSubscriptionID).subscribe((packDetails: any) => {
          this.loading = false;
          this.details = packDetails.Result;
        });
      } else {
        this.loading = false;
      }
    });
  }

}
