import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingService } from './hashing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule
  ],
  controllers: [AuthController],
  providers: [AuthService, HashingService],
  exports: [AuthService, HashingService],
})
export class AuthModule { }
