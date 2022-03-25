import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { AppUtilService } from '../services/app-util.service';

@Pipe({
	name: 'initial'
})

@Injectable()
export class NameInitialPipe implements PipeTransform {

	constructor(private appUtilService: AppUtilService) { }

	public transform(name: string) {
		return this.appUtilService.getInitialFromName(name);
	}
}
