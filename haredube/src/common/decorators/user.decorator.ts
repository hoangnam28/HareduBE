import { getUserTokenByRequest } from '@guards/guard.helper';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Profile = createParamDecorator(async (_: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return getUserTokenByRequest(request);
});
