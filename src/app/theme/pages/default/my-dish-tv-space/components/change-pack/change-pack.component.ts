import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-change-pack',
  templateUrl: './change-pack.component.html',
  styleUrls: ['./change-pack.component.scss']
})
export class ChangePackComponent implements OnInit {
  url: string = "https://www.dishtv.in/Pages/map.aspx";//"https://web-qa.watcho.com/web/privacy-policy.html";
  urlSafe: SafeResourceUrl;
  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
//https://www.dishtv.in/Pages/map.aspx
}
