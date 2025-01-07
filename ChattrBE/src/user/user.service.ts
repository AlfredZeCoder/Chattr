import { BadRequestException, HttpCode, HttpStatus, ImATeapotException, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { HashingService } from 'src/auth/hashing.service';
import { Repository } from 'typeorm';
import { AddUserDto } from 'src/dtos/add-user.dto';
import { HashingServiceSingleton } from 'src/singletones/hashing.service.singleton';
import { ConversationService } from 'src/conversation/conversation.service';
import { ConversationServiceSingleton } from 'src/singletones/conversation.service.singleton';
import { Conversation } from 'src/entities/conversation.entity';
import { AddConversationDto } from 'src/dtos/add-conversation.dto';

@Injectable()
export class UserService implements OnModuleInit {
    private hashingService: HashingService;
    private conversationService: ConversationService;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    onModuleInit() {
        this.hashingService = HashingServiceSingleton.getInstance();
        this.conversationService = ConversationServiceSingleton.getInstance();
    }

    addUser = async (user: AddUserDto): Promise<User> => {
        if (!user) {
            throw new BadRequestException('User is required');
        }

        if (!user.firstName) {
            throw new BadRequestException('First name is required');
        }

        if (!user.lastName) {
            throw new BadRequestException('Last name is required');
        }

        if (!user.email) {
            throw new BadRequestException('Email is required');
        }
        if (!user.password) {
            throw new BadRequestException('Password is required');
        }

        if (await this.findOneByEmail(user.email)) {
            throw new BadRequestException('User already exists');
        }

        user.password = await this.hashingService.hashPassword(user.password);

        const newUser = await this.userRepository.save(user);
        return newUser;
    };

    findAll = async (): Promise<User[]> => {
        return await this.userRepository.find();
    };

    findOneById = async (id: number): Promise<User | null> => {
        if (!id) {
            throw new BadRequestException('User ID is required');
        }
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return user;
    };

    findOneByEmail = async (email: string): Promise<User> => {
        if (!email) {
            throw new BadRequestException('Email is required');
        }
        const user = await this.userRepository.findOneBy({ email });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        return user;
    };

    async addConversationToUser(userId: number, conversationId: number): Promise<void> {
        if (!conversationId) {
            throw new BadRequestException('Conversation ID is required');
        }

        const user = await this.findOneById(userId);
        if (user.conversationsId.includes(conversationId)) {
            throw new BadRequestException('User already part of this conversation');
        }

        user.conversationsId.push(conversationId);
        await this.userRepository.save(user);
    }


    async deleteConversationById(userId: number, conversationId: number): Promise<void> {
        if (!conversationId) {
            throw new BadRequestException('Conversation ID is required');
        }

        const user = await this.findOneById(userId);

        if (!user.conversationsId.includes(conversationId)) {
            throw new UnauthorizedException('User is not part of this conversation');
        }

        user.conversationsId = user.conversationsId.filter(
            (conversation) => conversation !== conversationId
        );

        await this.userRepository.save(user)
            .catch((error) => {
                throw new BadRequestException('Failed to delete conversation' + error);
            });
    }


    async addPendingRequest(userId: number, askingUserId: number): Promise<void> {
        if (userId == askingUserId) {
            throw new BadRequestException('User cannot add himself as a friend');
        }

        const user = await this.findOneById(userId);
        await this.findOneById(askingUserId);

        for (let i = 0; i < user.pendingUserIdRequests.length; i++) {
            if (user.pendingUserIdRequests[i] == askingUserId) {
                throw new BadRequestException('User already has a pending request from this user');
            }
        }
        const conversations = await this.conversationService.getAllConversationsByUserId(userId);
        conversations.map((conversation) => {
            if ((userId == conversation.createrUserId || userId == conversation.askedUserId) &&
                (askingUserId == conversation.askedUserId || askingUserId == conversation.createrUserId)) {
                throw new BadRequestException('A conversation already exist');
            }
        });
        user.pendingUserIdRequests.push(askingUserId);
        await this.userRepository.save(user);
    }


    async getAllPendingRequestsByUserId(userId: number) {
        return (await this.findOneById(userId)).pendingUserIdRequests;
    }

    async deletePendingRequest(userId: number, askingUserId: number): Promise<void> {
        if (!askingUserId) {
            throw new BadRequestException('askingUserId is required');
        }
        const user = await this.findOneById(userId);
        const previousLength = user.pendingUserIdRequests.length;

        user.pendingUserIdRequests = user.pendingUserIdRequests.filter(
            (pendingRequest) => pendingRequest !== askingUserId
        );

        if (previousLength === user.pendingUserIdRequests.length) {
            throw new BadRequestException('User does not have a pending request from this user');
        }
        await this.userRepository.save(user);
    }

    async acceptPendingRequest(userId: number, askingUserId: number) {
        await this.deletePendingRequest(userId, askingUserId);
        const conversationDto: AddConversationDto = {
            createrUserId: askingUserId,
            askedUserId: userId
        };
        return await this.conversationService.createConversation(conversationDto);
    }
}
