import { Controller, Get } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {

    constructor(
        private loginService: LoginService
    ) { }

    @Get('login')
    login(): string {
        return this.loginService.login();
    }
}
