import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { StatusCode } from '../error-status';
import { formatResponse } from '../util';
export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    call$: Observable<T>,
  ): Observable<Response<T>> {
    return call$.pipe(
      map(data => formatResponse(data, StatusCode.OK)),
      catchError(err => {
        return throwError(
          new HttpException(
            err.message || 'Server Error',
            err.status || HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }),
    );
  }
}
