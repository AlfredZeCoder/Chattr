import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
export class MessageService {

    @WebSocketServer() server: Server;

    createRoom(roomId: number) {
        this.server.to(`room-${roomId}`).emit('room-created', `Room ${roomId} has been created`);
    }

    emmitMessage(socket: Socket, message: string) {
        socket.emit('chat', message);
        // this.server.emit(socket.eventNames()[0] as string, message);
    }

}
