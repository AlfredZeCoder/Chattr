import { Body, Controller, Post, Put, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from 'src/dtos/login.dto';
import { User } from 'src/entities/user.entity';
import { AccessTokenPayloadParser, IAccessTokenPayload, IJwt } from 'src/models/access-token-payload';
import { GetUserDto } from 'src/dtos/get-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AddUserDto } from 'src/dtos/add-user.dto';
import { AddRoleDto } from 'src/dtos/add-role.dto';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService,
        private userService: UserService
    ) { }

    // @ApiProperty({ type: AddUserDto })
    @Post('add')
    async addUser(@Body() userP: AddUserDto) {
        const user = await this.authService.addUser(userP);
        // .then(user => GetUserDto.toDto(user));
        const payload = AccessTokenPayloadParser.parseToPayload(user);
        return {
            token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET }),
        };

    }

    @Post('login')
    async login(@Body() loginDto: LogInDto) {

        const user = await this.authService.login(loginDto);
        const payload = AccessTokenPayloadParser.parseToPayload(user);
        // this.authService.addRole({ token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET }) });
        return {
            token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET }),
        };

    }

    @Post('login-with-token')
    async loginWithToken(@Body() token: IJwt) {
        const payload = <IAccessTokenPayload>await this.authService.loginWithToken(token);
        const user = await this.userService.findOneByEmail(payload.email);
        return {
            token: await this.jwtService.signAsync(
                AccessTokenPayloadParser.parseToPayload(user),
                { secret: process.env.JWT_SECRET }
            ),

        };
    }

    @Put('add-role')
    async addRole(@Body() addRoleDto: AddRoleDto) {
        const user = await this.authService.addRole(addRoleDto);
        const payload = AccessTokenPayloadParser.parseToPayload(user);

        return {
            token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET }),
        };

    }
}
