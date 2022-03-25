import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-termsandconditions',
  templateUrl: './termsandconditions.component.html',
  styleUrls: ['./termsandconditions.component.scss']
})
export class TermsandconditionsComponent implements OnInit {
	content : string;
	loading : boolean;

  constructor( private quizService: QuizService) { }

  ngOnInit() {
  	this.loading = true;
  	this.quizService.getTermsAndConditions().subscribe((res: any) => {
  		this.content = res['data']['text'];
  		this.loading = false;
  	}, reject => {
        this.loading = false;
        this.content = '';
    })
  }

}
