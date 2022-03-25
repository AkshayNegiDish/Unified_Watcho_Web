import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book-dth',
  templateUrl: './book-dth.component.html',
  styleUrls: ['./book-dth.component.scss']
})
export class BookDTHComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onClickDishTv() {
    window.location.href = `https://www.dishtv.in/pages/welcome/products.aspx`
  }
  onClickD2h() {
    window.location.href = `https://www.d2h.com/dth-connection/book`
  }
}
