import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddMessageDto } from 'src/dtos/add-message.dto';
import { Message } from 'src/entities/message.entity';
import { Repository } from 'typeorm';
import { ConversationService } from 'src/conversation/conversation.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        private conversationService: ConversationService,
        private userService: UserService
    ) { }

    async getAllMessagesFromConversation(conversationId: number): Promise<Message[]> {
        if (!conversationId) {
            throw new BadRequestException('Conversation id is required');
        }
        const messages = await this.messageRepository.find(
            {
                where: {
                    conversationId: conversationId
                }
            }
        );
        return messages;
    }

    async getLastMessageFromConversation(conversationId: number): Promise<Message> {
        if (!conversationId) {
            throw new BadRequestException('Conversation id is required');
        }
        const message = await this.messageRepository.findOne(
            {
                where: {
                    conversationId: conversationId
                },
                order: {
                    timestamp: 'DESC'
                }
            }
        );
        return message;
    }

    async addMessage(message: AddMessageDto): Promise<void> {
        if (!message.conversationId) {
            throw new BadRequestException('Conversation id is required');
        }
        if (!message.senderId) {
            throw new BadRequestException('Sender id is required');
        }

        if (!message.message) {
            throw new BadRequestException('Message text is required');
        }
        if (!message.timestamp) {
            throw new BadRequestException('Timestamp is required');
        }
        await this.userService.findOneById(message.senderId);
        await this.conversationService.getConversationById(message.conversationId);
        await this.messageRepository.save(message);
    }
}
