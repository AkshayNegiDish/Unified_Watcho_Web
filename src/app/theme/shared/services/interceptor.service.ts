import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators/tap';
import { CommonMessageService } from './common-message.service';
@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(private commonMessageService: CommonMessageService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((response: HttpEvent<any>) => {
        if (response instanceof HttpResponse) {
          // http response status code
        }
        return response;
      },
        (error: any) => {
          console.log(error);
          if (error instanceof HttpErrorResponse) {
            if (error.error.responseCode === 401) {
              let message = true;
              this.commonMessageService.loginmessage(message);

            }
          }
        }
      )
    )
  };






}


