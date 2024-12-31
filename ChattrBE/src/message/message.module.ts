import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Message } from 'src/entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/entities/conversation.entity';
import { ConversationModule } from 'src/conversation/conversation.module';
import { UserModule } from 'src/user/user.module';
import { IsSelfUserGuard } from 'src/auth/guards/isselfuser.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports : [
    TypeOrmModule.forFeature([
      Message,
      Conversation,
    ]),
    ConversationModule,
    UserModule,
    AuthModule
],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
