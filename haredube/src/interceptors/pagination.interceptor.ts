import { PaginateResponse } from '@common/interfaces/response.interface';
import { getPagination } from '@common/utils/helper.utils';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginationInterceptor<T> implements NestInterceptor<T, PaginateResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<PaginateResponse<T>> {
    return next.handle().pipe(
      map((result) => {
        const request = context.switchToHttp().getRequest();
        const pagination = getPagination(request);

        const total = result?.total || 0;
        const page = Number(pagination.page);
        const size = !page ? total : Number(pagination.size);
        const lastPage = total < size ? 1 : Math.ceil(total / size);
        return { records: result?.data || [], total, lastPage, page, size };
      }),
    );
  }
}
