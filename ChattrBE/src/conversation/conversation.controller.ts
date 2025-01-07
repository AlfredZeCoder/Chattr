import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
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
    async findAllByUserId(@Param('userId', ParseIntPipe) userId: number) {
        return await this.conversationService.getAllConversationsByUserId(userId);
    }

    @Get('one/:conversationId/:userId')
    async findOneByUserId(@Param('conversationId', ParseIntPipe) conversationId: number, @Param('userId', ParseIntPipe) userId: number) {
        return await this.conversationService.getOneConversationByUserId(conversationId, userId);
    }

    @Post('add')
    async addConversation(@Body() conversation: AddConversationDto) {
        return await this.conversationService.createConversation(conversation);
    }

    @Delete('delete/:conversationId')
    async deleteConversation(@Param('conversationId', ParseIntPipe) conversationId: number) {
        return await this.conversationService.deleteConversation(conversationId);
    }
}
