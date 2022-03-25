import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlatformIdentifierService } from './platform-identifier.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public permission: Permission;
  constructor(private platformIdendifierService: PlatformIdentifierService, private router: Router) {
    if (this.platformIdendifierService.isBrowser()) {
      this.permission = this.isSupported() ? 'default' : 'denied';
    }
  }


  public isSupported(): boolean {
    return 'Notification' in window;
  }

  requestPermission(): void {
    let self = this;
    if ('Notification' in window) {
      Notification.requestPermission(function (status) {
        return self.permission = status;
      });
    }
  }
  create(title: string, options?: PushNotification): any {
    let self = this;
    return new Observable(function (obs) {
      if (!('Notification' in window)) {
        console.log('Notifications are not available in this environment');
        obs.complete();
      }
      if (self.permission !== 'granted') {
        console.log("The user hasn't granted you permission to send push notifications");
        obs.complete();
      }
      let _notify = new Notification(title, options);
      _notify.onshow = function (e) {
        return obs.next({
          notification: _notify,
          event: e
        });
      };
      _notify.onclick = (e: any) => {
        self.router.navigate(['/ugc/live-contest'], { queryParams: { id: e.target.tag } });
        return obs.next({
          notification: _notify,
          event: e
        });
      };
      _notify.onerror = function (e) {
        return obs.error({
          notification: _notify,
          event: e
        });
      };
      _notify.onclose = function () {
        return obs.complete();
      };
    });
  }
  generateNotification(item: any): void {
    let self = this;
    let options = {
      body: item.description,
      image: item.pic,
      tag: item.id,
      badge: item.pic,
      icon: item.pic
    };
    let notify = self.create(item.name, options).subscribe();
  }
}

export declare type Permission = 'denied' | 'granted' | 'default';
export interface PushNotification {
  body?: string;
  icon?: string;
  tag?: string;
  data?: any;
  renotify?: boolean;
  silent?: boolean;
  sound?: string;
  noscreen?: boolean;
  sticky?: boolean;
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  vibrate?: number[];
}  