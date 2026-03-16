import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_TOKEN_KEY } from '../constants/storage-keys';

/** Adds the JWT token to every request so the backend knows who is logged in. */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    return next.handle(request);
  }
}
