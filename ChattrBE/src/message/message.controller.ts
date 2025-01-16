import { Body, Controller, Get, Param, Post, UseGuards, Headers, Put, ParseIntPipe, OnModuleInit } from '@nestjs/common';
import { MessageService } from './message.service';
import { AddMessageDto } from 'src/dtos/add-message.dto';
import { IsSelfUserGuard } from 'src/auth/guards/isselfuser.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { HashingService } from 'src/auth/hashing.service';
import { HashingServiceSingleton } from 'src/singletones/hashing.service.singleton';

@ApiBearerAuth()
@Controller('message')
export class MessageController implements OnModuleInit {
    private hashingService: HashingService;

    constructor(
        private messageService: MessageService
    ) { }

    onModuleInit() {
        this.hashingService = HashingServiceSingleton.getInstance();
    }

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

    @Get('get-room-hash/:id')
    async getRoomHash(@Param('id', ParseIntPipe) id: number) {
        return {
            roomHash: this.hashingService.generateRoomHash(id)
        };
    }

}
