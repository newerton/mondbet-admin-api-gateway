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

    let json = {
      statusCode: 500,
      error: exception.message,
      message: exception.message,
      details: [],
    };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as any;
      const statusCode = exception.getStatus();
      exceptionResponse.statusCode = statusCode;
      exceptionResponse.error = exception.name;
      if (exceptionResponse.details) {
        const details = JSON.parse(JSON.stringify(exceptionResponse.details));
        if (details.query) {
          delete exceptionResponse.details.query;
        }
      }
      json = Object.assign(json, exceptionResponse);
    }
    response.status(json.statusCode).json(json);
  }
}
