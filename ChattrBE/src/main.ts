import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserServiceSingleton } from './singletones/user.service.singleton';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthServiceSingleton } from './singletones/auth.service.singleton';
import { ConversationModule } from './conversation/conversation.module';
import { ConversationService } from './conversation/conversation.service';
import { ConversationServiceSingleton } from './singletones/conversation.service.singleton';
import { MessageService } from './message/message.service';
import { MessageModule } from './message/message.module';
import { MessageServiceSingleton } from './singletones/message.service.singleton';
import { AppInitializerService } from './app-initializer.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appInitializerService = app.select(AppModule).get(AppInitializerService);
  await appInitializerService.initialize();

  // const appInitializerService = app.select(AppModule).get(AppInitializerService);
  // await appInitializerService.initialize();

  // const userService = app.select(UserModule).get(UserService);
  // UserServiceSingleton.setInstance(userService);

  // const authService = app.select(AuthModule).get(AuthService);
  // AuthServiceSingleton.setInstance(authService);


  // const conversationService = app.select(ConversationModule).get(ConversationService);
  // ConversationServiceSingleton.setInstance(conversationService);

  // const messageService = app.select(MessageModule).get(MessageService);
  // MessageServiceSingleton.setInstance(messageService);

  const config = new DocumentBuilder()
    .setTitle('Chattr API')
    .setVersion('1.0')
    .addTag('API')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(3000);
}


bootstrap();
