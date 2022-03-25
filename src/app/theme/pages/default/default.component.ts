import { Component, OnInit, ViewEncapsulation } from '@angular/core';

// TODO: change this to page container bootstrap selector
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-grid.m-grid--ver-desktop.m-grid--desktop.m-body",
  templateUrl: './default.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }

  
}
