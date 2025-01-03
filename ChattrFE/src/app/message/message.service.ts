import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message.interface';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) { }

  getMessagesFromConversation$(conversationId: number) {
    return this.httpClient.get<Message[]>(
      `http://localhost:3000/message/all/${conversationId}`
    );
  }

  sendMessage$(message: Message) {
    return this.httpClient.post<Message>(
      `http://localhost:3000/message/add`,
      message,
      {
        headers: {
          'Authorization': 'Bearer ' + this.cookieService.get('access_token')
        }
      }
    );
  }
}
