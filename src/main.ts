import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Settings } from './config/settings';
import { AppExceptionFilter } from './filters/http-exception.filter';
import { ExceptionInterceptor } from './interceptors/http-exception.interceptor';
import { AppModule } from './modules/app.module';
import { LoggerService } from './modules/common/logger/service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalInterceptors(new ExceptionInterceptor());

  const loggingService = new LoggerService(new Settings());
  app.useLogger(loggingService);

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  const { ENV, PORT } = new Settings();

  loggingService.log(
    `API listening at ${PORT} on ${ENV.toUpperCase()} 🚀\n`,
    'Started....',
  );

  await app.listen(PORT);
}

bootstrap();
