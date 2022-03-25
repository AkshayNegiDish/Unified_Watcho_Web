import { Injectable } from '@angular/core';
import { UGCConstants, DMS_ENV } from '../typings/common-constants';



@Injectable({
  providedIn: 'root',
})
export class SharedUrlService {
  constructor() { }

  ugcNewVideoUpload(): string {
    return `${UGCConstants.API_BASE_URL}api/v1/videos`;
  }

  dmsConfigUrl(): string {
    return `${DMS_ENV.DMS_CONFIG_URL}`;
  }

  // delete from myuploaded video
  removeFromMyUploads(): string {
    return `${UGCConstants.API_BASE_URL}api/v1/videos/delete`;
  }

  // Fetch ifp meta
  getIFPMeta(): string {
    return `${UGCConstants.API_BASE_URL}api/v1/fetchIFPMeta`;
  }

  getMyUgcVideos(): string {
    return `${UGCConstants.API_BASE_URL}api/v1/user/videos`;
  }

}