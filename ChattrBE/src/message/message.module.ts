import { forwardRef, Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Message } from 'src/entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationModule } from 'src/conversation/conversation.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConversationMessageGatewayModule } from 'src/conversation-message-gateway/conversation-message-gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
    ]),
    ConversationMessageGatewayModule,
    UserModule,
    AuthModule
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService]
})
export class MessageModule { }
