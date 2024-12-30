import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Message } from 'src/entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/entities/conversation.entity';
import { ConversationModule } from 'src/conversation/conversation.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports : [
    TypeOrmModule.forFeature([
      Message,
      Conversation,
    ]),
    ConversationModule,
    UserModule
],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
