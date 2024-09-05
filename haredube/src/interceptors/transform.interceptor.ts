import { FILE_KEY } from '@common/decorators/common.decorator';
import { BaseResponse } from '@common/interfaces/response.interface';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<BaseResponse<T>> {
    const isResponseFile = this.reflector.get<boolean>(FILE_KEY, context.getHandler());

    if (isResponseFile) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        code: 200,
        success: true,
        message: data?.message || 'Success',
        data: data?.result || data,
      })),
    );
  }
}
