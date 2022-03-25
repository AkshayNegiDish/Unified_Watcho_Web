import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../../../environments/environment';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { AppConstants } from '../../../../../shared/typings/common-constants';

declare var $: any;

@Component({
  selector: 'app-content-preference',
  templateUrl: './content-preference.component.html',
  styleUrls: ['./content-preference.component.scss']
})

export class ContentPreferenceComponent implements OnInit {

  loading: boolean;
  isBrowser: any;

  pageIndex: number;
  pageSize: number;

  genreList: any;

  selectedGenres: any[];

  maxSelection: number;
  genreSelected: number;
  oldGenreList: any[];
  oldGenreListId: any[];
  deletedGenreList: any[];
  updatedGenreList: any[];
  deleteUserInterest: any[];
  addUserInterest: any[];
  deletedUserInterest: any = {}
  updatedUserInterest: any = {};
  @Input() isSigninSignupModal: boolean = false;
  updateUserInterestString: string = '';
  deleteUserInterestString: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId, private kalturaAppService: KalturaAppService, private snackbarUtilService: SnackbarUtilService, private appUtilServie: AppUtilService,
    private modalService: NgbModal) {
    this.isBrowser = isPlatformBrowser(platformId)

    this.pageIndex = 1;
    this.pageSize = 20;

    this.loading = false;
    this.genreList = null;
    this.selectedGenres = [];
    this.oldGenreListId = [];
    this.deletedGenreList = [];
    this.updatedGenreList = [];
    this.deleteUserInterest = [];
    this.addUserInterest = [];

    this.maxSelection = 5;
    this.genreSelected = 0;
  }

  ngOnInit() {
    this.getContentPrefrenceList();
    this.gtmTagOnContentPrefrences();
  }

  getContentPrefrenceList() {
    this.loading = true;
    this.kalturaAppService.contentPreferencesList(this.pageSize, this.pageIndex).then(res => {
      this.loading = false;
      this.genreList = res;
      this.getUserInterest();
    }, reject => {
      this.loading = false;
      this.snackbarUtilService.showError(reject.message);
    });
  }

  getUserInterest() {
    this.loading = true;
    this.oldGenreList = [];
    this.appUtilServie.getUserInterestList().subscribe((res: any) => {
      this.loading = false;
      if (res.result.totalCount > 0) {
        this.oldGenreList = res.result.objects;
        this.setUserInterest(res.result.objects);
      }
    }, reject => {
      this.loading = false;
      this.snackbarUtilService.showError(reject.message);
    })
  }

  setUserInterest(userInterestArray: any[]) {
    this.oldGenreListId = [];
    for (let i = 0; i < userInterestArray.length; i++) {
      this.genreList.objects.forEach((element, index) => {
        if (userInterestArray[i].topic.value === element.name) {
          if (this.isBrowser) {
            this.selectGenre(element.id);
            this.oldGenreListId.push(element.id);
          }
        }
      });
    }
  }

  selectGenre(genreId) {
    if (this.isBrowser) {
      if ($("#" + genreId).parent().hasClass('active')) {
        this.genreSelected -= 1;
        this.popPreferences(genreId);
        $("#" + genreId).parent().removeClass('active')
      } else {
        if (this.genreSelected < this.maxSelection) {
          this.genreSelected += 1;
          this.pushPreferences(genreId);
          $("#" + genreId).parent().addClass('active')
        }
      }
    }
  }

  pushPreferences(id) {
    this.selectedGenres.push(id);

    if (this.deletedGenreList.length > 0) {
      for (let i = 0; i < this.deletedGenreList.length; i++) {
        if (this.deletedGenreList[i] === id) {
          if (this.deletedGenreList.length > 1) {
            this.deletedGenreList.splice(this.deletedGenreList.indexOf(id), 1);
          } else {
            this.deletedGenreList = [];
          }
        }
      }
    }
  }

  popPreferences(id) {
    if (this.selectedGenres.length > 0) {
      for (let i = 0; i < this.oldGenreListId.length; i++) {
        if (this.oldGenreListId[i] === id) {
          this.deletedGenreList.push(id);
        }
      }
    }

    if (this.selectedGenres.length > 1) {
      this.selectedGenres.splice(this.selectedGenres.indexOf(id), 1);
    } else {
      this.selectedGenres = [];
    }
  }

  getDeletedGenreList() {
    let ks = this.isBrowser ? localStorage.getItem(AppConstants.KS_KEY) : '';
    this.deleteUserInterestString = '{';
    for (let i = 0; i < this.deletedGenreList.length; i++) {
      for (let j = 0; j < this.genreList.objects.length; j++) {
        if (this.deletedGenreList[i] === this.genreList.objects[j].id) {
          this.oldGenreList.forEach(element => {
            if (element.topic.value === this.genreList.objects[j].name) {
              this.deleteUserInterestString += '"' + j + '":{ "service": "userinterest", "action": "delete", "id": "' + element.id + '", "ks": "' + ks + '"},';
            }
          });
        }
      }
    }
    if (this.deletedGenreList.length > 0) {
      this.deleteUserInterestString = this.deleteUserInterestString + '"apiVersion": "5.2.8.14099", "ks": "' + ks + '"}';
      this.deleteMultiRequest(this.deleteUserInterestString);
    } else {
      this.deleteUserInterestString = null;
      this.loading = false;
    }
  }

  deleteMultiRequest(userinterest) {
    if (userinterest) {
      this.loading = true;
      this.appUtilServie.multiRequestForAddAndDeleteGenres(userinterest).subscribe(res => {
        this.deletedGenreList = [];
        if (this.updatedGenreList.length === 0) {
          this.loading = false;
          this.snackbarUtilService.showSnackbar('Your preferences saved successfully.');
          this.updatePrefrencesMoEngage(this.selectedGenres[0], this.selectedGenres[1], this.selectedGenres[2]);
        }
      }, reject => {
        this.loading = false;
        this.snackbarUtilService.showError(reject.message);
      });
    }
  }

  getUpdatedGenreList() {
    this.updatedGenreList = [];
    let ks = this.isBrowser ? localStorage.getItem(AppConstants.KS_KEY) : '';
    this.updateUserInterestString = '{';
    for (let i = 0; i < this.selectedGenres.length; i++) {
      this.updatedGenreList[i] = this.selectedGenres[i];
    }
    for (let i = 0; i < this.updatedGenreList.length; i++) {
      this.oldGenreListId.forEach(element => {
        if (element === this.updatedGenreList[i]) {
          if (this.updatedGenreList.length > 1) {
            this.updatedGenreList.splice(this.updatedGenreList.indexOf(element), 1);
          } else {
            this.updatedGenreList = [];
          }
        }
      });
    }
    for (let i = 0; i < this.updatedGenreList.length; i++) {
      for (let j = 0; j < this.genreList.objects.length; j++) {
        if (this.updatedGenreList[i] === this.genreList.objects[j].id) {
          this.updateUserInterestString += '"' + j + '":{ "service": "userinterest", "action": "add", "userInterest": {"objectType": "KalturaUserInterest", "topic": {"objectType": "KalturaUserInterestTopic", "metaId": "' + environment.METAID_FOR_USERINTEREST_API + '", "value": "' + this.genreList.objects[j].name + '"}}, "ks": "' + ks + '"},';
        }
      }
    }
    if (this.updatedGenreList.length > 0) {
      this.updateUserInterestString = this.updateUserInterestString + '"apiVersion": "5.2.8.14099", "ks": "' + ks + '"}';
      this.updateMultiRequest(this.updateUserInterestString);
    } else if (this.deletedGenreList.length == 0 && this.updatedGenreList.length === 0) {
      this.loading = false;
      this.snackbarUtilService.showSnackbar('Your preferences saved successfully.');
      this.updatePrefrencesMoEngage(this.selectedGenres[0], this.selectedGenres[1], this.selectedGenres[2]);
    } else {
      this.updateUserInterestString = null;
      this.loading = false;
    }
  }

  updateMultiRequest(userInterest) {
    if (userInterest) {
      this.loading = true;
      this.appUtilServie.multiRequestForAddAndDeleteGenres(userInterest).subscribe(response => {
        this.loading = false;
        this.snackbarUtilService.showSnackbar('Your preferences saved successfully.');
        this.updatePrefrencesMoEngage(this.selectedGenres[0], this.selectedGenres[1], this.selectedGenres[2]);
      }, reject => {
        this.loading = false;
        this.snackbarUtilService.showError(reject.message);
        this.updatePrefrencesErrorMoEngage(this.selectedGenres[0], this.selectedGenres[1], this.selectedGenres[2]);
      });
    }
  }

  updatePrefrences() {
    this.getDeletedGenreList();
    this.getUpdatedGenreList();
    if (this.isSigninSignupModal) {
      setTimeout(() => {
        this.modalService.dismissAll();
      }, 3000);
    } else {
      this.modalService.dismissAll();
    }
  }

  ngOnDestroy(): void {
    this.selectedGenres = [];
    this.oldGenreList = [];
  }

  updatePrefrencesMoEngage(genreId_1: number, genreId_2: number, genreId_3: number) {
    let updatePrefrences = {
      genre_1: genreId_1,
      genre_2: genreId_2,
      genre_3: genreId_3,
      source: 'settings_page',
      status: 'preference_set_successful'
    }
    this.appUtilServie.moEngageEventTracking('content_preferences_set', updatePrefrences);
  }

  updatePrefrencesErrorMoEngage(genreId_1: number, genreId_2: number, genreId_3: number) {
    let updatePrefrences = {
      genre_1: genreId_1,
      genre_2: genreId_2,
      genre_3: genreId_3,
      source: 'settings_page',
      status: 'preference_set_error'
    }
    this.appUtilServie.moEngageEventTracking('content_preferences_set', updatePrefrences);
  }

  gtmTagOnContentPrefrences() {
    let datalayerJson = {
      'Button_ID': 'content_preferences',
      'Button_Name': 'Content Preferences',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'Button_Location': 'Account_&_Settings_Page'
    };
    this.appUtilServie.getGTMTag(datalayerJson, 'Content_Preferences');
  }
}
