import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CarouselItemComponent } from './asset-view-containers/carousel-item/carousel-item.component'
import { HeaderComponent } from './header/header.component'
import { FooterComponent } from './footer/footer.component'
import { ScrollTopComponent } from './scroll-top/scroll-top.component'
import { DefaultComponent } from '../pages/default/default.component'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppFormService } from './services/shared-form.service'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { InterceptorService } from '../shared/services/interceptor.service'
import { SideNavComponent } from './side-nav/side-nav.component'
import { NgbDropdownModule, NgbPopoverModule, NgbProgressbarModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap'
import { SearchComponent } from '../pages/default/search/components/search/search.component'
import { MobileBottomNavComponent } from './mobile-bottom-nav/mobile-bottom-nav.component'
import { MessageService } from './services/message.service'
import { ImageUploaderComponent } from './image-uploader/image-uploader.component'
import { ImageCropperModule } from "ngx-image-cropper"
import { FileUploadModule } from 'ng2-file-upload'
import { SafePipe } from './pipes/safe-image-pipe'
import { AppShellNoRenderDirective } from '../../directives/app-shell-no-render.directive'
import { AppShellRenderDirective } from '../../directives/app-shell-render.directive'
import { DefaultShellComponent } from './app-shells/default-shell/default-shell.component'
import { KalturaAppService } from './services/kaltura-app.service'
import { KalturaUtilService } from './services/kaltura-util.service'
import { RailItemViewComponent } from './asset-view-containers/railItemView/railItemView.component'
import { AppUtilService } from './services/app-util.service'
import { ImageTransformationPipe } from './pipes/image-transformation-pipe'
import { ThumbnailPipe } from './pipes/thumbnail-pipe'
import { TagObjectPipe } from './pipes/tag-object-pipe'
import { MediaTimePipe } from './pipes/media-time-pipe.'
import { StringTrimPipe } from './pipes/string-trim-pipe'
import { SnackbarUtilService } from './services/snackbar-util.service'
import { NoResultComponent } from './no-result/no-result.component'
import { DeviceDetectorModule } from 'ngx-device-detector'
import { RailItemComponent } from './asset-view-containers/rail-item/rail-item.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { LoaderComponent } from './loader/loader.component';
import { DefaultRailShellComponent } from './app-shells/default-rail-shell/default-rail-shell.component';
import { DefaultRailItemShellComponent } from './app-shells/default-rail-item-shell/default-rail-item-shell.component';
import { NameInitialPipe } from './pipes/name-initial-pipe';
// import { MyConsoleService } from './services/my-console.service';
import { SidebarModule } from 'ng-sidebar';
import { KalturaPlayerComponent } from './player/player.component';
import { MetaObjectPipe } from './pipes/meta-object-pipe';
import { ViewPortService } from './services/view.port.service';
import { PlatformIdentifierService } from './services/platform-identifier.service';
import { PosterComponent } from '../pages/default/detail-page/common-components/poster/poster.component';
import { NotFoundComponent } from './not-found/not-found/not-found.component';
import { RegisteredDevicesComponent } from '../pages/default/user-management/components/registered-devices/registered-devices.component';
import { SignInSignUpModalComponent } from './entry-component/signIn-signUp-modal.component';
import { AppDownloadComponent } from './download-app-modal/app-download.component';
import { UgcVideoPopupComponent } from './ugc-video-popup/ugc-video-popup.component';
import { EdgeErrorComponent } from './edge-error/edge-error.component';
import { NotificationComponent } from './notification/notification.component';
import { ParentalPinValidatorComponent } from './parental-pin-validator/parental-pin-validator.component';
import { DeepSearchFilterComponent } from './deep-search-filter/deep-search-filter.component';
import { DescriptionShellComponent } from './app-shells/description-shell/description-shell.component';
import { BannerComponent } from './google-adsence/banner-component/banner-component.component';
import { CookiesBannerComponent } from './cookies-banner/cookies-banner/cookies-banner.component';
import { LazyLoadDirective } from './lazy-load.directive';
import { LiveShellComponent } from './app-shells/live-shell/live-shell.component';
import { BackButtonComponent } from './back-button/back-button/back-button.component';
import { PwaHeaderComponent } from './pwa-header/pwa-header.component';
import { EnveuAppService } from './services/enveu-app.service';
import { HeroComponent } from './hero/hero.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { SitemapDetailsComponent } from './sitemap-details/sitemap-details.component';
import { HelpComponent } from './help/help.component';
import { FaqComponent } from './help/faq/faq.component';
import { ArticlesComponent } from './help/faq/articles/articles.component';
import { CreateTicketComponent } from './help/create-ticket/create-ticket.component';
import { TicketListComponent } from './help/ticket-list/ticket-list.component';
import { TicketDetailsComponent } from './help/ticket-list/ticket-details/ticket-details.component';
import { CountParsedValuePipe } from './pipes/count-parsed-value-pipe';
import { from } from 'rxjs'
import { FollowCreatorComponent } from '../pages/default/detail-page/common-components/follow-creator/follow-creator.component'
import { LikeComponent } from '../pages/default/detail-page/common-components/like/like.component';
import { UgcPlayerComponent } from './ugc-player/ugc-player.component';
import { UgcVideoMobileComponent } from './ugc-video-mobile/ugc-video-mobile.component'
import { ShareComponent } from '../pages/default/detail-page/common-components/share/share.component'
import { ModalMessageService } from './services/modal-message.service'
import { UserFormService } from '../pages/default/user-management/services/user-form.service'
import { ContentPreferenceComponent } from '../pages/default/user-management/components/content-preference/content-preference.component';
import { RegisterGrievanceComponent } from './register-grievance/register-grievance.component';
import { GrievanceOttComponent } from './register-grievance/grievance-ott/grievance-ott.component';
import { GrievanceSocialMediaComponent } from './register-grievance/grievance-social-media/grievance-social-media.component'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FileUploadModule,
    ImageCropperModule,
    FormsModule,
    NgbDropdownModule,
    NgbPopoverModule,
    SlickCarouselModule,
    DeviceDetectorModule.forRoot(),
    SidebarModule.forRoot(),
    NgbProgressbarModule,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CarouselItemComponent,
    HeaderComponent,
    FooterComponent,
    ScrollTopComponent,
    DefaultComponent,
    SideNavComponent,
    MobileBottomNavComponent,
    ImageUploaderComponent,
    SafePipe,
    AppShellNoRenderDirective,
    AppShellRenderDirective,
    DefaultShellComponent,
    LiveShellComponent,
    RailItemViewComponent,
    ImageTransformationPipe,
    ThumbnailPipe,
    TagObjectPipe,
    MediaTimePipe,
    StringTrimPipe,
    NoResultComponent,
    RailItemComponent,
    LoaderComponent,
    DefaultRailShellComponent,
    DefaultRailItemShellComponent,
    NameInitialPipe,
    KalturaPlayerComponent,
    MetaObjectPipe,
    PosterComponent,
    NotFoundComponent,
    RegisteredDevicesComponent,
    SignInSignUpModalComponent,
    AppDownloadComponent,
    UgcVideoPopupComponent,
    EdgeErrorComponent,
    NotificationComponent,
    ParentalPinValidatorComponent,
    DeepSearchFilterComponent,
    DescriptionShellComponent,
    BannerComponent,
    CookiesBannerComponent,
    LazyLoadDirective,
    LiveShellComponent,
    BackButtonComponent,
    PwaHeaderComponent,
    HeroComponent,
    SitemapComponent,
    SitemapDetailsComponent,
    HelpComponent,
    FaqComponent,
    ArticlesComponent,
    CreateTicketComponent,
    TicketListComponent,
    TicketDetailsComponent,
    CountParsedValuePipe,
    FollowCreatorComponent,
    LikeComponent,
    UgcPlayerComponent,
    UgcVideoMobileComponent,
    ShareComponent,
    ContentPreferenceComponent,
    RegisterGrievanceComponent,
    GrievanceOttComponent,
    GrievanceSocialMediaComponent
  ],
  exports: [
    CarouselItemComponent,
    FooterComponent,
    HeaderComponent,
    ScrollTopComponent,
    MobileBottomNavComponent,
    DefaultComponent,
    ImageUploaderComponent,
    AppShellNoRenderDirective,
    AppShellRenderDirective,
    DefaultShellComponent,
    LiveShellComponent,
    RailItemViewComponent,
    ImageTransformationPipe,
    ThumbnailPipe,
    TagObjectPipe,
    MediaTimePipe,
    StringTrimPipe,
    NoResultComponent,
    RailItemComponent,
    SlickCarouselModule,
    LoaderComponent,
    DefaultRailShellComponent,
    DefaultRailItemShellComponent,
    NameInitialPipe,
    KalturaPlayerComponent,
    MetaObjectPipe,
    PosterComponent,
    RegisteredDevicesComponent,
    SignInSignUpModalComponent,
    AppDownloadComponent,
    UgcVideoPopupComponent,
    EdgeErrorComponent,
    ParentalPinValidatorComponent,
    DeepSearchFilterComponent,
    DescriptionShellComponent,
    BannerComponent,
    CookiesBannerComponent,
    LazyLoadDirective,
    BackButtonComponent,
    PwaHeaderComponent,
    HeroComponent,
    CountParsedValuePipe,
    FollowCreatorComponent,
    LikeComponent,
    UgcPlayerComponent,
    UgcVideoMobileComponent,
    ShareComponent,
    ContentPreferenceComponent,
    RegisterGrievanceComponent,
    GrievanceOttComponent,
    GrievanceSocialMediaComponent
  ],
  providers: [
    MessageService,
    KalturaAppService,
    KalturaUtilService,
    AppUtilService,
    SnackbarUtilService,
    ViewPortService,
    PlatformIdentifierService,
    AppFormService,
    InterceptorService,
    SearchComponent,
    SignInSignUpModalComponent,
    EdgeErrorComponent,
    AppDownloadComponent,
    UgcVideoPopupComponent,
    ModalMessageService,
    UserFormService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    EnveuAppService

  ],
  entryComponents: [
    SignInSignUpModalComponent,
    AppDownloadComponent,
    EdgeErrorComponent,
    ParentalPinValidatorComponent,
    UgcVideoPopupComponent
  ]
})
export class SharedModule {
}
