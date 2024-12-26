import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { AddConversationDto } from 'src/dtos/add-conversation.dto';
import { RouteInfoPathExtractor } from '@nestjs/core/middleware/route-info-path-extractor';

@Controller('conversation')
export class ConversationController {

    constructor(
        private conversationService: ConversationService
    ) { }

    @Get('all')
    async findAll() {
        return await this.conversationService.getAllConversations();
    }

    @Get('all/:userId')
    async findAllByUserId(@Param('userId') userId: number) {
        return await this.conversationService.getAllConversationsByUserId(userId);
    }

    @Get('one/:conversationId/:userId')
    async findOneByUserId(@Param('conversationId') conversationId: number, @Param('userId') userId: number) {
        return await this.conversationService.getOneConversationByUserId(conversationId, userId);
    }

    @Post('add')
    async addConversation(@Body() conversation: AddConversationDto) {
        return await this.conversationService.createConversation(conversation);
    }
}
