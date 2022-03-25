import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';

import { MyDishTvSpaceService } from '../../../services/mydishtvspace.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.scss']
})
export class ProgramDetailComponent implements OnInit {
  programs: any;
  progress: string;
  isPlaying: boolean = false;
  day: string;
  isBrowser: any;

  constructor(@Inject(PLATFORM_ID) private platformId, private mydishtvspaceservice: MyDishTvSpaceService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.programs = this.mydishtvspaceservice.getProgramDetail();

    var startdate = new Date();
    var stopdate = new Date();

    startdate.setDate(this.programs[0].programstart.split('T')[0].split('-')[2]);
    startdate.setFullYear(this.programs[0].programstart.split('T')[0].split('-')[0]);
    startdate.setMonth(Number(this.programs[0].programstart.split('T')[0].split('-')[1] - 1));
    startdate.setHours(this.programs[0].programstart.split('T')[1].split(':')[0]);
    startdate.setMinutes(this.programs[0].programstart.split('T')[1].split(':')[1]);

    stopdate.setDate(this.programs[0].programstop.split('T')[0].split('-')[2]);
    stopdate.setFullYear(this.programs[0].programstop.split('T')[0].split('-')[0]);
    stopdate.setMonth(Number(this.programs[0].programstop.split('T')[0].split('-')[1] - 1));
    stopdate.setHours(this.programs[0].programstop.split('T')[1].split(':')[0]);
    stopdate.setMinutes(this.programs[0].programstop.split('T')[1].split(':')[1]);

    var date = new Date();
    var progress = Math.floor(((stopdate.getTime() - startdate.getTime()) / 1000) / 60) - Math.floor(((stopdate.getTime() - date.getTime()) / 1000) / 60);
    this.progress = ((progress * 100) / Math.floor(((stopdate.getTime() - startdate.getTime()) / 1000) / 60)).toFixed(2) + '%';
    if (progress >= 0) {
      this.isPlaying = true;
      this.day = 'Today';
    } else {
      this.day = startdate.toString().split(' ')[0] + ' ' + startdate.toString().split(' ')[1] + ' ' + startdate.toString().split(' ')[2];
      switch (true) {
        case (Number(date.toString().split(' ')[2]) === Number(startdate.toString().split(' ')[2])):
          this.day = 'Today';
          break;
        case ((Number(date.toString().split(' ')[2]) + 1) === Number(startdate.toString().split(' ')[2])):
          this.day = 'Tomorrow';
        default:
          break;
      }
    }
  }

  tConvert(date) {
    var time = date.split('T')[1].split('.')[0]
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) { // If time format correct
      time = time.slice(1, 4);  // Remove full string match value
      time[3] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      localStorage.removeItem("programs");
    }
  }
}
