import { forwardRef, Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/entities/conversation.entity';
import { UserModule } from 'src/user/user.module';
import { MessageModule } from 'src/message/message.module';
import { MessageService } from 'src/message/message.service';
import { ConversationMessageGatewayModule } from 'src/conversation-message-gateway/conversation-message-gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
    ]),
    UserModule,
    ConversationMessageGatewayModule
  ],
  providers: [ConversationService],
  controllers: [ConversationController],
  exports: [ConversationService]
})
export class ConversationModule { }
