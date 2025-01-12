import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../../env';
import { Conversation } from '../shared/models/conversation.interface';

@Injectable({
  providedIn: 'root'
})
export class PendingRequestService {

  constructor(
    private httpClient: HttpClient
  ) { }

  addPendingRequest$(userEmail: string, askingUseId: number) {
    return this.httpClient.put<Conversation>(
      SERVER_URL + '/user/add-conversation-request/' + userEmail + '/' + askingUseId,
      {}
    );
  }

  acceptPendingRequest$(userId: number, askingUseId: number) {
    return this.httpClient.put<Conversation>(
      SERVER_URL + '/user/accept-conversation-request/' + userId + '/' + askingUseId,
      {}
    );
  }

  deletePendingRequest$(userId: number, askingUseId: number) {
    return this.httpClient.put(
      SERVER_URL + '/user/delete-pending-request/' + userId + '/' + askingUseId,
      {}
    );
  }
}
