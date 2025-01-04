import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
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
        @Inject(forwardRef(() => ConversationService))
        private conversationService: ConversationService,
        private userService: UserService
    ) { }

    async getAllMessagesFromConversationId(conversationId: number): Promise<Message[]> {
        if (!conversationId) {
            throw new BadRequestException('Conversation id is required');
        }

        await this.conversationService.getConversationById(conversationId);

        const messages = await this.messageRepository.find(
            {
                where: {
                    conversationId: conversationId
                }
            }
        );

        if (!messages) {
            throw new BadRequestException('Messages not found');
        }

        return messages;
    }

    async getMessageById(messageId: number): Promise<Message> {
        if (!messageId) {
            throw new BadRequestException('Message id is required');
        }
        const message = await this.messageRepository.findOneBy(
            {
                id: messageId
            }
        );

        if (!message) {
            throw new BadRequestException('Message not found');
        }

        return message;
    }


    async getLastMessageFromConversation(conversationId: number): Promise<Message> {
        if (!conversationId) {
            throw new BadRequestException('Conversation id is required');
        }

        await this.conversationService.getConversationById(conversationId);

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

    async deleteMessage(messageId: number): Promise<void> {
        if (!messageId) {
            throw new BadRequestException('Message id is required');
        }
        const message = await this.getMessageById(messageId);
        await this.messageRepository.delete(message)
            .catch((error) => {
                throw new BadRequestException('Message could not be deleted' + error);
            });
    }

    async changeMessageReadStatus(messageId: number): Promise<void> {
        if (!messageId) {
            throw new BadRequestException('Message id is required');
        }
        const message = await this.getMessageById(messageId);
        message.isRead = true;
        await this.messageRepository.save(message)
            .catch((error) => {
                throw new BadRequestException('Message could not be updated' + error);
            });
    }
}
