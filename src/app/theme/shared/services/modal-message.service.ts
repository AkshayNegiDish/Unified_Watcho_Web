import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class ModalMessageService implements OnInit {

  private messageCommon = new BehaviorSubject<boolean>(false);

  messageCommonObj$ = this.messageCommon.asObservable();


  constructor() { }

  ngOnInit() { }

  sendCommonMessage(message: boolean) {
    this.messageCommon.next(message);
  }

}
