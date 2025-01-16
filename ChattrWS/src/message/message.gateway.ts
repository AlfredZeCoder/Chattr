import { BadRequestException, Param, UseGuards } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Message } from 'src/models/message.interface';
import { RoomGuard } from 'src/guards/room.guard';
import { Room } from 'src/models/room.interface';

@WebSocketGateway({
  namespace: 'messages-gateway',
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
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
  handleJoinMessageRoom(client: Socket, room: Room): void {
    client.join(room.roomHash);
    console.log(`Client ${client.id} joined room: ${room.roomHash}`);
    this.server.to(room.roomHash).emit('roomNotification', `User ${client.id} joined the room ${room.roomHash}.`);
  }

  @SubscribeMessage('leaveMessageRoom')
  handleLeaveMessageRoom(client: Socket, room: string): void {

    client.leave(room);
    // console.log(`Client ${client.id} left room: ${room}`);
    this.server.to(room).emit('roomNotification', `User ${client.id} left the room.`);
  }

  // @UseGuards(RoomGuard)
  @SubscribeMessage('sendMessageToMessageRoom')
  async handleMessageToMessageRoom(client: Socket, data: { room: Room, message: Message; }) {
    console.log("Room: " + data.room.roomHash);
    console.log("Message: " + data.message.message);

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

}

