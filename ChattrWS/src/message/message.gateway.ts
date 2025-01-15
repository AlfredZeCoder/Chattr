import { BadRequestException, Param } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({
  namespace: 'messages-gateway',
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private messageService: MessageService
  ) { }

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    const roomName = this.generateRoomName(room);

    client.join(roomName);
    // console.log(`Client ${client.id} joined room: Room-${room}`);
    this.server.to(roomName).emit('roomNotification', `User ${client.id} joined the room ${roomName}.`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room);
    // console.log(`Client ${client.id} left room: ${room}`);
    this.server.to(room).emit('roomNotification', `User ${client.id} left the room.`);
  }

  @SubscribeMessage('sendMessageToRoom')
  async handleMessageToRoom(client: Socket, payload: { room: string; message: string; }) {

    const roomName = this.generateRoomName(payload.room);

    const sockets = await this.server.in(roomName).fetchSockets();
    if (!sockets.some(socket => socket.id === client.id)) {
      return;
    }
    this.server.to(roomName).emit('message', `User ${client.id} sent a message to room ${roomName}: ${payload.message}`);
  }

  generateRoomName(room: string): string {
    if (isNaN(parseInt(room, 10))) {
      return;
    }

    return this.messageService.generateRoomName(parseInt(room, 10));
  }

}
