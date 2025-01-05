import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class ConversationMessageGatewayService {
    constructor(
        private conversationService: ConversationService,
        private messageService: MessageService
    ) { }

    async getAllMessagesFromConversationId(conversationId: number) {
        return await this.messageService.getAllMessagesFromConversationId(conversationId);
    }

    async deleteMessage(messageId: number) {
        return await this.messageService.deleteMessage(messageId);
    }

    async getConversationById(conversationId: number) {
        return await this.conversationService.getConversationById(conversationId);
    }
}
