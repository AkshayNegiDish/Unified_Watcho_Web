import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-loading',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input()
  show: boolean;

  @Input()
  config: string;

  constructor() {
  }

  ngOnInit() {
  }

}
