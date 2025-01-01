import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../../env';
import { ConversationProperties } from '../models/conversation-properties.interface';
import { Message } from '../models/message.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllConversationPropertiesFromUserId$(userId: number) {
    return this.httpClient.get<ConversationProperties[]>(
      SERVER_URL + '/conversation/all/' + userId
    );
  }

  getLastMessageFromConversationId$(conversationId: number) {
    return this.httpClient.get<Message>(
      SERVER_URL + '/message/last/' + conversationId
    );
  }
}

