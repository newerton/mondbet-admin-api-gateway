import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter<Error> {
  catch(exception: Error, host: ArgumentsHost) {
    // const error = JSON.parse(JSON.stringify(exception));
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const json = {
      statusCode: 500,
      error: exception.message,
      message: exception.message,
      details: [],
    };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as any;
      json.statusCode = exception.getStatus();
      json.error = exception.name;
      json.message = exceptionResponse.message;
      if (exceptionResponse.details) {
        const details = JSON.parse(JSON.stringify(exceptionResponse.details));
        if (details.query) {
          delete details.query;
        }
        json.details = details;
      }
      // json = Object.assign(json, exceptionResponse);
    }

    if (exception.name === 'PayloadTooLargeError') {
      json.statusCode = 413;
      json.error = 'Payload Too Large';
      json.message = 'Payload Too Large';
      json.details = [
        {
          message: 'Payload Too Large',
          error: 'PayloadTooLargeError',
        },
      ];
    }

    response.status(json.statusCode).json(json);
  }
}
