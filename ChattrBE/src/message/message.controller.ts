import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { get } from 'http';
import { AddMessageDto } from 'src/dtos/add-message.dto';

@Controller('message')
export class MessageController {
    constructor(
        private messageService: MessageService
    ) { }

    @Get('/all/:conversationId')
    async findAllByConversationId(@Param('conversationId') conversationId: number) {
        return await this.messageService.getAllMessagesFromConversation(conversationId);
    }

    @Post('/add')
    async addMessage(@Body() message : AddMessageDto){
        return await this.messageService.addMessage(message);
    }
}
