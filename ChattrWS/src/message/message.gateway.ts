import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'messages-gateway',
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
  ) { }

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    console.log(`Client ${client.id} joined room: ${room}`);
    this.server.to(room).emit('roomNotification', `User ${client.id} joined the room.`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room);
    console.log(`Client ${client.id} left room: ${room}`);
    this.server.to(room).emit('roomNotification', `User ${client.id} left the room.`);
  }

  @SubscribeMessage('sendMessageToRoom')
  handleMessageToRoom(client: Socket, payload: { room: string; message: string; }): void {
    this.server.to(payload.room).emit('message', payload.message);
  }

}
