import { Component, OnInit } from '@angular/core';
import { AppUtilService } from '../../services/app-util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  sectionList: any;

  constructor(private appUtilSerive: AppUtilService, private router: Router) { }

  ngOnInit() {
    this.appUtilSerive.getSectionList().subscribe(response => {
      this.sectionList = response.sections;
    }, error => {    });
  }

  watchArticles(id: any) {
    this.router.navigateByUrl('/help/faq/'+id);
  }

}
