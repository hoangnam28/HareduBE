import { Pagination } from '@common/interfaces/filter.interface';
import { getPagination } from '@common/utils/helper.utils';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetPagination = createParamDecorator((_, ctx: ExecutionContext): Pagination => {
  const req: Request = ctx.switchToHttp().getRequest();
  return getPagination(req);
});
