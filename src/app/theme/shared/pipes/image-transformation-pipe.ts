import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { KalturaUtilService } from '../services/kaltura-util.service';

@Pipe({
	name: 'transformImage'
})

@Injectable()
export class ImageTransformationPipe implements PipeTransform {

	constructor(private kalturaUtilService: KalturaUtilService) { }

	public transform(url: string, width: number, height: number, quality: number) {
		return this.kalturaUtilService.transformImage(url, width, height, quality);
	}
}
