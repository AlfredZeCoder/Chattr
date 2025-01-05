import { forwardRef, Module } from '@nestjs/common';
import { ConversationMessageGatewayService } from './conversation-message-gateway.service';
import { MessageService } from 'src/message/message.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { ConversationModule } from 'src/conversation/conversation.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  providers: [ConversationMessageGatewayService, MessageService, ConversationService],
  exports: [ConversationMessageGatewayService]
})
export class ConversationMessageGatewayModule { }
