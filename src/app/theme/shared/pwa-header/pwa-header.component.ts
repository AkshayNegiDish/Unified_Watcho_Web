import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pwa-header',
  templateUrl: './pwa-header.component.html',
  styleUrls: ['./pwa-header.component.scss']
})
export class PwaHeaderComponent implements OnInit {

  @Input()
  displayName: string;

  constructor() { }

  ngOnInit() {
  }

}
