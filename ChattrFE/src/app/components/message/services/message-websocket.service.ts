import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { SERVER_URL, WS_URL } from '../../../../../env';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';

@Injectable(
  { providedIn: 'root' }
)
export class MessageWebSocketsService {
  private socket!: Socket;

  constructor(
    private httpClient: HttpClient
  ) {
    this.socket = io(WS_URL, { transports: ['websocket'] });
  }


  getRoomHash(conversationId: number) {
    return this.httpClient.get<{ roomHash: string; }>(
      `${SERVER_URL}/message/get-room-hash/${conversationId}`
    );
  }

  // MAKE ALL THESE OBSERVABLES
  joinRoom(room: string) {
    this.socket.emit('joinRoom', room);
  }

  leaveRoom(room: string) {
    this.socket.emit('leaveRoom', room);
  }

  sendMessageToRoom(room: string, message: string) {
    this.socket.emit('sendMessageToRoom', { room, message });
  }

  onEvent(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }
}
