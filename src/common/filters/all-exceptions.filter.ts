import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let json = {
      statusCode: 500,
      error: '',
      message: '',
      details: [],
    };

    if (!this.hasJsonStructure(exception)) {
      const error = exception;
      json.error = exception.name;

      if (error?.statusCode) {
        json.statusCode = error.statusCode;
      }

      if (error?.message) {
        json.message = error.message;
      }

      if (error?.details) {
        json.details = error.details;
      }
    } else {
      const error = JSON.parse(exception);
      status =
        error.response?.statusCode || error?.statusCode || error?.status || 400;

      json = {
        statusCode: status,
        error: exception.name,
        message: error.message,
        details: [],
        ...(error.response || error || ''),
      };
    }
    response.status(status).json(json);
  }

  hasJsonStructure(str: any) {
    if (typeof str !== 'string') return false;
    try {
      const result = JSON.parse(str);
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]' || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }
}
