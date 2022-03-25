import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { AppUtilService } from '../services/app-util.service';

@Pipe({
	name: 'trim'
})

@Injectable()
export class StringTrimPipe implements PipeTransform {

	constructor(private appUtilService: AppUtilService) { }

	public transform(str: string, length?: number) {
		return this.appUtilService.stringTrim(str, length);
	}
}
