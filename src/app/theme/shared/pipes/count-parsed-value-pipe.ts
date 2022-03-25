import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppUtilService } from '../services/app-util.service';

@Pipe({
  name: 'parseCount'
})
export class CountParsedValuePipe implements PipeTransform {

  constructor(private appUtilService: AppUtilService) {}
 
 public transform(value: any){
    return this.appUtilService.getCountParsedValue(value);
  }
}
