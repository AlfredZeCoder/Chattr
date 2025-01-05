import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { HashingService } from 'src/auth/hashing.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthUserGatewayModule } from 'src/auth-user-gateway/auth-user-gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthUserGatewayModule
  ],
  controllers: [UserController],
  providers: [UserService, HashingService],
  exports: [UserService]
})
export class UserModule { }
