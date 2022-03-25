import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VideoContentRequest } from '../../pages/default/ugc/models/ugc.upload.model';
import { DMS_ENV, UGCConstants } from '../typings/common-constants';
import { HeaderService } from '../utils/header.service';
import { SharedUrlService } from './shared-url.service';

@Injectable({
  providedIn: 'root',
})

export class AppFormService {


  constructor(private httpClient: HttpClient, private sharedUrlService: SharedUrlService, private headerService: HeaderService) { }

  uploadNewUGCVideo(videoContentRequest: VideoContentRequest): Observable<HttpResponse<any>> {
    let headers = new HttpHeaders();
    headers = headers.append('ugcapp-key', UGCConstants.API_APP_KEY);

    let options = {
      headers: headers,
      observe: 'response' as 'response'
    }

    return this.httpClient.post(this.sharedUrlService.ugcNewVideoUpload(), videoContentRequest, options).pipe((res: Observable<HttpResponse<any>>) => {
      return res;
    }, (error) => {
      return error;
    });
  }

  getDms(): Observable<HttpResponse<any>> {
    let headers = new HttpHeaders();
    headers = headers.append(DMS_ENV.DMS_API_KEY, DMS_ENV.DMS_API_VALUE);

    let options = {
      headers: headers,
      observe: 'response' as 'response'
    }

    return this.httpClient.get(this.sharedUrlService.dmsConfigUrl(), options).pipe((res: Observable<HttpResponse<any>>) => {
      return res;
    }, (error) => {
      return error;
    });
  }

  removeFromMyUploads(id: string, creatorId: string): Observable<HttpResponse<any>> {
    let params = new HttpParams().set('id', id).set("creatorId", creatorId);
    let options = {
      params: params
    }

    return this.httpClient.delete(this.sharedUrlService.removeFromMyUploads(), options).pipe((res: Observable<HttpResponse<any>>) => {
      return res;
    }, (error) => {
      return error;
    });
  }

  // get ifp meta - competition and theme data
  getIFPMeta() {
    return this.httpClient.get(this.sharedUrlService.getIFPMeta()).pipe((res: any) => {
      return res;
    },
      (error) => {
        return error;
      })
  }

  getMyUploadVideos(creatorId: any, page: any, limit: any, status: any[]) {
    let params = new HttpParams().set('id', creatorId).set("page", page).set("limit", limit).set("status", status.toString());
    let options = {
      params: params
    }

    return this.httpClient.get(this.sharedUrlService.getMyUgcVideos(), options).pipe((res: Observable<HttpResponse<any>>) => {
      return res;
    }, (error) => {
      return error;
    });
  }

}
