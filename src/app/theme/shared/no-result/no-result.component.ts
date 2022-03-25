import { Component, OnInit } from '@angular/core';
import { PlaceholderImage } from '../typings/common-constants';

@Component({
  selector: 'app-no-result',
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.scss']
})
export class NoResultComponent implements OnInit {

  noResultImg: string;

  constructor() {
    this.noResultImg = PlaceholderImage.NO_RESULT;
  }

  ngOnInit() {
  }

}
