import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class MessageService {

    @WebSocketServer() server: Server;

    createRoom(roomId: number) {
        this.server.to(`room-${roomId}`).emit('room-created', `Room ${roomId} has been created`);
    }
}
