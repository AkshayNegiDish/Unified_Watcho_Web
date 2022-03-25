import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { KalturaUtilService } from '../../../../../shared/services/kaltura-util.service';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { SnackbarUtilService } from '../../../../../shared/services/snackbar-util.service';
declare var $: any;
declare var branch: any;

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit, AfterViewInit {
  @Input()
  assetDetails: any;

  videoDeepUrl: string;
  link: any;
  fbImageUrl: string;
  soicalType: string;

  constructor(private platformIdentifierService: PlatformIdentifierService, private snackbarUtilService: SnackbarUtilService, private kalturaUtilService: KalturaUtilService, private appUtilService: AppUtilService) { }

  ngOnInit() {
    if (this.assetDetails) {
      this.setupDeepLink();
    }
  }

  ngAfterViewInit() {
    if (this.platformIdentifierService.isBrowser()) {
      $(".sb-facebook").on('click', () => {
        this.soicalType = 'facebook';
      })
      $('.sb-twitter').on('click', () => {
        this.soicalType = 'twitter';
      })
    }
  }

  setupDeepLink() {

    this.fbImageUrl = this.kalturaUtilService.getImageByOrientation(this.assetDetails.images, 'LANDSCAPE', 516, 269.4777777);
    this.share(this.assetDetails.id, this.assetDetails.type, this.assetDetails.name, this.assetDetails.description, this.fbImageUrl);
  }

  copyText(val: string, e: any) {
    var range, selection;
    if (this.platformIdentifierService.isBrowser()) {
      if (this.videoDeepUrl) {
        var el = document.createElement('textarea');
        el.value = val;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px'

        document.body.appendChild(el);

        if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
          // save current contentEditable/readOnly status
          var editable = el.contentEditable;
          var readOnly = el.readOnly;

          // convert to editable with readonly to stop iOS keyboard opening
          el.contentEditable = 'true';
          el.readOnly = true;

          // create a selectable range
          range = document.createRange();
          range.selectNodeContents(el);

          // select the range
          selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          el.setSelectionRange(0, 999999);

          // restore contentEditable/readOnly to original state
          el.contentEditable = editable;
          el.readOnly = readOnly;
        } else {
          el.select();
        }

        document.execCommand('copy');
        document.body.removeChild(el);
        this.snackbarUtilService.showSnackbar("Link copied to clipboard");
        this.shareWithCopiedMoEngageEvent(this.assetDetails.type);
      } else {
        this.snackbarUtilService.showSnackbar("Link cannot be copied")
      }
      return false;

    }

  }

  openFbShareWindow() {
    window.open("//www.facebook.com/sharer/sharer.php?u=" + this.videoDeepUrl, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
  }

  openTwitterShareWindow() {
    window.open("//twitter.com/intent/tweet?url=" + this.videoDeepUrl, '_blank', 'location=yes,height=570,center: true,width=520,scrollbars=yes,status=yes');
  }

  // copyToClipboard(event) {
  //   $('#shareInput').style.position = 'fixed';
  //   $('#shareInput').style.left = '0';
  //   $('#shareInput').style.top = '0';
  //   $('#shareInput').style.opacity = '0';
  //   if (this.videoDeepUrl) {

  //     event.stopPropagation();
  //     this.snackbarUtilService.showSnackbar("Link copied to clipboard");
  //     this.gaTagForShare();
  //     return true;
  //   }
  //   else {
  //     event.stopPropagation();
  //     this.snackbarUtilService.showSnackbar("Link cannot be copied");
  //     return true

  //   }
  // }

  share(id: number, mediaType: number, $og_title: string, $og_description: string, fbImageUrl: string) {
    let videoDeepUrl: string;
    var linkData = {
      campaign: 'content 123',
      channel: 'all',
      feature: 'video',
      stage: 'new user',
      tags: ['tag1', 'tag2', 'tag3'],
      alias: '',
      data: {
        'assetId': id.toString(),
        'mediaType': mediaType.toString(),
        '$og_title': $og_title,
        '$og_description': $og_description,
        // 'contentType': contenteType,
        // 'custom_bool': true,
        // '$og_title': title,
        '$og_image_url': fbImageUrl,
        // '$og_url': environment.WEB_ID
      }
    };

    branch.link(linkData, (err, sharinglink) => {

      this.videoDeepUrl = sharinglink
    });
    // return videoDeepUrl
  }

  shareMoEngageEvent(type: number) {
    let addWatchlist: any;
    if (this.appUtilService.getMediaTypeNameById(type) === 'UGC Video') {
      addWatchlist = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_creator_name: this.assetDetails.type !== 0 ? this.assetDetails.tags['Series Name'] ? this.assetDetails.tags['Series Name'].objects[0].value : null : this.assetDetails.metas['Series_Name'] ? this.assetDetails.metas['Series_Name'].value : null,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "share_details_page",
        share_type: this.soicalType,
        status: "share_successful"
      }
    } else if (this.appUtilService.getMediaTypeNameById(type) === 'UGC Creator') {
      addWatchlist = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_creator_name: this.assetDetails.name,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "share_details_page",
        share_type: this.soicalType,
        status: "share_successful"
      }
    } else if (this.appUtilService.getMediaTypeNameById(type) === 'Spotlight Series' || this.appUtilService.getMediaTypeNameById(type) === 'Web Series') {
      addWatchlist = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_subgenre: this.assetDetails.tags['Sub Genre'] ? this.assetDetails.tags['Sub Genre'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: this.assetDetails.name,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "share_details_page",
        share_type: this.soicalType,
        status: "share_successful"
      }
    } else if (this.appUtilService.getMediaTypeNameById(type) === 'Short Film' || this.appUtilService.getMediaTypeNameById(type) === 'Movie' || this.appUtilService.getMediaTypeNameById(type) === 'Program' || this.appUtilService.getMediaTypeNameById(type) === 'Linear' || this.appUtilService.getMediaTypeNameById(type) === 'Spotlight Episode' || this.appUtilService.getMediaTypeNameById(type) === 'Web Episode') {
      addWatchlist = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: this.assetDetails.type !== 0 ? this.assetDetails.tags['Series Name'] ? this.assetDetails.tags['Series Name'].objects[0].value : null : this.assetDetails.metas['Series_Name'] ? this.assetDetails.metas['Series_Name'].value : null,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "share_details_page",
        share_type: this.soicalType,
        status: "share_successful"
      }
    }
    this.appUtilService.moEngageEventTracking("SHARE_ASSET", addWatchlist);
  }

  shareWithCopiedMoEngageEvent(type: number) {
    let addWatchlist: any;
    if (this.appUtilService.getMediaTypeNameById(type) === 'UGC Video') {
      addWatchlist = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_creator_name: this.assetDetails.type !== 0 ? this.assetDetails.tags['Series Name'] ? this.assetDetails.tags['Series Name'].objects[0].value : null : this.assetDetails.metas['Series_Name'] ? this.assetDetails.metas['Series_Name'].value : null,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "share_details_page",
        share_type: 'copy_to_clipboard',
        status: "share_successful"
      }
    } else if (this.appUtilService.getMediaTypeNameById(type) === 'UGC Creator') {
      addWatchlist = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_creator_name: this.assetDetails.name,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "share_details_page",
        share_type: 'copy_to_clipboard',
        status: "share_successful"
      }
    } else if (this.appUtilService.getMediaTypeNameById(type) === 'Spotlight Series' || this.appUtilService.getMediaTypeNameById(type) === 'Web Series') {
      addWatchlist = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_subgenre: this.assetDetails.tags['Sub Genre'] ? this.assetDetails.tags['Sub Genre'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: this.assetDetails.name,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "share_details_page",
        share_type: 'copy_to_clipboard',
        status: "share_successful"
      }
    } else if (this.appUtilService.getMediaTypeNameById(type) === 'Short Film' || this.appUtilService.getMediaTypeNameById(type) === 'Movie' || this.appUtilService.getMediaTypeNameById(type) === 'Program' || this.appUtilService.getMediaTypeNameById(type) === 'Linear' || this.appUtilService.getMediaTypeNameById(type) === 'Spotlight Episode' || this.appUtilService.getMediaTypeNameById(type) === 'Web Episode') {
      addWatchlist = {
        asset_ID: this.assetDetails.id,
        asset_title: this.assetDetails.name,
        asset_genre: this.assetDetails.type !== 0 ? this.assetDetails.tags['Genre'] ? this.assetDetails.tags['Genre'].objects[0].value : null : this.assetDetails.tags['Genres'] ? this.assetDetails.tags['Genres'].objects[0].value : null,
        asset_mediatype: this.assetDetails.type,
        asset_parental_rating: this.assetDetails.tags['Parental Rating'] ? this.assetDetails.tags['Parental Rating'].objects[0].value : null,
        asset_series_name: this.assetDetails.type !== 0 ? this.assetDetails.tags['Series Name'] ? this.assetDetails.tags['Series Name'].objects[0].value : null : this.assetDetails.metas['Series_Name'] ? this.assetDetails.metas['Series_Name'].value : null,
        asset_episode_number: this.assetDetails.type !== 0 ? this.assetDetails.metas['Episode number'] ? this.assetDetails.metas['Episode number'].value : null : this.assetDetails.metas['Episode Number'] ? this.assetDetails.metas['Episode Number'].value : null,
        source: "share_details_page",
        share_type: 'copy_to_clipboard',
        status: "share_successful"
      }
    }
    this.appUtilService.moEngageEventTracking("SHARE_ASSET", addWatchlist);
  }

}
