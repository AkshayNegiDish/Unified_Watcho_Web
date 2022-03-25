import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { SharedModule } from "../../../shared/shared.module";
import { RailsViewComponent } from "./components/rails-view/rails-view.component";







@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    SlickCarouselModule,
    InfiniteScrollModule,
  ],
  declarations: [RailsViewComponent],
  exports: [
    RailsViewComponent
  ]
})
export class MainNavSharedModule { }
