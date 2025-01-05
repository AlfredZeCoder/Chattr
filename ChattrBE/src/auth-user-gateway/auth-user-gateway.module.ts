import { Module } from '@nestjs/common';
import { AuthUserGatewayService } from './auth-user-gateway.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [AuthUserGatewayService, AuthService, UserService],
  exports: [AuthUserGatewayService]
})
export class AuthUserGatewayModule { }
