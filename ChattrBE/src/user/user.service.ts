import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { HashingService } from 'src/auth/hashing.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private hashService: HashingService
    ) { }

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

        console.log(user.conversationsId);
        await this.userRepository.save(user);
    }
}
