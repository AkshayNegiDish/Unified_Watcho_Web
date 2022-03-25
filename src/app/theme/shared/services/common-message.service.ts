import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
    providedIn: 'root',
})
export class CommonMessageService {

    private commonMessage = new BehaviorSubject<any[]>(null);
    commonMessageObj$ = this.commonMessage.asObservable();

    private signInToggle = new BehaviorSubject<boolean>(null);
    signInToggleObj$ = this.signInToggle.asObservable();

    private searchQuery = new BehaviorSubject<string>(null);
    searchQueryObj$ = this.searchQuery.asObservable();



    constructor() { }

    sendcommonMessageArray(message: any[]) {
        this.commonMessage.next(message);
    }

    loginmessage(message: boolean) {
        this.signInToggle.next(message);
    }

    searchString(query: string) {
        this.searchQuery.next(query);
    }


}