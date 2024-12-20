import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { GetUserDto } from 'src/dtos/get-user.dto';

@Controller('user')
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    @Get('all')
    async findAll() {
        const users = await this.userService.findAll();
        return users.map(user => GetUserDto.toDto(user));

    }

    @Post('add')
    async addUser(@Body() user: User) {
        return this.userService.addUser(user)
            .then(user => GetUserDto.toDto(user));
    }
}
