import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { SharedModule } from "../../../shared/shared.module";







@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    SlickCarouselModule,
    InfiniteScrollModule,
    SharedModule,
    SlickCarouselModule,
    NgbModule,
    InfiniteScrollModule
  ],
  declarations: [],
  exports: [
  ]
})
export class DetailPagesSharedModule { }
