import { Component, OnInit } from '@angular/core';
import { AppUtilService } from '../services/app-util.service';
import { KalturaAppService } from '../services/kaltura-app.service';
import { PlatformIdentifierService } from '../services/platform-identifier.service';
import { SnackbarUtilService } from '../services/snackbar-util.service';
declare var $: any;

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notificationMessages: any[];
  results: any = {
    "objectType": "KalturaInboxMessageListResponse",
    "totalCount": 4,
    "objects": [{
      "objectType": "KalturaInboxMessage",
      "createdAt": 1548752102,
      "id": "683",
      "message": "Test",
      "status": "Deleted",
      "type": "SystemAnnouncement",
      "url": ""
    }, {
      "objectType": "KalturaInboxMessage",
      "createdAt": 1549447615,
      "id": "689",
      "message": "Hi Ankit",
      "status": "Read",
      "type": "SystemAnnouncement",
      "url": ""
    }, {
      "objectType": "KalturaInboxMessage",
      "createdAt": 1549449353,
      "id": "690",
      "message": "Hi Ankit and Kaushal dhj ndkfdf nfndfd ui56i657 u56u674 7u67",
      "status": "unread",
      "type": "SystemAnnouncement",
      "url": ""
    }, {
      "objectType": "KalturaInboxMessage",
      "createdAt": 1550487795,
      "id": "698",
      "message": "iOS Test",
      "status": "Read",
      "type": "SystemAnnouncement",
      "url": ""
    }]
  }
  showNotificationDot: boolean = false;
  showNotificationBox: boolean = false;

  constructor(private kalturaAppService: KalturaAppService, private appUtilService: AppUtilService,
    private platformIdentifierService: PlatformIdentifierService, private snackbarUtilService: SnackbarUtilService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if (this.platformIdentifierService.isBrowser()) {
      setTimeout(() => {
        if (this.appUtilService.isUserLoggedIn()) {
          this.kalturaAppService.getInAppNotificationList(1, 50).then((res: any) => {
            if (res.objects) {
              if (res.objects.length > 0) {
                this.showNotificationBox = true;
                res.objects.forEach(element => {
                  if (element.status === 'Unread') {
                    this.showNotificationDot = true;
                  }
                });
              } else {
                // this.snackbarUtilService.showSnackbar('No new notifications');
              }
            }

          }, reject => {
            console.error(reject);
          })
        }
      }, 10000)
    }

  }

  toggleNotification() {

    if (this.platformIdentifierService.isBrowser()) {
      $('.notification-dropdownbell').toggle();
      if (this.appUtilService.isUserLoggedIn()) {
        this.kalturaAppService.getInAppNotificationList(1, 50).then((res: any) => {
          if (res.objects) {
            if (res.objects.length > 0) {
              this.notificationMessages = res.objects;
            } else {
              this.snackbarUtilService.showSnackbar('No new notifications')
            }
          } else {
            this.snackbarUtilService.showSnackbar('No new notifications')
          }
        }, reject => {
          console.error(reject);
        })
      }


    }
    this.gtmTagOnNotificationIcon();
  }

  deleteNotification(id: string, e: any) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    for (let i = 0; i < this.notificationMessages.length; i++) {
      if (this.notificationMessages[i].id === id) {
        this.notificationMessages.splice(i, 1);
        break;
      }
    }
    this.kalturaAppService.deleteNotification(id).then((res: any) => {
      this.snackbarUtilService.showSnackbar("Notification removed");
    }, reject => {
      console.error(reject)
    })
  }

  gtmTagOnNotificationIcon() {
    let dataLayerJson = {
      'button_location': 'All_Page',
      'button_id': 'Notifications_Click',
      'button_name': 'Notifications Click',
      'redirection_url': null,
      'button_image': null,
      'successful': 'Successful'
    }
    this.appUtilService.getGTMTag(dataLayerJson, 'notifications_click');
  }

}
