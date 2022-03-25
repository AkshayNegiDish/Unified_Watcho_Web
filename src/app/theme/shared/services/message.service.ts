import { AfterViewInit, Injectable, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class MessageService implements OnInit, AfterViewInit {

  private messageCommon = new BehaviorSubject<any[]>(null);

  messageCommonObj$ = this.messageCommon.asObservable();


  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() { }

  sendCommonMessage(message: any[]) {
    this.messageCommon.next(message);
  }

}
