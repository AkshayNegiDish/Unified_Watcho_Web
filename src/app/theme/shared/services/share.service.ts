import { Injectable } from '@angular/core';

declare var branch: any;
@Injectable({
  providedIn: 'root'
})
export class ShareService {
  link: any;

  constructor() {
  }

  share(id: number, mediaType: number, $og_title: string, $og_description: string): string {



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
        // '$og_image_url': imageUrl,
        // '$og_url': environment.WEB_ID
      }
    };

    branch.link(linkData, (err, sharinglink) => {
      this.link = sharinglink
    });
    return this.link;
  }
}
