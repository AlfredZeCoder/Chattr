import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingService } from './hashing.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthUserGatewayModule } from 'src/auth-user-gateway/auth-user-gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthUserGatewayModule,
    JwtModule
  ],
  controllers: [AuthController],
  providers: [AuthService, HashingService],
  exports: [AuthService],
})
export class AuthModule { }
