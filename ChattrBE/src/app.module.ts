import { Module } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserModule } from './user/user.module';
import { HashingService } from './services/hashing.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', //change this to ENV variable
      port: 5432,
      username: 'alfred',
      password: 'Password1', //change this to ENV variable
      database: 'chattr',
      entities: [
        User
      ],
      synchronize: true,
    }),
    LoginModule,
    UserModule,

  ],
  controllers: [AppController],
  providers: [AppService, HashingService],
})
export class AppModule { }
