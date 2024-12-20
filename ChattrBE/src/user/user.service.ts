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
        const user = this.userRepository.findOneBy({ id });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    };

    findOneByEmail = async (email: string): Promise<User> => {
        const user = await this.userRepository.findOne({
            where: { email }
        });

        return user;
    };

}
