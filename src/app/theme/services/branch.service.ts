import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Injector, NgZone, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import { AppConstants, Branch } from '../shared/typings/common-constants';

declare var branch: any;

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  isBrowser: any;
  Initdata: any;
  data: any;
  initDataFlag: boolean = false;
  DMS: any;


  constructor(@Inject(PLATFORM_ID) private platformId, private injector: Injector, private ngZone: NgZone) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.ngZone.run(() => {
        branch.init(Branch.KEY, (err, data) => {
          this.Initdata = data.data;
          this.initDataFlag = true;
        });
      })
    }
  }

  public get router(): Router { //this creates router property on your service.
    return this.injector.get(Router);
  }

  initBranch(): Promise<any> {
    if (this.isBrowser) {

      return new Promise((resolve) => {
        this.ngZone.run(() => {
          branch.init(Branch.KEY, (err, data) => {
            this.Initdata = data.data;
            this.initDataFlag = true;
          });

          branch.first((err, data) => {
            this.data = JSON.parse(data.data);
            if (this.Initdata) {
              var name = this.data.$og_title;
              var mediaId = this.data.assetId;
              var type = this.data.mediaType;
              this.ngZone.run(() => {
                if (this.getMediaTypeNameById(type) === "Movie") {
                  this.router.navigate(['/watch/movie/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId]).then(() => {
                    resolve();
                  });
                } else if (this.getMediaTypeNameById(type) === "Web Series") {
                  this.router.navigate(['/watch/webSeries/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId]).then(() => {
                    resolve();
                  });
                } else if (this.getMediaTypeNameById(type) === "Web Episode") {
                  this.router.navigate(['/watch/webEpisode/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId]).then(() => {
                    resolve();
                  });

                } else if (this.getMediaTypeNameById(type) === "UGC Video") {
                  this.router.navigate(['/watch/ugcVideo/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId]).then(() => {
                    resolve();
                  });
                } else if (this.getMediaTypeNameById(type) === "Spotlight Series") {
                  this.router.navigate(['/watch/spotlightSeries/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId]).then(() => {
                    resolve();
                  });
                } else if (this.getMediaTypeNameById(type) === "Spotlight Episode") {
                  this.router.navigate(['/watch/spotlightEpisode/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId]).then(() => {
                    resolve();
                  });
                } else if (this.getMediaTypeNameById(type) === "Short Film") {
                  this.router.navigateByUrl('/watch/short-films/' + this.getSEOFriendlyURL(name) + '/' + mediaId).then(() => {
                    resolve();
                  });
                } else if (this.getMediaTypeNameById(type) === "Clips") {
                  this.router.navigate(['/watch/clip/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId]).then(() => {
                    resolve();
                  });
                } else if (this.getMediaTypeNameById(type) === "UGC Creator") {
                  this.router.navigate(['/watch/creator/profile/' + mediaId]).then(() => {
                    resolve();
                  });
                } else if (this.getMediaTypeNameById(type) === "Linear") {
                  //  653471 / music - india / 591
                  this.router.navigate(['/watch/channel/' + this.getSEOFriendlyURL(name) + '/' + mediaId]).then(() => {
                    resolve();
                  });
                } else if (this.getMediaTypeNameById(type) === "Program") {
                  //  653471 / music - india / 591
                  this.router.navigate(['/watch/catchup/details/' + this.getSEOFriendlyURL(name) + '/' + mediaId + '']).then(() => {
                    resolve();
                  });
                } else {
                  this.router.navigate(["/"]).then(() => {
                    resolve();
                  });
                }

                resolve();
              })


              // this.router.navigateByUrl('/watch/short-films/' + "name" + '/' + this.data.assetId).then(() => {
              //   resolve();
              // });
            } else {
              resolve();
            }
          })
        })
        // resolve()
        setTimeout(() => {
          resolve();
        }, 20000)
      });

    }

  }

  getSEOFriendlyURL(val: string): string {
    let url: string = val.trim().toLowerCase();
    for (let i = 0; i < url.length; i++) {
      if (!url.charAt(i).match('[a-z 0-9]')) {
        url = url.replace(url.charAt(i), '');
      }

      if (url.charAt(i) === ' ') {
        url = url.replace(url.charAt(i), '-');
      }
    }
    url = encodeURI(url);
    return url;
  }

  getMediaTypeNameById(id): string {
    this.DMS = this.getDmsConfig('kal app');

    if (id.toString() === this.DMS.params.MediaTypes.Clips)
      return 'Clips'
    // if (id.toString() === DMS.params.MediaTypes.CreatorVideo)
    //     return 'Creator Video';
    if (id.toString() === this.DMS.params.MediaTypes.Genre)
      return 'Genre'
    if (id.toString() === this.DMS.params.MediaTypes.Linear)
      return 'Linear'
    if (id.toString() === this.DMS.params.MediaTypes.Program)
      return 'Program'
    if (id.toString() === this.DMS.params.MediaTypes.ShortFilm)
      return 'Short Film'
    if (id.toString() === this.DMS.params.MediaTypes.SpotlightEpisode)
      return 'Spotlight Episode'
    if (id.toString() === this.DMS.params.MediaTypes.SpotlightSeries)
      return 'Spotlight Series'
    if (id.toString() === this.DMS.params.MediaTypes.Trailer)
      return 'Trailer'
    // if (id.toString() === DMS.params.MediaTypes.TVEpisode)
    //     return 'TV Episode';
    // if (id.toString() === DMS.params.MediaTypes.TVShowSeries)
    //     return 'TV Show Series';
    if (id.toString() === this.DMS.params.MediaTypes.UGCCreator)
      return 'UGC Creator'
    if (id.toString() === this.DMS.params.MediaTypes.UGCVideo)
      return 'UGC Video'
    if (id.toString() === this.DMS.params.MediaTypes.WebEpisode)
      return 'Web Episode'
    if (id.toString() === this.DMS.params.MediaTypes.WebSeries)
      return 'Web Series'
    if (id.toString() === this.DMS.params.MediaTypes.Movie)
      return 'Movie'
  }

  getDmsConfig(calledFrom?: string): any {
    if (this.isBrowser) {
      let dms = localStorage.getItem(AppConstants.DMS_KEY);
      if (!dms) {
        return null;
      }
      dms = JSON.parse(dms);
      return dms;
    }
  }
}
