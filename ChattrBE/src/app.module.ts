import { Module } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Conversation } from "./entities/conversation.entity";
import { Message } from "./entities/message.entity";
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { AuthUserGatewayModule } from './auth-user-gateway/auth-user-gateway.module';
import { ConversationMessageGatewayModule } from './conversation-message-gateway/conversation-message-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get('DB_TYPE') as 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          User,
          Conversation,
          Message
        ],
        synchronize: true,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    UserModule,
    AuthModule,
    ConversationModule,
    MessageModule,
    AuthUserGatewayModule,
    ConversationMessageGatewayModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
