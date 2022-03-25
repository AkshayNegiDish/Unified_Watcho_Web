import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUtilService } from '../../services/app-util.service';
import { AppConstants, PlaceholderImage } from '../../typings/common-constants';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {

  ticketList: any;
  createdTime: string;
    email: any;
    loading: boolean = false;
    noResultFound: boolean = false;
    placeholderImage: any;


  constructor(private router: Router,private appUtilService: AppUtilService) { }

  ngOnInit() {
    // this.loading = true;
    this.placeholderImage = PlaceholderImage.NO_RESULT;
    if (JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS))) {
        let usersms = JSON.parse(localStorage.getItem(AppConstants.USER_DETAILS_SMS));
        // localStorage.removeItem('ZD-email');
        if (usersms.EmailID !== "") {
          this.email = usersms.EmailID;
        } else {
          if(localStorage.getItem('ZD-email')) {
            let zdEmail: any = localStorage.getItem('ZD-email');
            this.email = zdEmail;
          } else {
            this.email = '';
          }
        }
      } else if(localStorage.getItem('ZD-email')) {
        let zdEmail: any = localStorage.getItem('ZD-email');
        if (zdEmail !== "" && zdEmail !== undefined) {
          this.email = zdEmail;
        } else {
          this.email = '';
        }
      }

  let zdEmail = localStorage.getItem('ZD-email');
  if(this.email != null) {
    this.getTicketList(this.email);
  } else {
    this.noResultFound = true;
  }

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

  getTicketList(zdEmail: any) {
    this.loading = true;
   this.appUtilService.getTicketListingById(zdEmail).subscribe(response => {
      if(response.data.count === 0) {
        this.noResultFound = true;
      } 
        this.ticketList = response;
        this.loading = false;
  }, error => {  
     this.loading = false;
      console.log(error);
    });
  }

  showTicketDetails(id: any, title: any, requesterId: any) {
    this.router.navigateByUrl('/help/ticketDetails/'+id+ '/' + title + '/' + requesterId);
  }
}
