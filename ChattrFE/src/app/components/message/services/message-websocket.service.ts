import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { SERVER_URL, WS_URL } from '../../../../../env';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';
import { Room } from '../models/room.interface';
import { Message } from '../../../shared/models/message.interface';

@Injectable()
export class MessageWebSocketsService {
  private socket!: Socket;

  constructor(
    private httpClient: HttpClient
  ) {
    this.socket = io(WS_URL, { transports: ['websocket'] });
  }


  getRoomHash(conversationId: number) {
    return this.httpClient.get<Room>(
      `${SERVER_URL}/message/get-room-hash/${conversationId}`
    );
  }

  joinRoom(room: Room) {
    this.socket.emit('joinMessageRoom', room);
  }

  leaveRoom(room: Room) {
    this.socket.emit('leaveRoom', room);
  }

  sendMessageToRoom(room: Room, message: Message) {
    this.socket.emit('sendMessageToMessageRoom', { room, message });
  }

  onEvent(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }
}
