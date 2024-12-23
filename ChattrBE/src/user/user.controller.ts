import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserDto } from 'src/dtos/get-user.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/models/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    @UseGuards(RoleGuard)
    @Roles(Role.Admin)
    @Get('all')
    async findAll() {
        const users = await this.userService.findAll();
        return users.map(user => GetUserDto.toDto(user));

    }
}
