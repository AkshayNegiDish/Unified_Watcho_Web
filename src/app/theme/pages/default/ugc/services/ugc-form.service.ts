import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { UgcURLServiceService } from './ugc-urlservice.service';
import { Observable } from 'rxjs';
import { UGCConstants } from '../../../../shared/typings/common-constants';

@Injectable({
  providedIn: 'root'
})
export class UgcFormService {

  constructor(private httpClient: HttpClient, private ugcURLServiceService: UgcURLServiceService) { }


  getContestListing(listType: string, pageNo: number, pageSize: number) {
    let headers = new HttpHeaders();
    headers = headers.append('ugcapp-key', UGCConstants.API_APP_KEY);
    var params = new HttpParams().set("page", pageNo.toString()).set("limit", pageSize.toString()).set("state", listType.toString())
    var options = {
      headers: headers,
      params: params
    }
    return this.httpClient.get(this.ugcURLServiceService.getContestListURL(), options).pipe((res: Observable<HttpResponse<any>>) => {
      return res;
    }, (error) => {
      return error;
    });
  }

  getContestById(contestId: number) {
    let headers = new HttpHeaders();
    headers = headers.append('ugcapp-key', UGCConstants.API_APP_KEY);
    var params = new HttpParams().set("id", contestId.toString());
    var options = {
      headers: headers,
      params: params
    }
    return this.httpClient.get(this.ugcURLServiceService.getContestById(), options).pipe((res: Observable<HttpResponse<any>>) => {
      return res;
    }, (error) => {
      return error;
    });
  }

  getLeaderNoardByContestId(contestId: number, pageNo: number, limit: number) {
    let headers = new HttpHeaders();
    headers = headers.append('ugcapp-key', UGCConstants.API_APP_KEY);
    var params = new HttpParams().set("contestId", contestId.toString()).set("page", pageNo.toString()).set("limit", limit.toString());
    var options = {
      headers: headers,
      params: params
    }
    return this.httpClient.get(this.ugcURLServiceService.getLeaderNoardByContestId(), options).pipe((res: Observable<HttpResponse<any>>) => {
      return res;
    }, (error) => {
      return error;
    });
  }

  getUserLeaderBoardByContestId(contestId: number, ottSubscriberId: string) {
    let headers = new HttpHeaders();
    headers = headers.append('ugcapp-key', UGCConstants.API_APP_KEY);
    var params = new HttpParams().set("contestId", contestId.toString()).set("ottSubcriberId", ottSubscriberId);
    var options = {
      headers: headers,
      params: params
    }
    return this.httpClient.get(this.ugcURLServiceService.geUserLeaderboardByContestId(), options).pipe((res: Observable<HttpResponse<any>>) => {
      return res;
    }, (error) => {
      return error;
    });
  }

  getAlltimeLeaderBoard(leaderboard: string, pageNo: number, limit: number) {
    let headers = new HttpHeaders();
    headers = headers.append('ugcapp-key', UGCConstants.API_APP_KEY);
    var params = new HttpParams().set("leaderboard", leaderboard).set("page", pageNo.toString()).set("limit", limit.toString());
    var options = {
      headers: headers,
      params: params
    }
    return this.httpClient.get(this.ugcURLServiceService.getAlltimeLeaderboard(), options).pipe((res: Observable<HttpResponse<any>>) => {
      return res;
    }, (error) => {
      return error;
    });
  }

  getUserAlltimeLeaderBoard(leaderboard: string, ottsubscriberId : string) {
    let headers = new HttpHeaders();
    headers = headers.append('ugcapp-key', UGCConstants.API_APP_KEY);
    var params = new HttpParams().set("leaderboard", leaderboard).set("ottSubcriberId", ottsubscriberId);
    var options = {
      headers: headers,
      params: params
    }
    return this.httpClient.get(this.ugcURLServiceService.getUserAlltimeLeaderboard(), options).pipe((res: Observable<HttpResponse<any>>) => {
      return res;
    }, (error) => {
      return error;
    });
  }

  checkForVideoinCotest(contestId: string, ottSubcriberId: string) {
    let headers = new HttpHeaders();
    headers = headers.append('ugcapp-key', UGCConstants.API_APP_KEY);
    var params = new HttpParams().set("contestId", contestId).set("ottSubcriberId", ottSubcriberId)
    var options = {
      headers: headers,
      params: params
    }
    return this.httpClient.get(this.ugcURLServiceService.checkForVideoInContest(), options).pipe((res: Observable<HttpResponse<any>>) => {
      return res;
    }, (error) => {
      return error;
    });
  }
}
