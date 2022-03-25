import { Injectable } from '@angular/core';
import { UGCConstants } from '../../../../shared/typings/common-constants';

@Injectable({
  providedIn: 'root'
})
export class UgcURLServiceService {

  constructor() { }

  getContestListURL() {
    return UGCConstants.API_BASE_URL +"api/v1/gamification/contest/listAll"
  }

  getContestById() {
    return UGCConstants.API_BASE_URL + "api/v1/gamification/contest/detail"
  }

  getLeaderNoardByContestId() {
    return UGCConstants.API_BASE_URL + "api/v1/gamification/leaderboard/contest";
  }

  geUserLeaderboardByContestId() {
    return UGCConstants.API_BASE_URL + "api/v1/gamification/leaderboard/rank/user";
  }

  getAlltimeLeaderboard() {
    return UGCConstants.API_BASE_URL + "api/v1/gamification/leaderboard/generic";
  }
  getUserAlltimeLeaderboard() {
    return UGCConstants.API_BASE_URL + "api/v1/gamification/leaderboard/rank/generic";
  }

  checkForVideoInContest() {
    return UGCConstants.API_BASE_URL + "api/v1/videos/isVideoPresent";
  }
}
