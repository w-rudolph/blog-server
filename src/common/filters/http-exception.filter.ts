import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { formatResponse } from '../util';
import { StatusCode } from 'common/error-status';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus && exception.getStatus();
    const errMsg = exception.message.message || exception.message;
    const validHttpStatus = !!HttpStatus[status];
    response
      .status(validHttpStatus ? status : HttpStatus.OK)
      .json(formatResponse({}, status, errMsg, { path: request.url }));
  }
}
