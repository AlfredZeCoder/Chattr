import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageService } from 'src/message/message.service';
import { AuthServiceSingleton } from 'src/singletones/auth.service.singleton';
import { ConversationServiceSingleton } from 'src/singletones/conversation.service.singleton';
import { MessageServiceSingleton } from 'src/singletones/message.service.singleton';
import { UserServiceSingleton } from 'src/singletones/user.service.singleton';
import { UserService } from 'src/user/user.service';
import { HashingService } from './auth/hashing.service';
import { HashingServiceSingleton } from './singletones/hashing.service.singleton';

@Injectable()
export class AppInitializerService {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly conversationService: ConversationService,
        private readonly messageService: MessageService,
        private readonly hashingService: HashingService,
    ) { }

    async initialize() {
        UserServiceSingleton.setInstance(this.userService);
        AuthServiceSingleton.setInstance(this.authService);
        ConversationServiceSingleton.setInstance(this.conversationService);
        MessageServiceSingleton.setInstance(this.messageService);
        HashingServiceSingleton.setInstance(this.hashingService);
    }
}
