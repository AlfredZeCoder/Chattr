import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: Socket;

  constructor() {
    this.socket = io('http://localhost:3001/messages-gateway', { transports: ['websocket'] });
  }

  emmit(data: any) {
    this.socket.emit('chat', data);
  }

  get() {
    return new Observable((observer) => {
      this.socket.on('chat', (data) => {
        observer.next(data);
      });
    });
  }
}
