import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddConversationDto } from 'src/dtos/add-conversation.dto';
import { Conversation } from 'src/entities/conversation.entity';
import { MessageService } from 'src/message/message.service';
import { MessageServiceSingleton } from 'src/singletones/message.service.singleton';
import { UserServiceSingleton } from 'src/singletones/user.service.singleton';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationService implements OnModuleInit {
    private messageService: MessageService;
    private userService: UserService;

    constructor(
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
    ) {

    }
    onModuleInit() {
        this.messageService = MessageServiceSingleton.getInstance();
        this.userService = UserServiceSingleton.getInstance();
    }

    async getAllConversations(): Promise<Conversation[]> {
        return await this.conversationRepository.find();
    }

    async getConversationById(id: number): Promise<Conversation> {
        if (!id) {
            throw new BadRequestException('Conversation id is required');
        }
        const conversation = await this.conversationRepository.findOneBy({ id });
        if (!conversation) {
            throw new BadRequestException('Conversation not found');
        }
        return conversation;
    }

    async getAllConversationsByUserId(userId: number): Promise<Conversation[]> {
        const user = await this.userService.findOneById(userId);
        const conversations: Conversation[] = await Promise.all(
            user.conversationsId.map((conversationId) =>
                this.getConversationById(conversationId)
            )
        );
        return conversations;
    }

    async getOneConversationByUserId(conversationId: number, userId: number): Promise<Conversation> {
        const conversation = await this.getConversationById(conversationId);
        await this.userService.findOneById(userId);

        if (conversation.createrUserId == userId || conversation.askedUserId == userId) {
            return conversation;
        } else {
            throw new BadRequestException('User is not part of this conversation');
        }
    }

    async createConversation(conversation: AddConversationDto): Promise<Conversation> {
        if (!conversation.createrUserId) {
            throw new BadRequestException('Creater id is required');
        }

        if (!conversation.askedUserId) {
            throw new BadRequestException('Asked user id is required');
        }

        if (conversation.askedUserId === conversation.createrUserId) {
            throw new BadRequestException('Creater and asked user cannot be the same');
        }

        const createrUser = await this.userService.findOneById(conversation.createrUserId);
        const askedUser = await this.userService.findOneById(conversation.askedUserId);

        const conv = new Conversation(
            conversation.createrUserId,
            conversation.askedUserId
        );

        const newConversation = await this.conversationRepository.save(conv)
            .catch(_ => {
                throw new BadRequestException('Failed to save conversation');
            });

        await this.userService.addConversationToUser(createrUser.id, newConversation.id);
        await this.userService.addConversationToUser(askedUser.id, newConversation.id);

        return newConversation;
    }

    async deleteConversation(conversationId: number): Promise<void> {
        if (!conversationId) {
            throw new BadRequestException('Conversation id is required');
        }

        const conversation = await this.getConversationById(conversationId);

        const createrUser = await this.userService.findOneById(conversation.createrUserId);
        const askedUser = await this.userService.findOneById(conversation.askedUserId);

        await this.userService.deleteConversationById(createrUser.id, conversationId);
        await this.userService.deleteConversationById(askedUser.id, conversationId);

        const messages = await this.messageService.getAllMessagesFromConversationId(conversationId);
        await Promise.all(
            messages.map((message) => this.messageService.deleteMessage(message.id))
        );
        await this.conversationRepository.delete(conversationId)
            .catch((error) => {
                throw new BadRequestException('Failed to delete conversation' + error);
            });
    }
}
