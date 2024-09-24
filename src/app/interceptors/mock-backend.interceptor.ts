import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, body } = req;

    // Mock countries data
    if (url.endsWith('api/countries') && method === 'GET') {
      const countries = [
        'USA', 'Canada', 'Germany', 'Australia', 'India', 'United Kingdom', 'France', 'Brazil', 'Italy', 
        'Japan', 'China', 'South Africa', 'Russia', 'Mexico', 'Spain', 'Argentina', 'Netherlands', 
        'Sweden', 'Norway', 'New Zealand', 'Finland', 'Denmark', 'Switzerland', 'Austria', 'Belgium', 
        'Greece', 'Poland', 'Portugal', 'Turkey', 'Saudi Arabia', 'South Korea', 'Indonesia', 
        'Malaysia', 'Singapore', 'Thailand', 'Vietnam', 'Philippines', 'Egypt', 'Nigeria', 'Kenya', 
        'Israel', 'Ireland', 'Colombia', 'Peru', 'Chile', 'Venezuela', 'Pakistan', 'Bangladesh', 
        'Sri Lanka', 'Nepal', 'Iran'
      ];
      return of(new HttpResponse({ status: 200, body: countries })).pipe(delay(500));
    }

    // Mock username availability check
    if (url.startsWith('api/username-available/') && method === 'GET') {
      const username = url.split('/').pop();
      const takenUsernames = ['john123', 'cena3', 'user1']; // Mock taken usernames
      const isAvailable = !takenUsernames.includes(username?.toLowerCase() || '');
      return of(new HttpResponse({ status: 200, body: isAvailable })).pipe(delay(500));
    }

     // Mock registration POST request
     if (url.endsWith('api/register') && method === 'POST') {
      return of(new HttpResponse({ status: 200, body: { message: 'Registration successful' } }))
        .pipe(delay(500));
    }

    // If the request doesn't match any mock endpoint, pass it through
    return next.handle(req);
  }
}
