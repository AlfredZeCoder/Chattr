import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable(
  { providedIn: 'root' }
)
export class MessageWebSocketsService {
  private socket!: Socket;

  constructor() {
    this.socket = io('http://localhost:3001/messages-gateway', { transports: ['websocket'] });
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
