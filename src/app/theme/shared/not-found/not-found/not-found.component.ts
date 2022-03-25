import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppConstants } from '../../typings/common-constants';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle(AppConstants.APP_NAME_CAPS + ' : Page Not Found')
  }

}
