import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class MyDishTvSpaceService {
    ottApiUrl: string;
    isBrowser: any;

    constructor(@Inject(PLATFORM_ID) private platformId, private httpClient: HttpClient) {
        this.ottApiUrl = 'https://ottmobileapis.dishtv.in/Api/'; //'https://ottmobileapisstaging.dishtv.in/Api/';
        this.isBrowser = isPlatformBrowser(platformId);

    }

    getDishTvSpaceToken() {
        let epgApiUrl = `https://epg.mysmartstick.com/${this.getUserPlatform()}/api/v1/epg/`;
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        let body = {
            clientid: "watcho-web-app",
            password: "K^o!62Jr1*feEKW6"
        };
        return this.httpClient.post(epgApiUrl + "client/auth/signin", body, { headers })
            .pipe(map(res => {
                this.setEpgToken(res);
                return res;
            }));
    }


    getChannelsList(token: string): Observable<HttpResponse<any>> {
        let epgApiUrl = `https://epg.mysmartstick.com/${this.getUserPlatform()}/api/v1/epg/`;
        let headers = new HttpHeaders().set('Authorization', token);
        headers = headers.append('Content-Type', 'application/json');
        let body = {};
        body['sortby'] = 'lcn';
        return this.httpClient.post(epgApiUrl + "entities/channels", body, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getGenresList(token: string): Observable<HttpResponse<any>> {
        let epgApiUrl = `https://epg.mysmartstick.com/${this.getUserPlatform()}/api/v1/epg/`;
        let headers = new HttpHeaders().set('Authorization', token);
        headers = headers.append('Content-Type', 'application/json');
        let body = {};
        return this.httpClient.post(epgApiUrl + "entities/categories", body, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getProgrameList(token: string, pageSize: number, pageIndex: number, reqObj: object): Observable<HttpResponse<any>> {
        let epgApiUrl = `https://epg.mysmartstick.com/${this.getUserPlatform()}/api/v1/epg/`;
        let headers = new HttpHeaders().set('Authorization', token);
        headers = headers.append('Content-Type', 'application/json');
        let body = reqObj;
        return this.httpClient.post(epgApiUrl + "entities/channelswithprograms?page=" + pageIndex + "&limit=" + pageSize, body, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getUserAccountDetails(token: string, OTTSubscriberID: string): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('Authorization', token);
        headers = headers.append('Content-Type', 'application/json');
        return this.httpClient.get(`${this.ottApiUrl}Recharge/GetSubscriberDetails/${OTTSubscriberID}`, { headers: headers }).pipe((res: Observable<HttpResponse<any>>) => {
            return res;
        });
    }

    refreshAccount(token: string, Dishd2hSubscriptionID: number): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('Authorization', token);
        headers = headers.append('Content-Type', 'application/json');
        return this.httpClient.get(`${this.ottApiUrl}UserManageAccount/RefreshAccount/${Dishd2hSubscriptionID}/${this.getUserCategory()}`, { headers: headers }).pipe((res: Observable<HttpResponse<any>>) => {
            return res;
        });
    }

    updateEmailId(token: string, reqObj: object): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('Authorization', token);
        headers = headers.append('Content-Type', 'application/json');
        let body = reqObj;
        return this.httpClient.post(`${this.ottApiUrl}UserManageAccount/UpdateEmailId`, body, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    updateMobileNumber(token: string, reqObj: object): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('Authorization', token);
        headers = headers.append('Content-Type', 'application/json');
        let body = reqObj;
        return this.httpClient.post(`${this.ottApiUrl}UserManageAccount/UpdateMobileNumber`, body, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getComplaintTypeList(token: string, Dishd2hSubscriberID: string): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('Authorization', token);
        headers = headers.append('Content-Type', 'application/json');
        return this.httpClient.get(`${this.ottApiUrl}UserManageAccount/GetComplaintTypeList/${Dishd2hSubscriberID}/${this.getUserCategory()}`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    submitComplaint(token: string, reqObj: object): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('Authorization', token);
        headers = headers.append('Content-Type', 'application/json');
        let body = reqObj;
        return this.httpClient.post(`${this.ottApiUrl}UserManageAccount/SubmitFeedback`, body, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getpackageDetails(token: string, Dishd2hSubscriberID: string): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('Authorization', token);
        headers = headers.append('Content-Type', 'application/json');
        return this.httpClient.get(`${this.ottApiUrl}UserManageAccount/GetPackageDetails/${Dishd2hSubscriberID}/${this.getUserCategory()}`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getencryptedUrl(token: string, Dishd2hSubscriberID: string): Observable<HttpResponse<any>> {
        let headers = new HttpHeaders().set('Authorization', token);
        headers = headers.append('Content-Type', 'application/json');
        return this.httpClient.get(`${this.ottApiUrl}UserManageAccount/EncryptedUrl/${Dishd2hSubscriberID}`, { headers })
            .pipe((res: Observable<HttpResponse<any>>) => {
                return res
            });
    }

    getEpgToken() {
        if (this.isBrowser) {
            return JSON.parse(localStorage.getItem("mydishtv_token")).token;
        }
    }

    setEpgToken(res: object) {
        let obj = {
            token: res['token'],
            createdAt: new Date()
        }
        if (this.isBrowser) {
            localStorage.setItem("mydishtv_token", JSON.stringify(obj));
        }
    }

    getUserCategory() {
        if (this.isBrowser) {
            return localStorage.getItem("user-category");
        }
    }

    getOTTSubscriberID() {
        if (this.isBrowser) {
            return JSON.parse(localStorage.getItem("user-sms")).OTTSubscriberID;
        }
    }

    setProgramDetail(programs: any) {
        if (this.isBrowser) {
            localStorage.setItem("programs", JSON.stringify(programs));
        }
    }

    getProgramDetail() {
        if (this.isBrowser) {
            return JSON.parse(localStorage.getItem("programs"));
        }
    }

    getOttApiToken() {
        if (this.isBrowser) {
            return localStorage.getItem("Authorization");
        }
    }

    getUserPlatform() {
        if (this.isBrowser) {
            return localStorage.getItem("user-category") == '1' ? 'dishtv' : 'd2h';
        }
    }
}