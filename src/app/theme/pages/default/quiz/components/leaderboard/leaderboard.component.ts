import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'quiz-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderBoardComponent implements OnInit {
  lastIndex: number = 0;
  leaderboard: any[] = [];
  totalCount: any;
  campaignList: any[] = [];
  totalAssetObjects: number = 0;
  pageSize: number;
  loading: boolean = false;
  selectedValue: string = "All Campaign";


  constructor(private router: Router, private quizService: QuizService) {
    this.campaignList.push({ 'name': 'All Campaign' }, { 'name': 'Past Month' }, { 'name': 'Past Week' });
  }

  ngOnInit() {
    this.loading = true;
    forkJoin(
      this.quizService.getLeaderboard(0),
      this.quizService.getPreviousCampaigns(),
    ).subscribe((res: any) => {
      this.leaderboard = res[0]['data'];
      this.totalCount = res[0]['data'].length;
      this.totalAssetObjects = res[0]['data'].length;
      this.campaignList = this.campaignList.concat(res[1]['data']);
      this.loading = false;
    }, error => {
      this.totalCount = 0;
      this.leaderboard = [];
      this.campaignList = [];
      this.loading = false;
    });

  }

  onSelect(i) {
    if (this.lastIndex !== i) {
      if (i > 2) {
        this.leaderboardByCampaign(this.campaignList[i]['_id']);
      } else {
        this.getLeaderboard(i);
      }
      this.lastIndex = i;
      this.selectedValue = this.campaignList[i]['name'];
    }
  }

  leaderboardByCampaign(id: string) {
    this.loading = true;
    this.quizService.getLeaderboardByCampign(id).subscribe((res: any) => {
      this.leaderboard = res['data'];
      this.totalCount = res['data'].length;
      this.totalAssetObjects = res['data'].length;
      this.loading = false;
    }, error => {
      this.leaderboard = [];
      this.totalCount = 0;
      this.loading = false;
    });
  }

  getLeaderboard(i) {
    this.loading = true;
    this.quizService.getLeaderboard(i).subscribe((res: any) => {
      this.leaderboard = res['data'];
      this.totalCount = res['data'].length;
      this.totalAssetObjects = res['data'].length;
      this.loading = false;
    }, error => {
      this.leaderboard = [];
      this.totalCount = 0;
      this.loading = false;
    });
  }
}
