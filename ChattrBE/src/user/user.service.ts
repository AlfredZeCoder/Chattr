import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { HashingService } from 'src/auth/hashing.service';
import { Repository } from 'typeorm';
import { AddUserDto } from 'src/dtos/add-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private hashingService: HashingService
    ) { }

    addUser = async (user: AddUserDto): Promise<User> => {
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

        let newUser = this.userRepository.create(user);
        newUser.password = await this.hashingService.hashPassword(user.password);
        newUser = await this.userRepository.save(newUser);
        return newUser;
    };

    findAll = async (): Promise<User[]> => {
        return await this.userRepository.find();
    };

    findOneById = async (id: number): Promise<User | null> => {
        if (!id || isNaN(id)) {
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
        return user;
    };

    async addConversationToUser(userId: number, conversationId: number): Promise<void> {
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }

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
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }

        if (!conversationId) {
            throw new BadRequestException('Conversation ID is required');
        }

        const user = await this.findOneById(userId);

        if (!user.conversationsId.includes(+conversationId)) {
            throw new UnauthorizedException('User is not part of this conversation');
        }

        for (let i = 0; i < user.conversationsId.length; i++) {
            if (user.conversationsId[i] == conversationId) {
                user.conversationsId.splice(i, 1);
                break;
            }
        }

        await this.userRepository.save(user)
            .catch((error) => {
                throw new BadRequestException('Failed to delete conversation' + error);
            });
    }
    async addPendingRequest(userId: number, askingUserId: number): Promise<void> {
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }
        if (!askingUserId) {
            throw new BadRequestException('User Request ID is required');
        }
        const user = await this.findOneById(userId);
        await this.findOneById(askingUserId);

        for (let i = 0; i < user.pendingUserIdRequests.length; i++) {
            if (user.pendingUserIdRequests[i] == askingUserId) {
                throw new BadRequestException('User already has a pending request from this user');
            }
        }
        user.pendingUserIdRequests.push(askingUserId);
        await this.userRepository.save(user);
    }

    async deletePendingRequest() {
        //TODO
    }

    async acceptPendingRequest() {
        //TODO
    }
}
