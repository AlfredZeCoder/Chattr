import { Body, Controller, OnModuleInit, Post, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from 'src/dtos/login.dto';
import { AccessTokenPayloadParser, IAccessTokenPayload, IJwt } from 'src/models/access-token-payload';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AddUserDto } from 'src/dtos/add-user.dto';
import { AddRoleDto } from 'src/dtos/add-role.dto';
import { AuthGuard } from './guards/auth.guard';
import { Public } from 'src/decorators/public.decorator';
import { UserService } from 'src/user/user.service';
import { UserServiceSingleton } from 'src/singletones/user.service.singleton';

@Controller('auth')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AuthController implements OnModuleInit {
    private userService: UserService;

    constructor(
        private authService: AuthService,
        private jwtService: JwtService,
    ) {
    }
    onModuleInit() {
        this.userService = UserServiceSingleton.getInstance();
    }

    @Public()
    @Post('add')
    async addUser(@Body() userP: AddUserDto) {
        const user = await this.userService.addUser(userP);
        const payload = AccessTokenPayloadParser.parseToPayload(user);
        return {
            token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET }),
        };

    }
    @Public()
    @Post('login')
    async login(@Body() loginDto: LogInDto) {

        const user = await this.authService.login(loginDto);
        const payload = AccessTokenPayloadParser.parseToPayload(user);
        return {
            token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET }),
        };

    }

    @Public()
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
            token: await this.jwtService.signAsync(
                payload,
                {
                    secret: process.env.JWT_SECRET
                }
            ),
        };

    }
}
