import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import csurf from 'csurf';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.enableShutdownHooks(); // Disable in test

  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ['etag', 'x-next-cursor', 'x-prev-cursor'],
  });

  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '25mb' }));
  app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));
  app.use(helmet());

  if (process.env.NODE_ENV === 'production') {
    app.use(csurf({ cookie: true }));
  }

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('The Admin API Gateway description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Admin API Gateway Docs',
  };
  SwaggerModule.setup('docs', app, document, customOptions);

  await app.startAllMicroservices();
  await app.listen(8000, () => logger.log('admin-api-gateway is running'));
}

bootstrap();
