import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { AddConversationDto } from 'src/dtos/add-conversation.dto';

@Controller('conversation')
export class ConversationController {

    constructor(
        private conversationService: ConversationService
    ) { }

    @Get('all')
    async findAll() {
        return await this.conversationService.getAllConversations();
    }


    @Post('add')
    async addConversation(@Body() conversation: AddConversationDto) {
        return await this.conversationService.createConversation(conversation);
    }
}
