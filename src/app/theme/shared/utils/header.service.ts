import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HeaderService {

  constructor() { }

  getHeaders() : any {
    // const headers = new HttpHeaders().set(AppConstants.X_PLATFORM_HEADER_KEY, AppConstants.X_PLATFORM_HEADER_VALUE);
    return new HttpHeaders();
  }
}
