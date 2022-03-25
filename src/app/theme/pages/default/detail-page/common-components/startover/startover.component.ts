import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

@Component({
  selector: 'app-startover',
  templateUrl: './startover.component.html',
  styleUrls: ['./startover.component.scss']
})
export class StartoverComponent implements OnInit {

  showWatchover: boolean = false;
  position: number;

  constructor(private router : Router, private activatedRoute : ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      if (params.has('position')){
        this.position = +params.get('position');
        if (this.position > 0) {
          this.showWatchover = true;
        }
      }
    });
  }

  changedPosition() {
    this.showWatchover = false;
        const urlTree = this.router.createUrlTree([], {
          queryParams: { position: 0 },
          queryParamsHandling: "merge",
          preserveFragment: true });
      
        this.router.navigateByUrl(urlTree);
    }
}
