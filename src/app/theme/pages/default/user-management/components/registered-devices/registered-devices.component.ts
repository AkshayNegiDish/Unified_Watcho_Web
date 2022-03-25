import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';

@Component({
  selector: 'app-registered-devices',
  templateUrl: './registered-devices.component.html',
  styleUrls: ['./registered-devices.component.scss']
})
export class RegisteredDevicesComponent implements OnInit, OnDestroy {
  isBrowser: any

  loading: boolean
  closeButton: boolean;
  deviceList: any;
  devicesLimit: number;
  isDeviceLimitExceeded = false;

  constructor(@Inject(PLATFORM_ID) private platformId, public activeModal: NgbActiveModal,
    private kalturaAppService: KalturaAppService, private snackbarUtilService: SnackbarUtilService, private appUtilService: AppUtilService,
    private activateRoute: ActivatedRoute) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loading = false;
      this.closeButton = false;
    }
  }

  ngOnInit() {
    // if (this.showCloseButton) {
    //   this.closeButton = true;
    // }
    if (this.isBrowser) {
      this.clickYourDevicesPageMoEngage();
      this.getHouseHold();
      this.getHouseholdDeviceList();
      if (this.activateRoute.data["value"]["deviceLimitExceeded"]) {
        this.isDeviceLimitExceeded = true;
        this.snackbarUtilService.showError('You are logged in on too many devices. Please logout from atleast one device to continue.');
      }
      this.gtmTagOnYourDevices();
    }
  }

  getHouseHold() {
    this.loading = true;
    this.kalturaAppService.getHousehold().then(res => {
      this.loading = false;
      this.devicesLimit = res.devicesLimit;
      this.getHouseholdDeviceList();
    }, reject => {
      this.loading = false;
      this.snackbarUtilService.showError(reject.message);
    });
  }

  getHouseholdDeviceList() {
    this.loading = true
    this.kalturaAppService.getHouseholdList().then(res => {
      this.loading = false
      this.deviceList = res;
      let totalCount = res.totalCount;
    }, reject => {
      this.loading = false
      this.snackbarUtilService.showError(reject.message);
    })
  }

  deleteDevice(udid) {
    if (udid) {
      this.loading = true
      this.kalturaAppService.deleteHousehold(udid).then(res => {
        this.loading = false
        this.snackbarUtilService.showSnackbar('Selected device deleted')
        this.removeDeviceMoEngageTag();
        if (this.isDeviceLimitExceeded) {
          this.addNewDevice();
        }
        this.getHouseholdDeviceList()
      }, reject => {
        this.loading = false;
        this.getHouseholdDeviceList()
        this.snackbarUtilService.showError(reject.message);
        this.removeDeviceMoEngageTagError();
      })
    }
  }

  addNewDevice() {
    this.loading = true;
    let udid
    udid = this.appUtilService.getDeviceId();
    if (udid) {
      this.kalturaAppService.getHouseholdList().then(deviceList => {
        if (!this.checkDeviceAlreadyAdded(deviceList)) {
          this.kalturaAppService.addHouseholdDevice(this.appUtilService.getBrowserDetails()).then(res => {
            this.loading = false;
            this.snackbarUtilService.showSnackbar('Current device added');
            this.isDeviceLimitExceeded = false;
            // this.isDeviceRemovedOnLogin = true;
            if (this.isBrowser) {
              sessionStorage.removeItem('isDeviceRemovedOnLogin');
            }
            this.activeModal.close();
          }, reject => {
            this.loading = false;
            this.snackbarUtilService.showError(reject.message);
          });
        }
      }, reject => {
        this.snackbarUtilService.showError(reject.message);
      });

    }

  }

  showDeleteIcon(udid, brandId?): boolean {
    let isMyDevice: boolean = false;
    if (brandId === 14 || brandId === 105) {
      isMyDevice = true;
    }
    // if (this.isModalShownOnLogin) {
    //   return false;
    // }

    let deviceUdid: any;
    if (this.isBrowser) {
      deviceUdid = this.appUtilService.getDeviceId();
    }
    if (deviceUdid) {
      if (deviceUdid === udid) {
        isMyDevice = true;
      }
    }
    return isMyDevice;
  }

  checkDeviceAlreadyAdded(res): boolean {
    let isDeviceAdded = false
    if (this.isBrowser) {
      let udid = this.appUtilService.getDeviceId();
      if (res.objects) {
        res.objects.forEach((element, index) => {
          if (element.udid === udid) {
            isDeviceAdded = true
          }
        })
      }
      return isDeviceAdded
    }
  }

  ngOnDestroy() {
  }

  clickYourDevicesPageMoEngage() {
    this.appUtilService.moEngageEventTrackingWithNoAttribute("VISIT_DEVICE_MANAGEMENT_PAGE");
  }

  removeDeviceMoEngageTag() {
    let attribute = {
      source: 'device_management_settings',
      status: 'device_remove_successful'
    };
    this.appUtilService.moEngageEventTracking("DEVICE_REMOVED", attribute);
  }
  removeDeviceMoEngageTagError() {
    let attribute = {
      source: 'device_management_settings',
      status: 'device_remove_error'
    };
    this.appUtilService.moEngageEventTracking("DEVICE_REMOVED", attribute);
  }

  gtmTagOnYourDevices() {
    let dataLayerJson = {
        'button_id': 'your_devices',
        'button_name': 'Your Devices',
        'redirection_url': null,
        'button_image': null,
        'successful': 'Successful',
        'button_location': 'Account_&_Settings_Page'
            };
            this.appUtilService.getGTMTag(dataLayerJson, 'your_devices');
  }

}
