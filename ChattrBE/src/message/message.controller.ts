import { Body, Controller, Get, Param, Post, UseGuards, Headers } from '@nestjs/common';
import { MessageService } from './message.service';
import { get } from 'http';
import { AddMessageDto } from 'src/dtos/add-message.dto';
import { IsSelfUserGuard } from 'src/auth/guards/isselfuser.guard';

@Controller('message')
export class MessageController {
    constructor(
        private messageService: MessageService
    ) { }

    @Get('/all/:conversationId')
    async findAllByConversationId(@Param('conversationId') conversationId: number) {
        return await this.messageService.getAllMessagesFromConversation(conversationId);
    }

    @Get('/last/:conversationId')
    async findLastByConversationId(@Param('conversationId') conversationId: number) {
        console.log(conversationId);
        console.log(await this.messageService.getLastMessageFromConversation(conversationId));
        return await this.messageService.getLastMessageFromConversation(conversationId);
    }

    @Post('/add')
    // @UseGuards(IsSelfUserGuard)
    async addMessage(@Body() message: AddMessageDto, @Headers('Authorization') token: string) {
        return await this.messageService.addMessage(message);
    }
}
