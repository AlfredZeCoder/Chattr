import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/entities/conversation.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
      User
    ]),
    UserModule
  ],
  providers: [ConversationService],
  controllers: [ConversationController]
})
export class ConversationModule { }
