import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppInitializerService } from './app-initializer.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appInitializerService = app.select(AppModule).get(AppInitializerService);
  await appInitializerService.initialize();

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
