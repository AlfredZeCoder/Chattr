import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../../env';
import { Token } from '../models/token.interface';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) { }

  isLoggedIn$ = new BehaviorSubject<boolean>(false);

  loginWithCredentials$ = (email: string, password: string) => {
    return this.httpClient.post<Token>(
      SERVER_URL + '/auth/login',
      {
        email,
        password
      }
    );
  };

  loginWithToken$ = (access_token: string) => {
    return this.httpClient.post<Token>(
      SERVER_URL + '/auth/login-with-token',
      {
        token: access_token
      }
    );
  };

  putTokenInCookies = (token: Token) => {
    this.cookieService.set('access_token', token.token);
  };
}
