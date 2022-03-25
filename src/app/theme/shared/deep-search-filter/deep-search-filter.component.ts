import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID, Input } from '@angular/core';
import { KalturaAppService } from '../services/kaltura-app.service';
import { SnackbarUtilService } from '../services/snackbar-util.service';
import { AppUtilService } from '../services/app-util.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { QueryParamMap } from 'aws-sdk/clients/codepipeline';
import { PARAMETERS } from '@angular/core/src/util/decorators';
declare var $: any;

@Component({
  selector: 'app-deep-search-filter',
  templateUrl: './deep-search-filter.component.html',
  styleUrls: ['./deep-search-filter.component.scss']
})
export class DeepSearchFilterComponent implements OnInit {

  @Output()
  genres = new EventEmitter<string[]>()

  @Output()
  shortedBy = new EventEmitter<string>()

  @Output()
  submitted = new EventEmitter<boolean>()

  isBrowser: any;
  pageIndex: number;
  pageSize: number;
  genreList: any;
  selectedGenres: any[] = [];
  hidden: boolean = false;
  filterAction: string = 'Filter';
  filterIcon: string = 'filter_list';
  submittedGenres: any[] = [];
  shortingSelected: string = "";
  clearAllClicked: boolean;
  shortingActualValue: string;
  isPwa: boolean = false;
  filter: boolean = false;
  sortable: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId, private kalturaAppService: KalturaAppService, private snackbarUtilService: SnackbarUtilService,
    private appUtilService: AppUtilService, private router: ActivatedRoute) {
    this.isBrowser = isPlatformBrowser(platformId)

    this.pageIndex = 1;
    this.pageSize = 20;
  }

  ngOnInit() {
    this.router.queryParamMap.subscribe((param: ParamMap) => {
      if (param.has("filter")) {
        this.filter = JSON.parse(param.get("filter"));
      };
      if (param.has("sortable")) {
        this.sortable = JSON.parse(param.get("sortable"));
      }
    })
    this.getContentPrefrenceList();
    if (this.appUtilService.checkIfPWA()) {
      this.isPwa = true;
    } else {
      this.isPwa = false;
    }
  }

  getContentPrefrenceList() {
    this.kalturaAppService.contentPreferencesList(this.pageSize, this.pageIndex).then(res => {
      if (res.objects) {
        this.genreList = res;
      }
    }, reject => {
      this.snackbarUtilService.showError(reject.message);
    });
  }

  selectGenre(genreId: number, genreName: string) {
    if (this.isBrowser) {
      if ($("#" + genreName.replace(' ', '_')).parent().hasClass('active')) {
        this.popPreferences(genreName);
        $("#" + genreName.replace(' ', '_')).parent().removeClass('active')
      } else {
        this.pushPreferences(genreName);
        $("#" + genreName.replace(' ', '_')).parent().addClass('active')
      }
    }
  }

  pushPreferences(name: string) {
    this.selectedGenres.push(name);
  }

  popPreferences(name: string) {

    if (this.selectedGenres.length > 1) {
      this.selectedGenres.splice(this.selectedGenres.indexOf(name), 1);
    } else {
      this.selectedGenres = [];
    }
  }

  toggleFilterBox(action: string) {
    window.scroll(0, 0);
    this.clearAllClicked = false;
    $('.filter-full-cover').css("border-radius", "0");
    if (this.filterAction === 'Filter') {

      $('.filter-full-cover').css("border-radius", "10px 10px 10px 10px");

      this.submittedGenres.forEach(element => {
        $("#" + element.replace(' ', '_')).parent().addClass('active')
      })
      this.hidden = false;
      this.filterAction = 'Close';
      this.filterIcon = 'close';
    } else {
      this.selectedGenres.forEach(element => {
        $("#" + element.replace(' ', '_')).parent().removeClass('active')
      })
      this.filterAction = 'Filter';
      this.filterIcon = 'filter_list';
      this.hidden = true;
      this.selectedGenres = [];
      this.submittedGenres.forEach((element) => {
        this.selectedGenres.push(element)
      })

    }
    if (this.shortingActualValue === 'AtoZ') {
      $('.atoz').addClass('active')
      $('.ztoa').removeClass('active')
    } else if (this.shortingActualValue === 'ZtoA') {
      $('.ztoa').addClass('active')
      $('.atoz').removeClass('active')
    } else {
      $('.ztoa').removeClass('active')
      $('.atoz').removeClass('active')
    }

    $('.fullopen-filter').slideToggle();
  }

  clearAll() {
    this.clearAllClicked = true;
    this.selectedGenres.forEach(element => {
      $("#" + element.replace(' ', '_')).parent().removeClass('active')
    })
    this.selectedGenres = [];
    $('.ztoa').removeClass('active')
    $('.atoz').removeClass('active')
  }

  submit() {
    if (this.clearAllClicked) {
      this.shortingSelected = '';
    }
    this.clearAllClicked = false
    this.submittedGenres = [];
    this.shortedBy.emit(this.shortingSelected);
    this.shortingActualValue = this.shortingSelected;
    this.selectedGenres = this.selectedGenres.filter((el, i, a) => i === a.indexOf(el))
    this.selectedGenres.forEach((element) => {
      this.submittedGenres.push(element);
    })
    if (this.submittedGenres.length > 0) {
      this.genres.emit(this.submittedGenres);
    } else {
      this.hidden = false;
      this.genres.emit([]);
    }
    this.submitted.emit(true);
    this.toggleFilterBox('submit');

  }


  radioChanged(val: string) {
    this.clearAllClicked = false;
    if (val === 'AtoZ') {
      if ($('.atoz').hasClass('active')) {
        $('.atoz').removeClass('active')
        this.shortingSelected = '';
      } else {
        $('.atoz').addClass('active')
        this.shortingSelected = val;
      }
      $('.ztoa').removeClass('active')
    } else {
      if ($('.ztoa').hasClass('active')) {
        $('.ztoa').removeClass('active')
        this.shortingSelected = '';

      } else {
        $('.ztoa').addClass('active')
        this.shortingSelected = val;
      }

      $('.atoz').removeClass('active')

    }
  }

  removeGenre(genreName: string) {
    if (this.submittedGenres.length > 0) {
      if (this.submittedGenres.length === 1) {
        this.hidden = false;
      }
      $("#" + genreName.replace(' ', '_')).parent().removeClass('active')
      this.submittedGenres.splice(this.submittedGenres.indexOf(genreName), 1);
    } else {
      this.hidden = false;
      this.submittedGenres = []
    }
    if (this.selectedGenres.length > 0) {
      this.selectedGenres.splice(this.selectedGenres.indexOf(genreName), 1);
    } else {
      this.selectedGenres = []
    }
    this.genres.emit(this.submittedGenres);
    this.submitted.emit(true);
  }


}

