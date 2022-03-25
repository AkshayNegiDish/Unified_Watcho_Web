import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { KalturaUtilService } from '../services/kaltura-util.service';
import { Images } from '../typings/kaltura-response-typings';

@Pipe({
	name: 'thumbnail'
})

@Injectable()
export class ThumbnailPipe implements PipeTransform {

	constructor(private kalturaUtilService: KalturaUtilService) { }

	public transform(imagesAsset: Images[], viewType: string, width?: number, height?: number, quality?: number) {
		return this.kalturaUtilService.getImageByOrientation(imagesAsset, viewType, width, height, quality);
	}
}
