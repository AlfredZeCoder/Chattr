import { Controller, Get, UseGuards, Headers, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserDto } from 'src/dtos/get-user.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/models/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { IAccessTokenPayload, IJwt } from 'src/models/access-token-payload';
import { Public } from 'src/decorators/public.decorator';

@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    @UseGuards(RoleGuard)
    @Roles(Role.Admin)
    @Get('all')
    async findAll() {
        const users = await this.userService.findAll();
        return users.map(user => GetUserDto.toDto(user));

    }

    @Get('one-by-id-from-token')
    async findOneById(@Headers('Authorization') authorization: string) {
        const token: IJwt = {
            token: authorization.split(' ')[1]
        };
        const payload = await this.authService.decipherTokenToPayload(token) as IAccessTokenPayload;
        const user = await this.userService.findOneById(payload.sub);
        return GetUserDto.toDto(user);
    }
    @Public()
    @Get('one-by-id/:id')
    async findOneByIdFromParam(@Param('id') id: number) {
        const user = await this.userService.findOneById(id);
        return GetUserDto.toDto(user);
    }
}
