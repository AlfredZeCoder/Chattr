import { BadRequestException, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { UserService } from 'src/user/user.service';
import { LogInDto } from 'src/dtos/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { IAccessTokenPayload, IJwt } from 'src/models/access-token-payload';
import { Role } from 'src/models/role.enum';
import { AddRoleDto } from 'src/dtos/add-role.dto';
import { UserServiceSingleton } from 'src/singletones/user.service.singleton';

@Injectable()
export class AuthService implements OnModuleInit {

    private userService: UserService;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private hashingService: HashingService,
        private jwtService: JwtService
    ) {
    }
    onModuleInit() {
        this.userService = UserServiceSingleton.getInstance();
    }


    async login(loginDto: LogInDto) {
        if (!loginDto) {
            throw new BadRequestException('Login data is required');
        }

        if (!loginDto.email) {
            throw new BadRequestException('Email is required');
        }

        if (!loginDto.password) {
            throw new BadRequestException('Password is required');
        }

        const user = await this.userService.findOneByEmail(loginDto.email);

        const passwordMatch = await this.hashingService.comparePassword(loginDto.password, user.password);

        if (!passwordMatch) {
            throw new BadRequestException('Password incorrect');
        }
        return user;
    }

    async loginWithToken(token: IJwt) {
        if (!token || !token.token) {
            throw new BadRequestException('Token is required');
        }

        return await this.decipherTokenToPayload(token);
    }

    async decipherTokenToPayload(token: IJwt) {
        if (!token || !token.token) {
            throw new BadRequestException('Token is required');
        }

        return await this.jwtService.verifyAsync<IAccessTokenPayload>(
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
    }

    async addRole(addRoleDto: AddRoleDto) {
        if (!addRoleDto) {
            throw new BadRequestException('Role data is required');
        }

        if (!addRoleDto.userId) {
            throw new BadRequestException('User ID is required');
        }

        if (!addRoleDto.role) {
            throw new BadRequestException('Role is required');
        }

        const user = await this.userService.findOneById(addRoleDto.userId);

        if (user.role.includes(addRoleDto.role)) {
            throw new BadRequestException('User is already a ' + addRoleDto.role);
        }

        user.role.push(addRoleDto.role);

        await this.userRepository.save(user);

        return user;

    }
}
