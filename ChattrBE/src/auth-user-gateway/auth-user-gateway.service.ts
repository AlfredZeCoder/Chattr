import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AddUserDto } from 'src/dtos/add-user.dto';
import { IJwt } from 'src/models/access-token-payload';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthUserGatewayService {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    async addUser(user: AddUserDto) {
        return await this.userService.addUser(user);
    }

    async findOneByEmail(email: string) {
        return await this.userService.findOneByEmail(email);
    }

    async decipherTokenToPayload(token: IJwt) {
        return await this.authService.decipherTokenToPayload(token);
    }
}
