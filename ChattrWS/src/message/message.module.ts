import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';

@Module({
  providers: [MessageGateway, MessageService]
})
export class MessageModule { }
