import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppUtilService } from '../../../../../shared/services/app-util.service';

declare var $: any;

@Component({
  selector: 'quiz-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @Input() popupDetail: {
    titleMessage: string;
    isImage: boolean;
    subTitle: string,
    nextQuestion: string;
    isCorrect: boolean;
    isTime: boolean;
  };
  @Output() popupEvent = new EventEmitter<string>();
  constructor(private appUtilService: AppUtilService) { }
  ngOnInit() {
    console.log("PopupComponent -> ngOnInit -> this.popupDetail dfsf", this.popupDetail)
    if (this.popupDetail && this.popupDetail.nextQuestion) {
      this.popupDetail.isTime = this.checkDate(this.popupDetail.nextQuestion);
    }

  }
  checkDate(someDate) {
    someDate = new Date(someDate);
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }


  onOkPress() {
    console.log("PopupComponent -> onOkPress -> onOkPress")
    this.popupEvent.emit('close');
    this.gtmTagOnOk();
  }
  gtmTagOnOk() {
    let getTimeStamp = this.appUtilService.getGTMUserID();
    let dataLayerJson = {
      'Button_ID': 'ok-success-wj',
      'Button_Name': 'Ok',
      'Redirection_URL': null,
      'Button_Image': null,
      'Successful': 'Successful',
      'userID': getTimeStamp,
      'Button_Location': 'popup'
    };
    this.appUtilService.getGTMTag(dataLayerJson, 'ok-success-wj');
  }
}
