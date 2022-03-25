import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizService } from '../../services/quiz.service';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { SignInSignUpModalComponent } from '../../../../../shared/entry-component/signIn-signUp-modal.component';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isUserLogin: boolean;
  assets: any;
  loading: boolean;
  buttonDisabled: boolean = true;
  hideCheckbox: boolean;

  constructor(private router: Router, private quizService: QuizService, private modalService: NgbModal,
    private appUtilService: AppUtilService) { }

  ngOnInit() {
    this.loading = true;
    this.isUserLogin = this.appUtilService.isUserLoggedIn();
    console.log('boolean', this.isUserLogin);
    if (!this.isUserLogin) {
      this.showLoginPopup();
    }
    this.quizService.getAssets().subscribe((res: any) => {
      this.assets = res['data'];
      this.loading = false;
    });
    if (this.quizService.getCheckboxStatus()) {
      this.hideCheckbox = true;
      this.buttonDisabled = false;
    }
  }

  onCheckbox(event) {
    this.quizService.setCheckboxStatus(event.target.checked);
    this.buttonDisabled = !event.target.checked;
  }

  play() {
    if (!this.isUserLogin) {
      this.showLoginPopupAfterPlay();
    }
    if (this.isUserLogin) {
      this.gtmTagOnPlayNow();
      this.router.navigate([`/user/quiz/home`]);
    }

  }

  gtmTagOnPlayNow() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'play-now-wj',
      'Button_Name': 'Play Now',
      'Redirection_URL': `/user/quiz/home`,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'Quiz_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'play-now-wj');
  }
  showLoginPopup() {
    const modalRef = this.modalService.open(SignInSignUpModalComponent);
    modalRef.result.then((data) => {
      this.appUtilService.playPlayer();
    }, (reason) => {
      this.appUtilService.playPlayer();
    });
  }

  showLoginPopupAfterPlay() {
    const modalRef = this.modalService.open(SignInSignUpModalComponent);
    modalRef.result.then((data) => {
      this.appUtilService.playPlayer();      
      this.gtmTagOnPlayNow();
      this.router.navigate([`/user/quiz/home`]);

    }, (reason) => {
      this.appUtilService.playPlayer();      
      this.gtmTagOnPlayNow();
      this.router.navigate([`/user/quiz/home`]);
    });
  }
}
