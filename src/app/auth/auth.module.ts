import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guard/auth.guard';
import { AppInterceptor } from './interceptor/app.interceptor';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [

  ],
  providers: [
    AuthGuard,
    AppInterceptor
  ],

})
export class AuthModule {

}
