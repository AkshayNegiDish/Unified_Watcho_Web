import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { KalturaUtilService } from '../services/kaltura-util.service';
import { TagsObject } from '../typings/kaltura-response-typings';

@Pipe({
	name: 'tagObject'
})

@Injectable()
export class TagObjectPipe implements PipeTransform {

	constructor(private kalturaUtilService: KalturaUtilService) { }

	public transform(object: TagsObject) {
		return this.kalturaUtilService.getTagsObjectValue(object);
	}
}
