import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { AppUtilService } from '../../../services/app-util.service';

declare var $: any;

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  url: string;
  articleList: any;
  sectionName: any;

  constructor(private router: Router, private appUtilService: AppUtilService) { 
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.url = this.router.url;
      }
    });
    
  }

  ngOnInit() {
    let urlArray = this.url.split('/');
    this.appUtilService.getSectionList().subscribe(res => {
      res.sections.forEach(element => {
        if (element.id === +urlArray[3]) {
          this.sectionName = element.name;
        }
      });
    }, error => {    });

    this.appUtilService.getArticleListById(urlArray[3]).subscribe(response => {
      this.articleList = response.articles;
    }, error => {    });
  }

}
