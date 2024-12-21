import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { UserService } from 'src/user/user.service';
import { LogInDto } from 'src/dtos/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { IAccessTokenPayload, IJwt } from 'src/models/access-token-payload';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private hashingService: HashingService,
        private userService: UserService,
        private jwtService: JwtService
    ) { }


    addUser = async (user: User): Promise<User> => {
        if (await this.userService.findOneByEmail(user.email)) {
            throw new UnauthorizedException('User already exists');
        }
        let newUser = this.userRepository.create(user);
        newUser.password = await this.hashingService.hashPassword(user.password);
        newUser = await this.userRepository.save(newUser);
        return newUser;
    };

    async login(loginDto: LogInDto) {
        const user = await this.userService.findOneByEmail(loginDto.email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const passwordMatch = await this.hashingService.comparePassword(loginDto.password, user.password);

        if (!passwordMatch) {
            throw new BadRequestException('Password incorrect');
        }
        return user;
    }

    async loginWithToken(token: IJwt) {
        const verifiedToken = await this.jwtService.verifyAsync<IAccessTokenPayload>(
            token.token,
            {
                secret: process.env.JWT_SECRET
            }
        ).catch((err) => {
            if (err.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token is expired');
            }
            if (err.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Token is invalid');
            }
        });
        return verifiedToken;
    }
}
