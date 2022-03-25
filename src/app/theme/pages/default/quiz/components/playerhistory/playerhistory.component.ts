import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'quiz-playerhistory',
  templateUrl: './playerhistory.component.html',
  styleUrls: ['./playerhistory.component.scss']
})
export class PlayerHistoryComponent implements OnInit {
  lastIndex: number = 0;
  userQuiz: any[] = [];
  totalCount: any;
  totalAssetObjects: number = 0;
  pageSize: number;
  pageIndex: number;
  loading: boolean = false;
  questionsAttempted: number;
  questionsCorrected: number;
  reward: string;
  campaignList: any[] = [];
  selectedValue: string = "All Campaign";

  constructor(private router: Router, private quizService: QuizService) {
    // this.pageIndex = 1;
    // this.pageSize = 5;
  }

  ngOnInit() {
    this.fetchDetails();
  }

  onSelect(i) {
    if (this.lastIndex !== i) {
      if (i > 0) {
        this.fetchDetailsByCampaign(this.campaignList[i]['_id']);
      } else {
        this.fetchDetails();
      }
      this.lastIndex = i;
      this.selectedValue = this.campaignList[i]['name'];
    }
  }

  getOption(i: number) {
    let optIndex;
    let correct;

    let ques = this.userQuiz[i];
    for (var i = 0; i < ques['options'].length; i++) {
      if (ques['answerId'] === ques['options'][i]['_id']) {
        correct = ques['options'][i]['correct'];
        optIndex = i;
      }
    }

    let obj = {
      isCorrect: correct
    }

    switch (optIndex) {
      case 0:
        obj['option'] = 'A'
        break;
      case 1:
        obj['option'] = 'B'
        break;
      case 2:
        obj['option'] = 'C'
        break;
      case 3:
        obj['option'] = 'D'
        break;
      default:
        obj['option'] = ''
    }
    return obj;
  }

  fetchDetailsByCampaign(campaignId: string) {
    this.loading = true;
    forkJoin(
      this.quizService.getQuizDetailsByCampaign(campaignId),
      this.quizService.getQuestionCountByCampaign(campaignId),
      this.quizService.getPrizeDetailsByCampaign(campaignId)
    ).subscribe((res: any) => {
      this.userQuiz = res[0]['data'];
      this.totalCount = res[0]['data'].length;
      this.totalAssetObjects = res[0]['data'].length;
      this.questionsAttempted = res[1]['data']['attempted'];
      this.questionsCorrected = res[1]['data']['correct'];
      this.reward = res[2]['data']['reward'];
      this.loading = false;
    }, error => {
      this.loading = false;
      this.userQuiz = [];
      this.totalCount = 0;
      this.campaignList = [];
    });
  }

  fetchDetails() {
    this.loading = true;
    forkJoin(
      this.quizService.getQuizDetails(),
      this.quizService.getQuestionCount(),
      this.quizService.getPrizeDetails(),
      this.quizService.getCampaignTilldate()
    ).subscribe((res: any) => {
      this.userQuiz = res[0]['data'];
      this.totalCount = res[0]['data'].length;
      this.totalAssetObjects = res[0]['data'].length;
      this.questionsAttempted = res[1]['data']['attempted'];
      this.questionsCorrected = res[1]['data']['correct'];
      this.reward = res[2]['data']['reward']
      this.campaignList = [{ 'name': 'All Campaign' }];
      this.campaignList = this.campaignList.concat(res[3]['data']);
      this.loading = false;
    }, error => {
      this.loading = false;
      this.userQuiz = [];
      this.totalCount = 0;
      this.campaignList = [];
    });
  }

}
