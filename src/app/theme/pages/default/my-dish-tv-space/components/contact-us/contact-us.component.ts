import { Component, OnInit } from '@angular/core';
import { MyDishTvSpaceService } from '../../services/mydishtvspace.service';
declare var $: any;
@Component({
	selector: 'app-contact-us',
	templateUrl: './contact-us.component.html',
	styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
	complaintTypeList: any[] = [];
	loading: boolean;
	lastreasonIndex: number = -1;
	userCategory: string;
	showtextArea: boolean = false;
	query: string;
	platform: string;
	token: string;
	Dishd2hSubscriberID: string;
	Dishd2hSubscriptionID : number;
	SubscriberCategory: number;
	OTTSubscriberID: string;

	constructor(private mydishtvspaceservice: MyDishTvSpaceService) {
		this.userCategory = this.mydishtvspaceservice.getUserCategory();
		this.token = this.mydishtvspaceservice.getOttApiToken();
		this.platform = this.userCategory == '1' ? 'dishtv' : 'd2h';
		this.OTTSubscriberID = this.mydishtvspaceservice.getOTTSubscriberID();

	 }

	ngOnInit() {
		if (this.userCategory == '1') {
			this.loading = true;
			this.mydishtvspaceservice.getUserAccountDetails(this.token, this.OTTSubscriberID).subscribe((response: any) => {
				if (response.ResultDesc === "Success" && response.Result) {
					response.Result.sort(function(a, b) {
						return a.Status - b.Status;
					});
					this.Dishd2hSubscriberID = response.Result[0].Dishd2hSubscriberID;
					this.Dishd2hSubscriptionID = response.Result[0].Dishd2hSubscriptionID
					this.SubscriberCategory = response.Result[0].SubscriberCategory;
					this.mydishtvspaceservice.getComplaintTypeList(this.token, response.Result[0].Dishd2hSubscriptionID).subscribe((response: any) => {
						this.complaintTypeList = response.Result;
						this.loading = false;
					}, reject => {
						this.complaintTypeList = [];
						this.loading = false;
					});
				} else {
					this.loading = false;
				}
			});
		}
	}

	reasonClicked(event: any, index: number) {
		$('.complaints').removeClass('active');
		event.target.classList.toggle('active');
		if (this.lastreasonIndex == index) {
			this.showtextArea = false;
			this.lastreasonIndex = -1;
			$('.complaints').removeClass('active');
		} else {
			this.lastreasonIndex = index;
			this.showtextArea = true;
		}

	}

	onChange(event: any) {
		this.query = event.target.value;
	}
	onSumbit() {
		if (!this.query || !this.query.trim()) {
			alert('Please enter your query');
		} else {
			let reqObj = {
				"Dishd2hSubscriberID":this.Dishd2hSubscriberID,
				"Dishd2hSubscriptionID": this.Dishd2hSubscriptionID,
				"SubscriberCategory": this.SubscriberCategory,
				"ComplaintMessage": this.query,
				"ComplaintTypeID": this.complaintTypeList[this.lastreasonIndex]['ComplaintTypeID']
			};
			this.mydishtvspaceservice.submitComplaint(this.token, reqObj).subscribe((response: any) => {
				if (response.ResultDesc === "Success") {
					alert('Submitted successfully!');
				} else {
					alert(response.ResultDesc);
				}
				$('.complaints').removeClass('active');
				this.showtextArea = false;
				this.lastreasonIndex = -1;
			});
		}
	}
}
