import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class QuizService {
    ApiUrl: string;
    clientId: string;
    secretToken: string;
    campaignId: string;

    constructor(private httpClient: HttpClient) {
        this.ApiUrl = environment.WATCHO_QUIZ; 
        this.clientId = 'watcho-quiz';
        this.secretToken = 'wFm$KJQS)Mey@44<@8r:*~bX';
    }

    setCampaign(campaign) {
        this.campaignId = campaign;
    }

    getCampaign() {
        return this.campaignId;
    }

    setCheckboxStatus(status) {
        localStorage.setItem("isChecked", status);
    }

    getCheckboxStatus() {
        return localStorage.getItem("isChecked");
    }


    validateUser() {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken);
        headers = headers.append('Content-Type', 'application/json');
        let user = this.getUserDeatil();
        let body = {
            "name": user['Name'],
            "email": user['EmailID'],
            "mobileNo": user['MobileNo'],
            "userType": user['UserType'],
            "OTTSubscriberID": user['OTTSubscriberID']
        };
        return this.httpClient.post(this.ApiUrl + "api/v1/quiz/user", body, { headers })
            .pipe(map(res => {
                this.setQuizToken(res);
            }));
    }

    getAssets() : Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/assets/web`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
        });
    }

    getCurrentCampaign(): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/campaign/running`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getUpcomingCampaign(pageIndex: number, pageSize: number): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/campaign/upcoming?page=${pageIndex}&limit=${pageSize}`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getRunningQuestion(): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/question/running/${this.getOTTSubscriberID()}`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getNextQuestion(campaignId: string): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/question/${campaignId}/upcomming/time`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getLeaderboard(i:number): Observable<HttpResponse<any>> {
        let url = i === 1 ? '/month?page=all' : i ===  2 ? '/week?page=all' : '?page=all' ;
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/leaderboard${url}`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getPreviousCampaigns(): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/campaign/past?page=all`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getCampaignTilldate() : Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/campaign/tilldate?page=all`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
        });
    }

    getLeaderboardByCampign(campaignId: string): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/leaderboard/${campaignId}?page=all`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getQuizDetails(): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/user/quizdetail/${this.getOTTSubscriberID()}?page=all`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getQuizDetailsByCampaign(campaignId: string): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/user/quizdetail/${this.getOTTSubscriberID()}/${campaignId}?page=all`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getQuestionCount(): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/user/questions/count/${this.getOTTSubscriberID()}`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getQuestionCountByCampaign(campaignId: string): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/user/questions/count/${this.getOTTSubscriberID()}/${campaignId}`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getPrizeDetails(): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/user/prize/${this.getOTTSubscriberID()}`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getPrizeDetailsByCampaign(campaignId: string): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/user/prize/${this.getOTTSubscriberID()}/${campaignId}`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    submitAnswer(reqObj: object): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json');
        reqObj['OTTSubscriberID'] = this.getOTTSubscriberID();
        let body = reqObj;
        return this.httpClient.post(this.ApiUrl + `api/v1/quiz/answer`, body, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getTermsAndConditions() {
        let headers = new HttpHeaders().set('client_id', this.clientId).set('secret_token', this.secretToken).set('Authorization', `Bearer ${this.getQuizToken()}`);
        headers = headers.append('Content-Type', 'application/json')
        return this.httpClient.get(this.ApiUrl + `api/v1/quiz/termcondition`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
        });
    }

    getQuizToken(): Observable<HttpResponse<any>> {
        return JSON.parse(localStorage.getItem("quiz_token")).token;
    }

    setQuizToken(res: object) {
        let obj = {
            token: res['data']['token'],
            createdAt: new Date()
        }
        localStorage.setItem("quiz_token", JSON.stringify(obj));
    }

    getUserCategory() {
        return localStorage.getItem("user-category");
    }

    getOTTSubscriberID() {
       return JSON.parse(localStorage.getItem("user-sms")).OTTSubscriberID;
    }

    getUserDeatil() {
        return JSON.parse(localStorage.getItem("user-sms"));
    }
}

