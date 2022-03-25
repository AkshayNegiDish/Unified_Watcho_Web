import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
//import { PopUp } from '../popup/popupModel';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
import { AppUtilService } from '../../../../../shared/services/app-util.service';


declare var $: any;

@Component({
  selector: 'quiz-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {
  currentCampaign: any[] = [];
  upcomingCampaign: any[] = [];
  totalCount: any;
  // totalAssetObjects: number = 0;
  pageSize: number;
  pageIndex: number;
  loading: boolean = false;
  popup: {
    titleMessage: string;
    isImage: boolean;
    subTitle: string,
    nextQuestion: string;
    isCorrect: boolean;
  };

  constructor(private router: Router, private quizService: QuizService, private snackbarUtilService: SnackbarUtilService, private appUtilService: AppUtilService) {
    this.pageIndex = 1;
    this.pageSize = 5;
  }

  ngOnInit() {
    this.loading = true;
    forkJoin(
      this.quizService.getCurrentCampaign(),
      this.quizService.getUpcomingCampaign(this.pageIndex, this.pageSize)
    ).subscribe((res: any) => {
      this.currentCampaign = res[0]['data'];
      this.upcomingCampaign = res[1]['data'];
      this.totalCount = this.currentCampaign.length + this.upcomingCampaign.length;

      // this.totalAssetObjects = res[1]['data'].length;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  onClickStart(item) {
    this.loading = true;
    this.gtmTagOnStartQuiz();
    this.quizService.getRunningQuestion().subscribe((response: any) => {
      if (response && response['message'] == "") {
        this.quizService.setCampaign(item);
        this.router.navigate([`/user/quiz/question`]);
      } else {
        let campaignId = item['_id'];
        this.quizService.getNextQuestion(campaignId).subscribe((res: any) => {
          this.popup = {
            titleMessage: response['message'],
            isImage: true,
            subTitle: '',
            nextQuestion: res['data'].startTime ? res['data'].startTime : '',
            isCorrect: true
          };
        }, reject => {
          this.popup = {
            titleMessage: response['message'],
            isImage: true,
            subTitle: '',
            nextQuestion: '',
            isCorrect: true
          };
          this.snackbarUtilService.showSnackbar('Something went wrong!');
          this.loading = false;
        });
        // alert(response['message']);
      }
      this.loading = false;
    }, reject => {
      this.loading = false;
      this.snackbarUtilService.showSnackbar('Something went wrong!');

    });

  }
  closePopup(text) {
    console.log("CampaignComponent -> closePopup -> text", text)
    if (text == 'close') {
      this.popup = {
        titleMessage: '',
        isImage: false,
        subTitle: '',
        nextQuestion: '',
        isCorrect: false
      };
    }

  }

  onScroll() {
    // if (this.totalAssetObjects > 0) {
    //   this.pageIndex += 1;
    //   this.getMore(this.pageIndex);
    // }
  }

  getMore(pageIndex: number) {
    // if (this.tabIndex == 0) {
    //   this.quizService.getUpcomingCampaign(pageIndex, this.pageSize).subscribe((response: any) => {
    //     this.upcomingCampaign = this.upcomingCampaign.concat(response['data']);
    //     this.totalAssetObjects = response['data'].length;
    //   }, reject => {
    //     this.upcomingCampaign = []
    //   });
    // }
  }
  gtmTagOnStartQuiz() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'start-quiz-wj',
      'Button_Name': 'Start Quiz',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'Campaign_Page'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'start-quiz-wj');
  }
}
