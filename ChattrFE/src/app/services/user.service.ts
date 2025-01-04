import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';
import { SERVER_URL } from '../../../env';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getOneById$(id: number) {
    return this.httpClient.get<User>(
      SERVER_URL + '/user/one-by-id/' + id
    );
  }
}
