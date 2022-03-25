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
	Dishd2hSubscriptionID: number;
	SubscriberCategory: number;
	OTTSubscriberID: string;
	eurl: string;

	constructor(private mydishtvspaceservice: MyDishTvSpaceService) {
		this.userCategory = this.mydishtvspaceservice.getUserCategory();
		this.token = this.mydishtvspaceservice.getOttApiToken();
		this.platform = this.userCategory == '1' ? 'dishtv' : 'd2h';
		this.OTTSubscriberID = this.mydishtvspaceservice.getOTTSubscriberID();

	}

	ngOnInit() {
		let dishtv = `https://www.dishtv.in`
		// let dishtv = `https://beta.dishtv.in`
		let d2h = `https://www.d2h.com`
		// let d2h = `https://1www.d2h.com`

		this.loading = true;
		this.mydishtvspaceservice.getUserAccountDetails(this.token, this.OTTSubscriberID).subscribe((response: any) => {
			if (response.ResultDesc === "Success" && response.Result) {
				this.mydishtvspaceservice.getencryptedUrl(this.token, response.Result[0].Dishd2hSubscriptionID).subscribe((data: any) => {
					if (this.userCategory == '1') {
						this.eurl = `${dishtv}/Pages/Do-It-Yourself-service.aspx?Link=Internal&param=${data.Result}`;
					}
					else {
						this.eurl = `${d2h}/home/external-login?emailid=${btoa(response.Result[0].MobileNumber)}&password=&source=Watcho&returnUrl=self-help/diy-tools`;
					}
				});
				response.Result.sort(function (a, b) {
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

	onClickDIY() {
		window.location.href = this.eurl;
	}
	onClickMissedCall() {
		window.location.href = `https://www.dishtv.in/Pages/DIY/missed-call.aspx`;
		// window.location.href = `https://beta.dishtv.in/Pages/DIY/missed-call.aspx`;
	}
	onClickD2h() {
		window.location.href = `https://www.d2h.com/`;
	}
	onChange(event: any) {
		this.query = event.target.value;
	}
	onSumbit() {
		if (!this.query || !this.query.trim()) {
			alert('Please enter your query');
		} else {
			let reqObj = {
				"Dishd2hSubscriberID": this.Dishd2hSubscriberID,
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
