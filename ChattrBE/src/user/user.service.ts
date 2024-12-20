import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { HashingService } from 'src/services/hashing.service';
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
        return await this.userRepository.findOneBy({ id });
    };

    findOneByEmail = async (email: string): Promise<User | null> => {
        return await this.userRepository.findOne({
            where: { email }
        });
    };

    addUser = async (user: User): Promise<User> => {
        let newUser = this.userRepository.create(user);
        newUser.password = await this.hashService.hashPassword(user.password);
        newUser = await this.userRepository.save(newUser);
        return newUser;
    };

}
