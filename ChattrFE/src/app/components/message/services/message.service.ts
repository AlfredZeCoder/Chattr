import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../../../shared/models/message.interface';
import { CookieService } from 'ngx-cookie-service';
import { SERVER_URL } from '../../../../../env';

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
      `${SERVER_URL}/message/all/${conversationId}`
    );
  }

  sendMessage$(message: Message) {
    return this.httpClient.post<Message>(
      SERVER_URL + '/message/add',
      message,
      {
        headers: {
          'Authorization': 'Bearer ' + this.cookieService.get('access_token')
        }
      }
    );
  }

  getLastMessageFromConversationId$(conversationId: number) {
    return this.httpClient.get<Message>(
      SERVER_URL + '/message/last/' + conversationId
    );
  }

  changeMessageReadStatus$(messageId: number) {
    return this.httpClient.put(
      SERVER_URL + '/message/update-read-status/' + messageId,
      {},
      {
        headers: {
          'Authorization': 'Bearer ' + this.cookieService.get('access_token')
        }
      }
    );
  }
}
