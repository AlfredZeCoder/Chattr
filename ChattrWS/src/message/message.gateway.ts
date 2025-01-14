import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageService } from './message.service';
import { ServerToClientEvents } from 'src/models/server-to-client.interface';
import { ClientToServerEvents } from 'src/models/client-to-server.interface';
import { Logger } from '@nestjs/common';
import { Message } from 'src/models/message.interface';
import { User } from 'src/models/user.interface';

@WebSocketGateway({
  namespace: 'messages-gateway',
})
export class MessageGateway implements OnGatewayConnection {

  constructor(
    private messageService: MessageService
  ) { }

  handleConnection(client: any, ...args: any[]) {
    this.messageService.emmitMessage(client, 'Hello from INIt');
  }

  private logger = new Logger('MessageGateway');

  @SubscribeMessage('chat')
  handleTest(socket: Socket, payload: string) {
    this.logger.log(`Received message: ${payload}`);
    this.messageService.emmitMessage(socket, payload);
    setTimeout(() => {
      this.messageService.emmitMessage(socket, 'Hello from');
    }, 3000);
  }
}
