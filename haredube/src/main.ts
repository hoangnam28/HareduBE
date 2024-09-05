import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as i18n from 'i18n';
import * as path from 'path';
import { APP_LOCALES, Locales } from '@common/constants/global.const';
import { setLocal } from './middlewares/locales.middleware';
import { json, urlencoded } from 'express';
import { AuthGuard } from '@guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { EXTRA_MODEL } from '@common/constants/extra-model.const';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import { AllExceptionsFilter } from './exceptions/all-exception.filter';
import LogService from './config/log.service';
import { TrimPipe } from './pipes/trim.pipe';
import { TokenModule } from '@modules/token/token.module';
import { TokensRepository } from '@modules/token/token.repository';
import * as express from 'express';

const PORT = process.env.APP_PORT || 3001;
const BASE_PATH = '/api';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn'],
  });

  app.set('trust proxy', 'loopback');
  app.setGlobalPrefix(BASE_PATH);

  i18n.configure({
    locales: APP_LOCALES,
    defaultLocale: Locales.EN,
    objectNotation: true,
    directory: path.join(__dirname, '/assets/lang'),
  });
  app.use(i18n.init);
  app.use(setLocal);
  app.use(json({ limit: process.env.LIMIT_REQUEST_BODY }));
  app.use(
    urlencoded({
      extended: true,
      limit: process.env.LIMIT_REQUEST_BODY,
    }),
  );
  const tokensRepository = app.select(TokenModule).get(TokensRepository);

  app.useGlobalGuards(new AuthGuard(new Reflector(), new JwtService(), tokensRepository));
  app.enableCors({});
  configSwagger(app);
  app.use('/images', express.static(path.resolve(__dirname, '..', 'public', 'images')));
  app.use('/cv', express.static(path.resolve(__dirname, '..', 'public', 'cv')));
  app.use('/cccd', express.static(path.resolve(__dirname, '..', 'public', 'cccd')));
  app.use('/avatar', express.static(path.resolve(__dirname, '..', 'public', 'avatar')));
  app.use('/video', express.static(path.resolve(__dirname, '..', 'public', 'video')));
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalPipes(new TrimPipe());
  await app.listen(PORT, () => {
    LogService.logInfo(`App is running with port ${PORT}`);
  });
}

function configSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('HarEdu Backend')
    .setDescription('HarEdu Backend API')
    .addBearerAuth({
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const options: SwaggerDocumentOptions = {
    extraModels: EXTRA_MODEL,
  };
  const document = SwaggerModule.createDocument(app, swaggerConfig, options);
  SwaggerModule.setup(BASE_PATH, app, document);
}

bootstrap();
