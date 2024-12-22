import { Injectable, UnauthorizedException } from '@nestjs/common';
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
            throw new Error('User ID is required');
        }
        const user = this.userRepository.findOneBy({ id });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    };

    findOneByEmail = async (email: string): Promise<User> => {
        if (!email) {
            throw new Error('Email is required');
        }
        const user = await this.userRepository.findOneBy({ email });
        return user;
    };

}
