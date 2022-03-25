import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { AppUtilService } from '../../../../../shared/services/app-util.service';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  currentQuestion: any;
  campaign: any;
  selectedIndex: number;
  loading: boolean = false;
  daysLeft: number;
  hoursLeft: number;
  minsLeft: number;
  secsLeft: number;
  datestr: string;
  popup: {
    titleMessage: string;
    isImage: boolean;
    nextQuestion: string;
    subTitle: string;
    isCorrect: boolean;
  };
  // showPopup : boolean = false;
  // isCorrect : boolean;
  timer: any;
  timeUnit: string;

  constructor(private router: Router, private route: ActivatedRoute, private quizService: QuizService, private snackbarUtilService: SnackbarUtilService, private appUtilService: AppUtilService) {
    this.campaign = this.quizService.getCampaign();
    if (!this.campaign) {
      this.router.navigate([`/user/quiz/home`]);
    }
  }

  ngOnInit() {
    this.loading = true;
    forkJoin(
      this.quizService.getRunningQuestion(),
      //  this.quizService.getCurrentCampaign()
    ).subscribe((res: any) => {
      this.currentQuestion = res[0]['data'];

      //  this.campaign = res[1]['data'];
      if (this.currentQuestion) {
        this.caltimeLeft();
        this.timer = this.interval();
      } else {
        this.router.navigate([`/user/quiz/home`]);
      }
      this.loading = false;
    }, error => {
      this.loading = false;
    });

  }

  onSelect(index) {
    if (index == this.selectedIndex) {
      this.selectedIndex = null;
    } else {
      this.selectedIndex = index;
    }
  }

  onSubmit() {
    this.gtmTagOnSubmit();
    if (this.selectedIndex == null) {
      this.snackbarUtilService.showSnackbar('Please select one option !');
    } else {
      let reqObj = {
        "questionId": this.currentQuestion['_id'],
        "answerId": this.currentQuestion['options'][this.selectedIndex]['_id'],
        "campaignId": this.campaign['_id']
      };



      this.quizService.submitAnswer(reqObj).subscribe((response: any) => {

        if (response && response['status'] == 'success') {
          // this.isCorrect = response['data']['correct'];
          let campainId = this.campaign['_id'];
          this.quizService.getNextQuestion(campainId).subscribe((res: any) => {
            this.popup = {
              titleMessage: response['data']['correct'] ? 'Correct Answer' : 'Wrong Answer',
              isImage: true,
              subTitle: response['data']['correct'] ? 'Well Done' : 'Better Luck next Time',
              nextQuestion: res['data'].startTime ? res['data'].startTime : '',
              isCorrect: response['data']['correct']
            };
          }, reject => {
            this.popup = {
              titleMessage: response['data']['correct'] ? 'Correct Answer' : 'Wrong Answer',
              isImage: true,
              subTitle: response['data']['correct'] ? 'Well Done' : 'Better Luck next Time',
              nextQuestion: '',
              isCorrect: response['data']['correct']
            };
            this.snackbarUtilService.showSnackbar('Something went wrong!');
            this.loading = false;
          });
          // this.showPopup = true;
        } else {
          this.snackbarUtilService.showSnackbar(response['message']);
        }
        this.loading = false;
      }, reject => {
        this.snackbarUtilService.showSnackbar('Something went wrong!');
        this.loading = false;
      });
    }
  }


  interval() {
    return setInterval(() => {
      this.caltimeLeft();
    }, 1000);
  }

  caltimeLeft() {
    let endDate = new Date(this.currentQuestion['endTime']).getTime();
    let delta = Math.abs(endDate - (new Date().getTime())) / 1000;
    if (endDate - (new Date().getTime()) <= 0) {
      clearInterval(this.timer);
      this.datestr = '00:00';
      return false;
    }
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;
    this.daysLeft = days;
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    this.hoursLeft = hours;
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    this.minsLeft = minutes
    let seconds = delta % 60;
    //this.secsLeft = seconds;
    if (hours) {
      this.datestr = (hours.toString().length == 1 ? '0' + hours.toString() : hours.toString()) + ' : ' + (minutes.toString().length == 1 ? '0' + minutes.toString() : minutes.toString());
      this.timeUnit = "hour";
    } else {
      this.datestr = (minutes.toString().length == 1 ? '0' + minutes.toString() : minutes.toString()) + ' : ' + (seconds.toFixed().toString().length == 1 ? '0' + seconds.toFixed().toString() : seconds.toFixed().toString());
      this.timeUnit = "min";
    }
  }

  closePopup(text) {
    console.log("CampaignComponent -> closePopup -> text", text)
    if (text == 'close') {
      // this.popup = {
      //   titleMessage: '',
      //   isImage: false,
      //   nextQuestion: false,
      //   isCorrect: false
      // };
      this.router.navigate([`/user/quiz/home`]);
    }
  }

  ngOnDestroy() {
    clearInterval(this.timer); 
  }
  gtmTagOnSubmit() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'submit-wj',
      'Button_Name': 'Submit',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'Question_page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'submit-wj');
  }
}


