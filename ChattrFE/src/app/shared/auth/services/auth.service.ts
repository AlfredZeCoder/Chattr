import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../../../../env';
import { Token } from '../../../shared/models/token.interface';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { AddUser } from '../../../shared/models/add-user.interface';
import { User } from '../../../shared/models/user.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) { }

  isLoggedIn$ = new BehaviorSubject<boolean | null>(null);

  checkLoginStatus = () => {
    return this.isLoggedIn$.getValue();
  };

  user$ = new BehaviorSubject<User>(
    {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      conversationsId: [],
      pendingUserIdRequests: []
    }
  );

  saveUserInfos$ = (access_token: string) => {
    return this.httpClient.get<User>(
      SERVER_URL + '/user/one-by-id-from-token',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

  };


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
    this.cookieService.set(
      'access_token',
      token.token,
      {
        expires: 1,
        path: '/',
      }
    );
  };

  register$ = (user: AddUser) => {
    return this.httpClient.post<Token>(
      SERVER_URL + '/auth/add',
      user
    );

  };
}
