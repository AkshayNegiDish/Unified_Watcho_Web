import { Component, OnInit, Input } from '@angular/core';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-trailer',
  templateUrl: './show-trailer.component.html',
  styleUrls: ['./show-trailer.component.scss']
})
export class ShowTrailerComponent implements OnInit {

  @Input()
  assetDetails: any;

  DMS: any;
  showTrailerOrMovie: string;
  showTrailerMovieButton: boolean = false;
  referedAssetDetails: any;
  isMovie: boolean = false;

  constructor(private appUtilService: AppUtilService, private kalturaAppService: KalturaAppService, private router: Router) { }

  ngOnInit() {
    this.DMS = this.appUtilService.getDmsConfig();
    if (this.assetDetails.type.toString() === this.DMS.params.MediaTypes.Trailer) {
      this.isMovie = true;
      this.showTrailerOrMovie = "Watch Movie"
      this.getReferedResource()
    } else if (this.assetDetails.type.toString() === this.DMS.params.MediaTypes.Movie) {
      this.isMovie = false;
      this.showTrailerOrMovie = "Watch Trailer"
      this.getReferedResource()
    }
  }
  getReferedResource(): any {
    var refId: string = null;
    if (this.isMovie) {
      refId = this.assetDetails.tags.TrailerParentRefId.objects[0].value;
    } else {
      refId = this.assetDetails.tags['Ref Id'].objects[0].value;
    }
    if (refId) {
      this.kalturaAppService.getMovieDetailFromTrailer(this.assetDetails.type.toString(), refId).then((res: any) => {
        if (res.objects) {
          if (res.objects.length > 0) {
            this.referedAssetDetails = res.objects[0]
            this.showTrailerMovieButton = true;
          }
        }
      }, reject => {
        console.error(reject)
      })
    } else {
      this.showTrailerMovieButton = false;
    }

  }

  watchMovieOrTrailer() {
    this.appUtilService.getAssetRouteUrl(this.referedAssetDetails.name, this.referedAssetDetails.id, null, null, this.DMS.params.MediaTypes.Movie).subscribe((res: any) => {
      if (res.url) {
        this.router.navigate([res.url])
      }
    })
  }
}
