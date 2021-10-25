import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppException } from '../../../../utils/error';
import { ILoggerService } from '../adapter';
import { LoggerService } from '../service';

describe('LoggerService', () => {
  let loggerService: ILoggerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ILoggerService,
          useFactory: (env = 'test') => new LoggerService(env),
        },
      ],
    }).compile();

    loggerService = module.get(ILoggerService);
    loggerService.setContext('TestLog');
  });

  describe('error', () => {
    test('should error successfully', () => {
      const error = new AppException('Error', HttpStatus.INTERNAL_SERVER_ERROR);

      loggerService.error(error);
    });

    test('should error successfully without context', () => {
      const error = new AppException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
      error.context = undefined;

      loggerService.error(error);
    });

    test('should error successfully without statusCode', () => {
      const error = new AppException('Error');
      error.statusCode = undefined;
      error.code = 'TIMEOUT';
      loggerService.error(error);
    });

    test('should error successfully without dev env', () => {
      const error = new AppException('Error', 500);
      error.statusCode = undefined;
      new LoggerService('dev').error(error);
    });
  });
});
