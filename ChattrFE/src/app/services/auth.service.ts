import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../../env';
import { Token } from '../models/token.interface';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { ErrorMessage } from '../models/error-message.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) { }

  isLoggedIn$ = new BehaviorSubject<boolean | null>(null);

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
    if (this.cookieService.check('access_token')) {
      this.cookieService.delete('access_token');
    }
    this.cookieService.set('access_token', token.token);
  };

  register$ = (user: User | ErrorMessage) => {
    return this.httpClient.post<Token>(
      SERVER_URL + '/auth/add',
      user
    );

  };
}
