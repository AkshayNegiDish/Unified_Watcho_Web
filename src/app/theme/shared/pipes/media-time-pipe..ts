import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { KalturaUtilService } from '../services/kaltura-util.service';

@Pipe({
	name: 'mediaTime'
})

@Injectable()
export class MediaTimePipe implements PipeTransform {

	constructor(private kalturaUtilService: KalturaUtilService) { }

	public transform(val: number) {
		return this.kalturaUtilService.getMediaTime(val);
	}
}
