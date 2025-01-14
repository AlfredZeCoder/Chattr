import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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
export class MessageGateway {

  constructor(
    private messageService: MessageService
  ) { }

  private logger = new Logger('MessageGateway');

  @SubscribeMessage('chat')
  handleTest(socket: Socket, payload: string) {
    this.logger.log(`Received message: ${payload}`);
    socket.emit('chat', 'Hello from the server!');
  }

}
