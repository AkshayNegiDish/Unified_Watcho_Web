import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { AppUtilService } from './shared/services/app-util.service';
import { LoginMessageService } from './shared/services/auth';
import { tap } from 'rxjs/operators/tap';
import { startWith, delay } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: '.fullcontainer  .main-container',
  templateUrl: './theme.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent implements OnInit {
  isBrowser;
  isMobileTabletView: boolean = false;
  isMobileView: boolean = false;
  ugcPageVisited: boolean = false;
  isShowFullRegisterGrievancePage: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId, public appUtilService: AppUtilService, private ugcOpenMessageService: LoginMessageService) {
    this.isBrowser = isPlatformBrowser(platformId);

  }

  ngOnInit() {
    this.ugcPageVisited = false;
    if (this.isBrowser) {
      if(location.pathname.split("/").length >= 2) {
        if(location.pathname.split("/")[1] === "mobile") {
          this.isShowFullRegisterGrievancePage = true;
        } else {
          this.isShowFullRegisterGrievancePage = false;
        }
      }
      if (matchMedia('(max-width: 992px)').matches) {
        this.isMobileView = false;
        if (matchMedia('(max-width: 768px)').matches) {
          this.isMobileView = true;
        }
        this.isMobileTabletView = true;
      } else {
        this.isMobileTabletView = false;
      }
      // detect mobile and render mobile side bar
      $(window).bind("orientationchange", () => {

        // switch(window.orientation) {  
        //   case -90 || 90 || 0:
        //     alert('landscape');
        //     this.isMobileTabletView = true;
        //     break;
        //   default:
        //     alert('portrait');
        //     this.isMobileTabletView = false;
        //     break; 
        // }
        if (!this.isMobileView) {
          setTimeout(() => {
            if (matchMedia('(max-width: 768px)').matches) {
              this.isMobileView = true;
              this.isMobileTabletView = true;
            } else {
              this.isMobileTabletView = !this.isMobileTabletView;
            }
          }, 400)
        }
      });
      // detect mobile and render mobile side bar


    }
  }

  ngAfterViewInit(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.ugcOpenMessageService.messageChanged$.pipe(startWith(null),
      delay(0), tap((ugcPageVisited) => {
        try {
          if (ugcPageVisited) {
            this.ugcPageVisited = true;
          } else {
            this.ugcPageVisited = false;
          }
        } catch (e) {
          this.ugcPageVisited = false;
        }
      })).subscribe()
  }
}
