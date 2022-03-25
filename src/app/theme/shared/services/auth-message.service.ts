import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LoginMessageService implements OnInit {

    private messageSource = new BehaviorSubject(null);
    currentMessage$ = this.messageSource.asObservable();

    private searchOnDestroyCommon = new BehaviorSubject<boolean>(null);
    searchOnDestroyCommon$ = this.searchOnDestroyCommon.asObservable();

    private imageChanged = new BehaviorSubject<boolean>(null);
    imageChanged$ = this.imageChanged.asObservable();

    private messageChanged = new BehaviorSubject<boolean>(null);
    messageChanged$ = this.messageChanged.asObservable();

    constructor() {
    }

    ngOnInit() {

    }

    sendLoginMessage(message: boolean) {
        this.messageSource.next(message);
    }

    sendOnDestroySearchMessage(searchmessage: boolean) {
        this.searchOnDestroyCommon.next(searchmessage);
    }

    imageChangedMessage(changeMessage: boolean) {
        this.imageChanged.next(changeMessage)
    }

    ugcPageEnteredMessage(changeMessage: boolean) {
        this.messageChanged.next(changeMessage);
    }
}