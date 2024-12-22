import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { UserService } from 'src/user/user.service';
import { LogInDto } from 'src/dtos/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { IAccessTokenPayload, IJwt } from 'src/models/access-token-payload';
import { AddUserDto } from 'src/dtos/add-user.dto';
import { Role } from 'src/models/role.enum';
import { AddRoleDto } from 'src/dtos/add-role.dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private hashingService: HashingService,
        private userService: UserService,
        private jwtService: JwtService
    ) { }


    addUser = async (user: AddUserDto): Promise<User> => {
        if (await this.userService.findOneByEmail(user.email)) {
            throw new BadRequestException('User already exists');
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
        return await this.decipherTokenToPayload(token);
    }

    async decipherTokenToPayload(token: IJwt) {
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

    async addRole(addRoleDto: AddRoleDto) {
        const user = await this.userService.findOneById(addRoleDto.userId);

        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (!addRoleDto.role) {
            throw new BadRequestException('Wrong role');
        }

        if (user.role.includes(addRoleDto.role as Role)) {
            throw new BadRequestException('User is already a ' + addRoleDto.role);
        }

        user.role.push(addRoleDto.role as Role);

        await this.userRepository.save(user);

        return user;

    }
}
