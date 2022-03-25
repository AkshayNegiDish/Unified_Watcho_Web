import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
declare var $: any;

@Component({
  selector: 'quiz-quizdetailtab',
  templateUrl: './quizdetailtab.component.html',
  styleUrls: ['./quizdetailtab.component.scss']
})
export class QuizDetailTabComponent implements OnInit {
  tabType: string = 'campaign';
  loading: boolean = false;

  constructor(private router: Router, private quizService: QuizService, private appUtilService: AppUtilService) { }

  ngOnInit() {
    // if(!this.quizService.getCheckboxStatus()) {
    //   this.router.navigate([`/user/quiz/`]);
    // }
  }

  onTabChange($event) {
    $('.cntnt-text').removeClass('active');
    $event.target.classList.add('active');
    this.tabType = $event.target.getAttribute('value');
    if (this.tabType === 'campaign') {
      this.gtmTagOnContest();
    } else if (this.tabType === 'leaderboard') {
      this.gtmTagOnLeaderBoard();
    } else {
      this.gtmTagOnMyContest();
    }
  }
  gtmTagOnContest() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'contest-view-wj',
      'Button_Name': 'Contest',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'Home_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'contest-view-wj');
  }
  gtmTagOnLeaderBoard() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'leaderboard-view-wj',
      'Button_Name': 'Leaderboard',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'Home_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'leaderboard-view-wj');
  }
  gtmTagOnMyContest() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'my-contests-view-wj',
      'Button_Name': 'My Contests',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'Home_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'my-contests-view-wj');
  }
}
