import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { KalturaUtilService } from '../services/kaltura-util.service';

@Pipe({
	name: 'metaObject'
})

@Injectable()
export class MetaObjectPipe implements PipeTransform {

	constructor(private kalturaUtilService: KalturaUtilService) { }

	public transform(object: any) {
		return this.kalturaUtilService.getMetasObjectValue(object, '');
	}
}
