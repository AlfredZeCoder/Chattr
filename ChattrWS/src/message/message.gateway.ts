import { BadRequestException, Param, UseGuards } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageService } from './message.service';
import { Message } from 'src/models/message.interface';
import { RoomGuard } from 'src/guards/room.guard';

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

  @SubscribeMessage('joinMessageRoom')
  handleJoinMessageRoom(client: Socket, room: string): void {
    const roomName = this.generateRoomName(room);
    client.join(roomName);
    this.server.to(roomName).emit('roomNotification', `User ${client.id} joined the room ${roomName}.`);
  }

  @SubscribeMessage('leaveMessageRoom')
  handleLeaveMessageRoom(client: Socket, room: string): void {

    client.leave(room);
    // console.log(`Client ${client.id} left room: ${room}`);
    this.server.to(room).emit('roomNotification', `User ${client.id} left the room.`);
  }

  @UseGuards(RoomGuard)
  @SubscribeMessage('sendMessageToMessageRoom')
  async handleMessageToMessageRoom(client: Socket, message: Message) {

    // const roomName = this.generateRoomName(message.room);
    // const sockets = await this.server.in(roomName).fetchSockets();
    // console.log(sockets);
    // if (!sockets.some(socket => socket.id === client.id)) {
    //   return;
    // }
    // console.log(args[0][1]);
    // console.log("Message: " + args[0][1]);
    // this.server.to(roomName).emit('message', args[0][1]);
  }

  generateRoomName(room: string): string {
    if (isNaN(parseInt(room, 10))) {
      return;
    }

    return this.messageService.generateRoomName(parseInt(room, 10));
  }

}
