import { isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_ID, APP_INITIALIZER, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbActiveModal, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProgressBarModule } from "angular-progress-bar";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
// import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
// import Amplify, { API } from "aws-amplify";
// import awsmobile from '../aws-exports';
import { UserManagementModule } from './theme/pages/default/user-management/user-management.module';
import { AppConfigService } from './theme/services/app-config.service';
import { BranchService } from './theme/services/branch.service';
import { ChangePasswordComponent } from './theme/shared/change-password/change-password.component';
import { ForgetPasswordComponent } from './theme/shared/forget-password/forget-password.component';
import { LoginMessageService } from './theme/shared/services/auth-message.service';
import { SharedModule } from './theme/shared/shared.module';
import { ThemeComponent } from './theme/theme.component';
import { CommonMessageService } from './theme/shared/services/common-message.service';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';



@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'app-web' }),
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule.forRoot(),
    SharedModule,
    NgbModalModule,
    BrowserAnimationsModule,
    AuthModule,
    UserManagementModule,
    ProgressBarModule,
    ServiceWorkerModule.register('/custom-sw.js', { enabled: environment.production })
    // AmplifyAngularModule
  ],
  declarations: [
    AppComponent,
    ThemeComponent,
    ForgetPasswordComponent,
    ChangePasswordComponent
  ],
  providers: [
    LoginMessageService,
    CommonMessageService,

    // AmplifyService
    AppConfigService,
    NgbActiveModal,
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: AppConfigService) => function () { return configService.load() },
      deps: [AppConfigService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (branchService: BranchService) => function () { return branchService.initBranch() },
      deps: [BranchService],
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ForgetPasswordComponent, ChangePasswordComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';


    // console.log(awsmobile)
    // Amplify.configure(awsmobile);
    // myConsole = injector.get(MyConsoleService)
    if (isPlatformBrowser(platformId)) {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/custom-sw.js');
        });
        window.addEventListener('fetch', (event: any) => {
          event.respondWith(
            caches.match(event.request)
              .then(function (response) {
                if (response) {
                  return response;     // if valid response is found in cache return it
                } else {
                  return fetch(event.request)     //fetch from internet
                    .then(function (res) {
                      return caches.open("CACHE_DYNAMIC_NAME")
                        .then(function (cache) {
                          cache.put(event.request.url, res.clone());    //save the response for future
                          return res;   // return the fetched data
                        })
                    })
                    .catch(function (err) {       // fallback mechanism
                      return caches.open("CACHE_CONTAINING_ERROR_MESSAGES")
                        .then(function (cache) {
                          return cache.match('/offline.html');
                        });
                    });
                }
              })
          );
        });
      }
    }
  }


}
