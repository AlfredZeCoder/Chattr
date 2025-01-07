import { Body, Controller, Get, Param, Post, UseGuards, Headers, Put, ParseIntPipe } from '@nestjs/common';
import { MessageService } from './message.service';
import { AddMessageDto } from 'src/dtos/add-message.dto';
import { IsSelfUserGuard } from 'src/auth/guards/isselfuser.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('message')
export class MessageController {
    constructor(
        private messageService: MessageService
    ) { }

    @Get('/all/:conversationId')
    async findAllByConversationId(@Param('conversationId', ParseIntPipe) conversationId: number) {
        return await this.messageService.getAllMessagesFromConversationId(conversationId);
    }

    @Get('/last/:conversationId')
    async findLastByConversationId(@Param('conversationId', ParseIntPipe) conversationId: number) {
        return await this.messageService.getLastMessageFromConversation(conversationId);
    }

    @Post('/add')
    @UseGuards(IsSelfUserGuard)
    async addMessage(@Body() message: AddMessageDto) {
        return await this.messageService.addMessage(message);
    }

    @Put('/update-read-status/:messageId')
    async changeMessageReadStatus(@Param('messageId', ParseIntPipe) messageId: number) {
        return await this.messageService.changeMessageReadStatus(messageId);
    }

}
