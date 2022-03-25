import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackbarUtilService } from '../../../services/snackbar-util.service';
import { Router, Event, NavigationEnd, ActivatedRoute, ParamMap } from '@angular/router';
import { AppUtilService } from '../../../services/app-util.service';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {

  form: FormGroup;
  ticketList: any;
  createdTime: string;
  createdDate: Date;
  ticketId: number;
  loading: boolean = false;
  comment: any;
  watchoAdmin: boolean;
  title: any;
  requesterId: number;

  constructor(private fb: FormBuilder, private snackbarUtilService: SnackbarUtilService, private route: ActivatedRoute,private appUtilService: AppUtilService) {
    this.comment = '';
    this.form = this.fb.group({
      comment: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.ticketId = +params.get('ticketId');
      this.title = params.get('title');
      this.requesterId = +params.get('requesterId');
      this.getCommentfromTicketId();
    })
  }

  formatAMPM(date) {
    date = new Date(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0'+hours : hours;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  submit() {
    this.loading = true;
    if (this.form.valid) {
      // write code
      this.comment = this.form.value.comment;
      console.log(this.form.value.comment);
      let requests: any = {
        ticket: {
          status: "open",
          comment: {
            body: this.form.value.comment,
            author_id: this.requesterId
          }
        }
      }
      this.form.reset();
      this.appUtilService.updateTicket(this.ticketId, requests).subscribe(response => {
        this.loading = false;
        this.ticketList = response;
        this.snackbarUtilService.showSnackbar("Comment added successfully");
        this.getCommentfromTicketId();
        }, error => {  
          this.loading = false;
       console.log(error);
     }); 
    } else {
      this.loading = false;
      this.snackbarUtilService.showSnackbar("Please add a comment.");
    }
  }

  getCommentfromTicketId() {
    this.loading = true;
    this.appUtilService.getTicketComment(this.ticketId).subscribe(response => {
      this.ticketList = response;
      this.loading= false;
      console.log(this.ticketList);
      }, error => {  
     console.log(error);
     this.loading= false;
   });  
  }

}
