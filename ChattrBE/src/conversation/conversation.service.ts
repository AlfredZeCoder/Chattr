import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddConversationDto } from 'src/dtos/add-conversation.dto';
import { Conversation } from 'src/entities/conversation.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationService {
    constructor(
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private userService: UserService
    ) { }

    async getAllConversations(): Promise<Conversation[]> {
        return await this.conversationRepository.find();
    }

    async createConversation(conversation: AddConversationDto): Promise<Conversation> {
        if (!conversation.askedUserId) {
            throw new BadRequestException('Asked user id is required');
        }

        if (!conversation.createrUserId) {
            throw new BadRequestException('Creater id is required');
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

        const newConversation = await this.conversationRepository.save(conv);

        console.log(newConversation);

        console.log(createrUser);
        console.log(askedUser);

        createrUser.conversationsId.push(newConversation.id);
        askedUser.conversationsId.push(newConversation.id);

        await this.userRepository.save(createrUser);
        await this.userRepository.save(askedUser);

        return newConversation;
    }
}
