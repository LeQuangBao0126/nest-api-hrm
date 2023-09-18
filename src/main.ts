import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
    prefix: 'v',
  });
  app.use(cookieParser());
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor<any>(reflector));
  app.enableCors({
    origin: true, //cung domain moi cho vo . con * la tat ca
    credentials: true, // allow cookie
    methods: 'HEAD,GET,POST,PUT,PATCH,DELETE',
    preflightContinue: false,
  });

  await app.listen(configService.get('PORT') || 8000).then((_) => {
    console.log('App đang chạy ở port ', configService.get('PORT'));
  });
}
bootstrap();
